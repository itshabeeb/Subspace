from django.db import models

# Create your models here.
from decimal import Decimal
from django.contrib.auth.models import AbstractUser

class Role(models.TextChoices):
  ADMIN = 'ADMIN', 'Admin'
  STAFF = 'STAFF', 'Staff'
  CUSTOMER = 'CUSTOMER', 'Customer'

class User(AbstractUser):
  email = models.EmailField(unique=True)
  role = models.CharField(
      max_length=10, choices=Role.choices, default=Role.CUSTOMER
  )

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']


class Product(models.Model):
  name = models.CharField(max_length=255)
  product_type = models.CharField(max_length=100)
  sales_price = models.DecimalField(max_digits=10, decimal_places=2)
  cost_price = models.DecimalField(max_digits=10, decimal_places=2)
  notes = models.TextField(blank=True, null=True)


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='variants' # <-- Fix here
    )
    brand_name = models.CharField(max_length=100)
    extra_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal('0.00')
    )


class Plan(models.Model):
  class Cycle(models.TextChoices):
    DAILY = 'DAILY', 'Daily'
    WEEKLY = 'WEEKLY', 'Weekly'
    MONTHLY = 'MONTHLY', 'Monthly'
    YEARLY = 'YEARLY', 'Yearly'

  name = models.CharField(max_length=100)
  billing_cycle = models.CharField(
      max_length=20, choices=Cycle.choices, default=Cycle.MONTHLY
  )
  min_quantity = models.IntegerField(default=1)
  start_date = models.DateField()
  end_date = models.DateField(blank=True, null=True)
  auto_close = models.BooleanField(default=False)


class SubscriptionStatus(models.TextChoices):
  DRAFT = 'DRAFT', 'Draft'
  QUOTATION = 'QUOTATION', 'Quotation'
  CONFIRMED = 'CONFIRMED', 'Confirmed'
  ACTIVE = 'ACTIVE', 'Active'
  CLOSED = 'CLOSED', 'Closed'


class Subscription(models.Model):
  subscription_number = models.CharField(max_length=50, unique=True)
  customer = models.ForeignKey(
      User, on_delete=models.CASCADE, related_name='subscriptions'
  )
  plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
  status = models.CharField(
      max_length=20,
      choices=SubscriptionStatus.choices,
      default=SubscriptionStatus.DRAFT,
  )
  start_date = models.DateField()
  expiry_date = models.DateField()
  created_at = models.DateTimeField(auto_now_add=True)


class InvoiceStatus(models.TextChoices):
  DRAFT = 'DRAFT', 'Draft'
  CONFIRMED = 'CONFIRMED', 'Confirmed'
  PAID = 'PAID', 'Paid'


class Invoice(models.Model):
  subscription = models.ForeignKey(
      Subscription, on_delete=models.CASCADE, related_name='invoices'
  )
  customer = models.ForeignKey(User, on_delete=models.CASCADE)
  subtotal = models.DecimalField(max_digits=10, decimal_places=2)
  tax_amount = models.DecimalField(
      max_digits=10, decimal_places=2, default=Decimal('0.00')
  )
  discount_amount = models.DecimalField(
      max_digits=10, decimal_places=2, default=Decimal('0.00')
  )
  total_amount = models.DecimalField(max_digits=10, decimal_places=2)
  status = models.CharField(
      max_length=20,
      choices=InvoiceStatus.choices,
      default=InvoiceStatus.DRAFT,
  )
  created_at = models.DateTimeField(auto_now_add=True)


class Payment(models.Model):
  invoice = models.ForeignKey(
      Invoice, on_delete=models.CASCADE, related_name='payments'
  )
  payment_method = models.CharField(
      max_length=50
  )  # Bank Transfer, Card, Cash
  amount = models.DecimalField(max_digits=10, decimal_places=2)
  payment_date = models.DateField(auto_now_add=True)
  notes = models.TextField(blank=True, null=True)