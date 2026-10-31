from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user,
    login_user,
    create_staff_member,
    customer_list,
    report_stats,
    password_reset_request,
    password_reset_confirm,
    trigger_batch_billing,
    ProductViewSet,
    PlanViewSet,
    SubscriptionViewSet,
    InvoiceViewSet,
    PaymentViewSet,
    DiscountViewSet,
    TaxViewSet,
    process_payment,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'taxes', TaxViewSet)

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('admin/create-staff/', create_staff_member, name='create-staff'),
    path('customers/', customer_list, name='customers'),
    path('reports/stats/', report_stats, name='report-stats'),
    path('auth/password-reset/', password_reset_request, name='password-reset'),
    path(
        'auth/password-reset/confirm/',
        password_reset_confirm,
        name='password-reset-confirm',
    ),
    path('billing/run-batch/', trigger_batch_billing, name='run-batch'),
    path(
        'invoices/<int:invoice_id>/pay/',
        process_payment,
        name='process-payment',
    ),
    path('', include(router.urls)),
]