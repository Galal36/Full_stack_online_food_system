from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderStatusHistory
from .serializers import OrderSerializer, OrderCreateSerializer

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().prefetch_related('items', 'history')
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'history')

    def create(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        note = request.data.get('note', '')
        
        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status'}, status=400)
        
        order.status = new_status
        order.save(update_fields=['status'])
        OrderStatusHistory.objects.create(order=order, status=new_status, note=note)
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def stats(self, request):
        from django.db.models import Count, Sum
        from django.utils import timezone
        today = timezone.now().date()
        
        return Response({
            'total_orders': Order.objects.count(),
            'today_orders': Order.objects.filter(created_at__date=today).count(),
            'pending_orders': Order.objects.filter(status='pending').count(),
            'total_revenue': Order.objects.filter(payment_status='paid').aggregate(Sum('total'))['total__sum'] or 0,
        })
