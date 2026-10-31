from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from .models import (
    Discount,
    DiscountType,
    Invoice,
    InvoiceLine,
    InvoiceStatus,
    Payment,
    Subscription,
    SubscriptionStatus,
)


def _invoice_totals(sub):
    lines = list(sub.lines.select_related('product'))
    if not lines:
        subtotal = sub.plan.price
        return [], subtotal, Decimal('0.00')

    invoice_lines = []
    subtotal = Decimal('0.00')
    tax_amount = Decimal('0.00')
    for line in lines:
        amount = line.quantity * line.unit_price
        subtotal += amount
        tax_amount += amount * line.tax_rate / Decimal('100')
        invoice_lines.append({
            'product': line.product,
            'quantity': line.quantity,
            'unit_price': line.unit_price,
            'tax_rate': line.tax_rate,
            'amount': amount,
        })
    return invoice_lines, subtotal, tax_amount


def run_batch_billing():
    active_subs = Subscription.objects.filter(status=SubscriptionStatus.ACTIVE)
    created_invoices = []

    with transaction.atomic():
        for sub in active_subs.select_related('customer', 'plan'):
            if Invoice.objects.filter(
                subscription=sub,
                status__in=[InvoiceStatus.DRAFT, InvoiceStatus.CONFIRMED],
            ).exists():
                continue

            line_data, subtotal, tax_amount = _invoice_totals(sub)
            discount = None
            discount_amount = Decimal('0.00')
            for candidate in Discount.objects.filter(is_active=True):
                if candidate.is_valid_for(subtotal, 1):
                    discount = candidate
                    if candidate.discount_type == DiscountType.PERCENTAGE:
                        discount_amount = subtotal * candidate.value / 100
                    else:
                        discount_amount = candidate.value
                    discount_amount = min(discount_amount, subtotal)
                    break

            total = subtotal + tax_amount - discount_amount
            invoice = Invoice.objects.create(
                subscription=sub,
                customer=sub.customer,
                subtotal=subtotal,
                tax_amount=tax_amount,
                discount_amount=discount_amount,
                discount=discount,
                total_amount=total,
                due_date=timezone.localdate(),
                status=InvoiceStatus.DRAFT,
            )
            InvoiceLine.objects.bulk_create(
                [InvoiceLine(invoice=invoice, **data) for data in line_data]
            )
            if discount:
                discount.uses_count += 1
                discount.save(update_fields=['uses_count'])
            created_invoices.append(invoice)

    return created_invoices


def record_payment_for_invoice(invoice_id, payment_method, amount, notes=None):
    if amount <= 0:
        raise ValueError('Payment amount must be positive.')

    with transaction.atomic():
        invoice = Invoice.objects.select_for_update().get(id=invoice_id)
        total_paid = sum(p.amount for p in invoice.payments.all())
        if total_paid + amount > invoice.total_amount:
            raise ValueError('Payment exceeds the invoice balance.')

        payment = Payment.objects.create(
            invoice=invoice,
            payment_method=payment_method,
            amount=amount,
            notes=notes,
        )
        if total_paid + amount == invoice.total_amount:
            invoice.status = InvoiceStatus.PAID
            invoice.save(update_fields=['status'])
        return payment
