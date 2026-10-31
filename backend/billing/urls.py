from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user,
    create_staff_member,
    trigger_batch_billing,
    ProductViewSet,
    PlanViewSet,
    SubscriptionViewSet,
    InvoiceViewSet,
    PaymentViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('admin/create-staff/', create_staff_member, name='create-staff'),
    path('billing/run-batch/', trigger_batch_billing, name='run-batch'),
    path('', include(router.urls)),
]