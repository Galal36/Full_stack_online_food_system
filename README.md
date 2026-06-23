# 🍔 FoodRush — Online Food Ordering App

A full-stack food ordering prototype built with Django REST Framework + React + Vite.

---

## Stack
- **Backend:** Django 5 + Django REST Framework + SimpleJWT
- **Frontend:** React 18 + Vite + react-i18next
- **Database:** SQLite (dev) / PostgreSQL (prod-ready)
- **Auth:** JWT (access + refresh tokens)

---

## Features Implemented

| Feature | Status |
|---|---|
| Menu display with images & prices | ✅ |
| Category filtering + search | ✅ |
| Add to cart (persistent via localStorage) | ✅ |
| User registration & login (JWT) | ✅ |
| Place orders | ✅ |
| Online payment (card form UI) | ✅ |
| Cash on Delivery | ✅ |
| Order status tracking with visual progress bar | ✅ |
| Admin dashboard (stats, products, orders) | ✅ |
| Arabic & English with RTL support | ✅ |
| Responsive design | ✅ |

---

## Running the Project

### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python seed_data.py     # Creates admin, test user, categories, 14 menu items
python manage.py runserver
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Or use the combined start script:
```bash
./start.sh
```

URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

---

## Demo Credentials

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| Regular user | testuser | user123 |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/profile/` | Get/update profile |
| GET | `/api/menu/categories/` | List categories |
| GET | `/api/menu/items/` | List menu items |
| POST | `/api/menu/items/` | Create item (admin) |
| PATCH | `/api/menu/items/{id}/` | Update item (admin) |
| DELETE | `/api/menu/items/{id}/` | Delete item (admin) |
| GET | `/api/orders/` | My orders (all for admin) |
| POST | `/api/orders/` | Create order |
| PATCH | `/api/orders/{id}/update_status/` | Update order status (admin) |
| GET | `/api/orders/stats/` | Dashboard stats (admin) |

---

## PostgreSQL Setup (Production)

Update `backend/backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'foodrush_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## Project Structure

```
foodorder/
├── backend/
│   ├── accounts/          # Custom User model, JWT auth
│   ├── menu/              # Category, MenuItem models
│   ├── orders/            # Order, OrderItem, StatusHistory
│   ├── backend/           # Settings, main URLs
│   └── seed_data.py       # Database seeder
│
├── frontend/
│   └── src/
│       ├── api/           # Axios API client
│       ├── context/       # AuthContext, CartContext
│       ├── components/    # Navbar, CartSidebar
│       ├── pages/         # Home, Menu, Auth, Checkout, Orders, Admin
│       └── locales/       # en.json, ar.json
│
├── start.sh               # One-command startup
└── README.md
```
