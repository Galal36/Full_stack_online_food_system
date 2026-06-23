from django.db import models

class Category(models.Model):
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, default='🍽️')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name_en

class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name_en = models.CharField(max_length=200)
    name_ar = models.CharField(max_length=200)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='menu/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    preparation_time = models.PositiveIntegerField(default=20, help_text='Minutes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name_en']

    def __str__(self):
        return self.name_en

    def get_image(self):
        if self.image:
            return self.image.url
        return self.image_url or ''
