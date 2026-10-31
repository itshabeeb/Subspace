from decimal import Decimal, InvalidOperation

from django.contrib.auth import authenticate, login
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import (
    Discount,
    Invoice,
    Payment,
    Plan,
    Product,
    Role,
    Subscription,
    User,
)
from .serializers import (
    UserRegisterSerializer,
    UserSerializer,
    AdminCreateStaffSerializer,
    ProductSerializer,
    PlanSerializer,
    SubscriptionSerializer,
    InvoiceSerializer,
    PaymentSerializer,
    DiscountSerializer,
)
from .services import record_payment_for_invoice, run_batch_billing


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.ADMIN
        )


class IsStaffRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in (Role.ADMIN, Role.STAFF)
        )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Public registration endpoint for customer accounts."""
    if request.method == 'GET':
        return Response({
            'message': (
                'Send a POST request with username, email, and password to'
                ' register.'
            )
        })

    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {'user': UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    identifier = request.data.get('email') or request.data.get('username')
    password = request.data.get('password')

    if not identifier or not password:
        return Response(
            {'error': 'Email/username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.filter(email=identifier).first()
    if user is None:
        user = User.objects.filter(username=identifier).first()

    authenticated_user = None
    if user is not None:
        authenticated_user = authenticate(
            username=user.email,
            password=password,
        )
    if authenticated_user is None:
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    login(request, authenticated_user)
    return Response({'user': UserSerializer(authenticated_user).data})


@api_view(['POST'])
@permission_classes([IsAdminRole])
def create_staff_member(request):
    """
    Protected endpoint: Only ADMIN users can add new internal staff members.
    """
    serializer = AdminCreateStaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsStaffRole])
def customer_list(request):
    customers = User.objects.filter(role=Role.CUSTOMER).order_by('id')
    return Response(UserSerializer(customers, many=True).data)


@api_view(['GET'])
@permission_classes([IsStaffRole])
def report_stats(request):
    paid_revenue = (
        Payment.objects.aggregate(total=Sum('amount'))['total']
        or Decimal('0.00')
    )
    return Response({
        'customers': User.objects.filter(role=Role.CUSTOMER).count(),
        'staff': User.objects.filter(role=Role.STAFF).count(),
        'products': Product.objects.count(),
        'subscriptions': Subscription.objects.count(),
        'invoices': Invoice.objects.count(),
        'payments': Payment.objects.count(),
        'revenue': paid_revenue,
    })


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


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request, invoice_id):
    """Record a payment against an invoice."""
    amount = request.data.get('amount')
    payment_method = request.data.get('payment_method', 'Bank Transfer')
    notes = request.data.get('notes', '')

    if amount in (None, ''):
        return Response(
            {'error': 'Amount is required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        payment = record_payment_for_invoice(
            invoice_id,
            payment_method,
            Decimal(str(amount)),
            notes,
        )
    except Invoice.DoesNotExist:
        return Response(
            {'error': 'Invoice not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )
    except (InvalidOperation, TypeError, ValueError):
        return Response(
            {'error': 'Amount must be a valid number.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        PaymentSerializer(payment).data,
        status=status.HTTP_201_CREATED,
    )