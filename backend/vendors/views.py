from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404
from django.db import IntegrityError, transaction
from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
from psycopg2.errors import UniqueViolation
import logging

from .models import Vendor
from .serializers import VendorSerializer, VendorPublicSerializer
from .tasks import send_vendor_approval_email, send_vendor_rejection_email
from .permissions import IsOwnerOfVendor, IsAdminUser

logger = logging.getLogger(__name__)


class VendorThrottle(UserRateThrottle):
    rate = '100/day'
    scope = 'vendor_operations'


class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [VendorThrottle]

    def get_permissions(self):
        if self.action in ['create', 'retrieve', 'update', 'partial_update', 'destroy', 'deactivate']:
            return [permissions.IsAuthenticated(), IsOwnerOfVendor()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            return Vendor.objects.filter(is_verified=True, is_active=True).select_related('user').prefetch_related('products')

        if user and not isinstance(user, AnonymousUser):
            if user.is_staff:
                return Vendor.objects.all()
            return Vendor.objects.filter(user=user)

        return Vendor.objects.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return VendorPublicSerializer
        return VendorSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page or queryset, many=True)
        return self.get_paginated_response(serializer.data) if page else Response(serializer.data)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            if hasattr(request.user, 'vendor'):
                raise ValidationError({'detail': 'You already have a vendor account.'})

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError as ve:
            logger.warning(f"Validation error: {ve.detail}")
            return Response(ve.detail, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as ie:
            error_message = "Duplicate entry." if isinstance(ie.__cause__, UniqueViolation) else "Database integrity error."
            logger.error(f"IntegrityError: {ie}")
            return Response({"detail": error_message}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception("Unexpected error during vendor creation.")
            return Response({"detail": "Unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def deactivate(self, request, pk=None):
        vendor = self.get_object()
        if vendor.user != request.user:
            raise PermissionDenied("You are not authorized to deactivate this account.")

        vendor.is_active = False
        vendor.deactivated_at = timezone.now()
        vendor.save()
        return Response({'status': 'Vendor account deactivated.'}, status=status.HTTP_200_OK)


class VendorAdminViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all().select_related('user')
    serializer_class = VendorSerializer
    permission_classes = [IsAdminUser]
    throttle_classes = [UserRateThrottle]

    def _paginated_or_full_response(self, queryset):
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page or queryset, many=True)
        return self.get_paginated_response(serializer.data) if page else Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        pending_vendors = Vendor.objects.filter(is_verified=False)
        if not pending_vendors.exists():
            return Response({'message': 'No pending vendors found.'}, status=status.HTTP_404_NOT_FOUND)
        return self._paginated_or_full_response(pending_vendors)

    @transaction.atomic
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        try:
            vendor = get_object_or_404(Vendor, pk=pk)
            if vendor.is_verified:
                return Response({'status': 'Vendor already verified.'}, status=status.HTTP_400_BAD_REQUEST)

            vendor.is_verified = True
            vendor.verified_at = timezone.now()
            vendor.verified_by = request.user
            vendor.save()

            send_vendor_approval_email(vendor.id)

            return Response({'status': 'Vendor verified successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Failed to verify vendor ID {pk}")
            return Response({'status': 'Error verifying vendor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        try:
            vendor = get_object_or_404(Vendor, pk=pk)
            reason = request.data.get('reason', '')

            vendor.is_verified = False
            vendor.rejection_reason = reason
            vendor.save()

            send_vendor_rejection_email(vendor.id, reason)

            return Response({'status': 'Vendor rejected successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Failed to reject vendor ID {pk}")
            return Response({'status': 'Error rejecting vendor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        try:
            vendor = get_object_or_404(Vendor, pk=pk)
            reason = request.data.get('reason', '')

            vendor.is_active = False
            vendor.suspension_reason = reason
            vendor.suspended_at = timezone.now()
            vendor.suspended_by = request.user
            vendor.save()

            return Response({'status': 'Vendor suspended successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Failed to suspend vendor ID {pk}")
            return Response({'status': 'Error suspending vendor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
