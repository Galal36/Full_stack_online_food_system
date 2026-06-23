import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from menu.models import Category, MenuItem

User = get_user_model()

# Create admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@foodorder.com', 'admin123')
    print(' Admin created: admin / admin123')

# Create test user
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user('testuser', 'user@example.com', 'user123', 
                             first_name='John', last_name='Doe', phone='+1234567890')
    print(' Test user created: testuser / user123')

# Categories
categories_data = [
    {'name_en': 'Burgers', 'name_ar': 'برجر', 'icon': '🍔', 'order': 1},
    {'name_en': 'Pizza', 'name_ar': 'بيتزا', 'icon': '🍕', 'order': 2},
    {'name_en': 'Sushi', 'name_ar': 'سوشي', 'icon': '🍱', 'order': 3},
    {'name_en': 'Salads', 'name_ar': 'سلطات', 'icon': '🥗', 'order': 4},
    {'name_en': 'Desserts', 'name_ar': 'حلويات', 'icon': '🍰', 'order': 5},
    {'name_en': 'Drinks', 'name_ar': 'مشروبات', 'icon': '🥤', 'order': 6},
]

for cat_data in categories_data:
    Category.objects.get_or_create(name_en=cat_data['name_en'], defaults=cat_data)

print(' Categories created')

# Menu items with Unsplash images
menu_items = [
    # Burgers
    {'category': 'Burgers', 'name_en': 'Classic Beef Burger', 'name_ar': 'برجر بقري كلاسيكي',
     'description_en': 'Juicy 200g beef patty with lettuce, tomato, and our secret sauce',
     'description_ar': 'باتي لحم بقري طازج مع الخس والطماطم وصوصنا السري',
     'price': 12.99, 'is_featured': True, 'preparation_time': 15,
     'image_url': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'},
    {'category': 'Burgers', 'name_en': 'BBQ Bacon Burger', 'name_ar': 'برجر بيكون باربيكيو',
     'description_en': 'Smoky BBQ sauce, crispy bacon, caramelized onions',
     'description_ar': 'صوص باربيكيو مدخن مع بيكون مقرمش وبصل مكرمل',
     'price': 15.99, 'preparation_time': 18,
     'image_url': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop'},
    {'category': 'Burgers', 'name_en': 'Veggie Burger', 'name_ar': 'برجر نباتي',
     'description_en': 'Plant-based patty with avocado and fresh vegetables',
     'description_ar': 'باتي نباتي مع الأفوكادو والخضروات الطازجة',
     'price': 11.49, 'preparation_time': 12,
     'image_url': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop'},
    
    # Pizza
    {'category': 'Pizza', 'name_en': 'Margherita Pizza', 'name_ar': 'بيتزا مارغريتا',
     'description_en': 'Classic tomato sauce, fresh mozzarella, basil leaves',
     'description_ar': 'صوص طماطم كلاسيكي مع موزاريلا طازجة وأوراق الريحان',
     'price': 14.99, 'is_featured': True, 'preparation_time': 20,
     'image_url': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'},
    {'category': 'Pizza', 'name_en': 'Pepperoni Pizza', 'name_ar': 'بيتزا بيبروني',
     'description_en': 'Loaded with premium pepperoni and melted cheese',
     'description_ar': 'محملة ببيبروني فاخر وجبن مذاب',
     'price': 16.99, 'preparation_time': 22,
     'image_url': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop'},
    {'category': 'Pizza', 'name_en': 'BBQ Chicken Pizza', 'name_ar': 'بيتزا دجاج باربيكيو',
     'description_en': 'Grilled chicken, BBQ sauce, red onions, cilantro',
     'description_ar': 'دجاج مشوي مع صوص باربيكيو والبصل الأحمر والكزبرة',
     'price': 17.49, 'preparation_time': 22,
     'image_url': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'},
    
    # Sushi
    {'category': 'Sushi', 'name_en': 'Salmon Nigiri (8pc)', 'name_ar': 'نيجيري سالمون (8 قطع)',
     'description_en': 'Fresh Atlantic salmon on seasoned sushi rice',
     'description_ar': 'سالمون أطلنطي طازج على أرز السوشي المتبل',
     'price': 18.99, 'is_featured': True, 'preparation_time': 15,
     'image_url': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop'},
    {'category': 'Sushi', 'name_en': 'Dragon Roll (8pc)', 'name_ar': 'رول التنين (8 قطع)',
     'description_en': 'Shrimp tempura inside, avocado on top',
     'description_ar': 'جمبري مقلي بالباتا من الداخل مع أفوكادو من الخارج',
     'price': 16.99, 'preparation_time': 18,
     'image_url': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop'},
    
    # Salads
    {'category': 'Salads', 'name_en': 'Caesar Salad', 'name_ar': 'سلطة قيصر',
     'description_en': 'Romaine lettuce, croutons, parmesan, Caesar dressing',
     'description_ar': 'خس روماني مع خبز محمص وبارميزان وصوص قيصر',
     'price': 9.99, 'preparation_time': 10,
     'image_url': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'},
    {'category': 'Salads', 'name_en': 'Greek Salad', 'name_ar': 'سلطة يونانية',
     'description_en': 'Tomatoes, cucumber, olives, feta cheese, oregano',
     'description_ar': 'طماطم وخيار وزيتون وجبن فيتا وأوريجانو',
     'price': 8.99, 'preparation_time': 8,
     'image_url': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'},
    
    # Desserts
    {'category': 'Desserts', 'name_en': 'Chocolate Lava Cake', 'name_ar': 'كيك لافا الشوكولاتة',
     'description_en': 'Warm chocolate cake with a molten center, vanilla ice cream',
     'description_ar': 'كيك شوكولاتة دافئ مع مركز سائل وآيس كريم فانيلا',
     'price': 7.99, 'is_featured': True, 'preparation_time': 12,
     'image_url': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop'},
    {'category': 'Desserts', 'name_en': 'Tiramisu', 'name_ar': 'تيراميسو',
     'description_en': 'Italian classic with espresso-soaked ladyfingers',
     'description_ar': 'الكلاسيك الإيطالي مع بسكويت مغموس بالإسبريسو',
     'price': 6.99, 'preparation_time': 5,
     'image_url': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'},
    
    # Drinks
    {'category': 'Drinks', 'name_en': 'Fresh Lemonade', 'name_ar': 'ليمون طازج',
     'description_en': 'Freshly squeezed lemonade with mint',
     'description_ar': 'عصير ليمون طازج مع النعناع',
     'price': 3.99, 'preparation_time': 3,
     'image_url': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop'},
    {'category': 'Drinks', 'name_en': 'Mango Smoothie', 'name_ar': 'سموذي المانجو',
     'description_en': 'Fresh mango blended with yogurt and honey',
     'description_ar': 'مانجو طازجة ممزوجة باليوغرت والعسل',
     'price': 5.49, 'preparation_time': 5,
     'image_url': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop'},
]

for item_data in menu_items:
    cat_name = item_data.pop('category')
    cat = Category.objects.get(name_en=cat_name)
    MenuItem.objects.get_or_create(
        name_en=item_data['name_en'],
        defaults={**item_data, 'category': cat}
    )

print(f' {MenuItem.objects.count()} menu items created')
print('\n Database seeded successfully!')
print('Admin: admin / admin123')
print('User:  testuser / user123')
