from decimal import Decimal
from django.db import transaction
from .models import Subscription, SubscriptionStatus, Invoice, InvoiceStatus

def run_batch_billing():
    active_subs = Subscription.objects.filter(status=SubscriptionStatus.ACTIVE)
    created_invoices = []

    with transaction.atomic():
        for sub in active_subs:
            # Idempotency Guard: prevent duplicate invoices for the same period
            already_billed = Invoice.objects.filter(
                subscription=sub,
                status__in=[InvoiceStatus.DRAFT, InvoiceStatus.CONFIRMED]
            ).exists()

            if already_billed:
                continue

            subtotal = Decimal('100.00') # Base item total
            tax_amount = subtotal * Decimal('0.18')
            total = subtotal + tax_amount

            invoice = Invoice.objects.create(
                subscription=sub,
                customer=sub.customer,
                subtotal=subtotal,
                tax_amount=tax_amount,
                discount_amount=Decimal('0.00'),
                total_amount=total,
                status=InvoiceStatus.DRAFT
            )
            created_invoices.append(invoice)

    return created_invoices

from decimal import Decimal
from django.db import transaction
from .models import Invoice, InvoiceStatus, Payment


def record_payment_for_invoice(
    invoice_id, payment_method, amount, notes=None
):
  """Records a payment against an invoice and updates its status to PAID when fully settled."""
  with transaction.atomic():
    invoice = Invoice.objects.select_for_update().get(id=invoice_id)

    # Create payment record
    payment = Payment.objects.create(
        invoice=invoice,
        payment_method=payment_method,
        amount=amount,
        notes=notes,
    )

    # Calculate total paid so far
    total_paid = sum(p.amount for p in invoice.payments.all())

    # Update invoice status if fully paid
    if total_paid >= invoice.total_amount:
      invoice.status = InvoiceStatus.PAID
      invoice.save()

    return payment