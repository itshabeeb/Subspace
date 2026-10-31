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