from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Product, Plan, Subscription, Invoice, Payment
from .serializers import (
    UserRegisterSerializer,
    AdminCreateStaffSerializer,
    ProductSerializer,
    PlanSerializer,
    SubscriptionSerializer,
    InvoiceSerializer,
    PaymentSerializer
)
from .services import run_batch_billing


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Public registration endpoint. Users registering here are assigned the CUSTOMER role.
    """
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_staff_member(request):
    """
    Protected endpoint: Only ADMIN users can add new internal staff members.
    """
    serializer = AdminCreateStaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trigger_batch_billing(request):
    """
    Triggers billing day batch processing for active subscriptions.
    """
    invoices = run_batch_billing()
    return Response(
        {"message": f"Successfully processed batch billing. Created {len(invoices)} invoices."},
        status=status.HTTP_200_OK
    )


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer