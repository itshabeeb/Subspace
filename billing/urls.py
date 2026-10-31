from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_user, trigger_batch_billing, ProductViewSet, SubscriptionViewSet, InvoiceViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('billing/run-batch/', trigger_batch_billing, name='run-batch'),
    path('', include(router.urls)),
]