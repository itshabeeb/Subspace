import re
from decimal import Decimal
from rest_framework import serializers
from .models import Role, User, Product, ProductVariant, Plan, Subscription, Invoice, Payment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Public self-registration serializer.
    Strictly forces Role.CUSTOMER to prevent privilege escalation.
    Enforces password complexity requirements (>8 chars, uppercase, lowercase, special char).
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role']
        read_only_fields = ['role']  # Rejects role input from public requests

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        # Force CUSTOMER role for all public self-registrations
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=Role.CUSTOMER
        )
        return user


class AdminCreateStaffSerializer(serializers.ModelSerializer):
    """
    Admin-only serializer for creating internal staff members.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', Role.STAFF)
        )
        return user


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    customer_email = serializers.ReadOnlyField(source='customer.email')
    plan_name = serializers.ReadOnlyField(source='plan.name')

    class Meta:
        model = Subscription
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = Invoice
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'