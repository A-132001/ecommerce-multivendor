from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
import logging 

from .models import Vendor
from .serializers import VendorSerializer


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = VendorSerializer
    parser_classes = [MultiPartParser, FormParser] 
    def perform_create(self, serializer):
        print(self.request.FILES) 
        # Automatically link the logged-in user
        serializer.save(user=self.request.user)

    # def get_queryset(self):
    #     return self.queryset.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure user can't override 'user' field during updates
        serializer.save(user=self.request.user)

class LoginRateThrottle(UserRateThrottle):
    rate = '5/minute'
 

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff 


class VendorAdminViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAdminUser]  # Only admin users can access this

    @action(detail=False, methods=['get'], url_path='pending')
    def pending_vendors(self, request):
        pending = Vendor.objects.filter(is_verified=False)
        if not pending:
            return Response({'message': 'No pending vendors found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='verify')
    def verify_vendor(self, request, pk=None):
        try:
            vendor = get_object_or_404(Vendor, pk=pk)
            if vendor.is_verified:
                return Response(
                    {'status': 'This vendor is already verified.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            vendor.is_verified = True
            vendor.save()

            return Response(
                {'status': 'Vendor verified successfully!'},
                status=status.HTTP_200_OK
            )

        except exception as e:
            print(f"Error verifying vendor: {e}")

            logger = logging.getLogger(__name__)
            logger.error(f"Error verifying vendor: {e}")
            return Response(
                {'status': 'An error occurred while verifying the vendor.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], url_path='reject')
    def reject_vendor(self, request, pk=None):
        vendor = get_object_or_404(Vendor, pk=pk)
        vendor.is_verified = False
        vendor.save()
        return Response({'status': 'vendor rejected successfully!'}, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        # Automatically link the logged-in user
        serializer.save(user=self.request.user)