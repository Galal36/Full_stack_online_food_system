from django.contrib import admin
from .models import Category, MenuItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_ar', 'icon', 'order', 'item_count')
    def item_count(self, obj): return obj.items.count()

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'category', 'price', 'is_available', 'is_featured')
    list_filter = ('category', 'is_available', 'is_featured')
    list_editable = ('is_available', 'is_featured', 'price')
