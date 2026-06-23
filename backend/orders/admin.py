from django.contrib import admin
from .models import Order, OrderItem, OrderStatusHistory

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('unit_price', 'subtotal')

class OrderStatusInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'payment_method', 'total', 'created_at')
    list_filter = ('status', 'payment_method', 'payment_status')
    inlines = [OrderItemInline, OrderStatusInline]
    readonly_fields = ('subtotal', 'total', 'created_at', 'updated_at')
