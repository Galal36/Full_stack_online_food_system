from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from menu.serializers import MenuItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)
    menu_item_name = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'menu_item', 'menu_item_detail', 'menu_item_name', 
                  'quantity', 'unit_price', 'subtotal')
        read_only_fields = ('unit_price', 'subtotal')

    def get_menu_item_name(self, obj):
        return {'en': obj.menu_item.name_en, 'ar': obj.menu_item.name_ar}

class OrderItemCreateSerializer(serializers.Serializer):
    menu_item = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ('status', 'note', 'created_at')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    history = OrderStatusHistorySerializer(many=True, read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ('id', 'user', 'user_name', 'status', 'payment_method', 
                  'payment_status', 'delivery_address', 'phone', 'notes',
                  'subtotal', 'delivery_fee', 'total', 'items', 'history',
                  'created_at', 'updated_at')
        read_only_fields = ('user', 'subtotal', 'total', 'payment_status')

    def get_user_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'.strip() or obj.user.username

class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)
    payment_method = serializers.ChoiceField(choices=['online', 'cash'])
    delivery_address = serializers.CharField()
    phone = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        from menu.models import MenuItem
        user = self.context['request'].user
        items_data = validated_data.pop('items')
        
        order = Order.objects.create(user=user, **validated_data)
        
        for item_data in items_data:
            menu_item = MenuItem.objects.get(id=item_data['menu_item'])
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=item_data['quantity']
            )
        
        order.calculate_total()
        if validated_data.get('payment_method') == 'cash':
            order.payment_status = 'unpaid'
        else:
            order.payment_status = 'paid'
        order.save(update_fields=['payment_status'])
        
        OrderStatusHistory.objects.create(order=order, status='pending', note='Order placed')
        return order
