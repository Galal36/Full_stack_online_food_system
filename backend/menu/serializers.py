from rest_framework import serializers
from .models import Category, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ('id', 'category', 'category_name', 'name_en', 'name_ar', 
                  'description_en', 'description_ar', 'price', 'image', 
                  'image_url', 'image_display', 'is_available', 'is_featured', 
                  'preparation_time')

    def get_image_display(self, obj):
        return obj.get_image()

    def get_category_name(self, obj):
        return {'en': obj.category.name_en, 'ar': obj.category.name_ar}

class CategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name_en', 'name_ar', 'icon', 'order', 'items', 'item_count')

    def get_item_count(self, obj):
        return obj.items.filter(is_available=True).count()
