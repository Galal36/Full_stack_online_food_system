# 🍔 FoodRush — Online Food Ordering App

A full-stack food ordering prototype built with Django REST Framework + React + Vite.

---

## Stack
- **Backend:** Django 5 + Django REST Framework + SimpleJWT
- **Frontend:** React 18 + Vite + react-i18next
- **Database:** SQLite (dev)
- **Auth:** JWT (access + refresh tokens)

---

## Features Implemented

| Feature | Status |
|---|---|
| Menu display with images & prices | done.|
| Category filtering + search | done |
| Add to cart (persistent via localStorage) | done |
| User registration & login (JWT) | done |
| Place orders | done |
| Online payment (card form UI) | done |
| Cash on Delivery | done |
| Order status tracking with visual progress bar | done |
| Admin dashboard (stats, products, orders) | done |
| Arabic & English with RTL support | done |
| Responsive design | done |

---

## Running the Project

### Prerequisites
- **Python 3.10+**
- **Node.js 20+** (Vite 8 will refuse to start on Node 18 or lower)
- **Git**

### 1. Clone the repo
```bash
git clone https://github.com/Galal36/Full_stack_online_food_system.git
cd Full_stack_online_food_system
```

### 2. Backend — Django (port 8000)

Open **terminal 1**:

**Linux / macOS / WSL**
```bash
cd backend
python3 -m venv .venv                # create virtual environment
source .venv/bin/activate            # activate it
pip install -r requirements.txt      # install Django, DRF, etc.
python manage.py migrate             # apply database schema
python seed_data.py                  # seed admin + test user + 14 menu items
python manage.py runserver 0.0.0.0:8000
```

**Windows (PowerShell)**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python seed_data.py
python manage.py runserver 0.0.0.0:8000
```

Backend is now live at **http://localhost:8000**.

### 3. Frontend — React + Vite (port 5173)

Open **terminal 2** (leave the backend running):

```bash
cd frontend
npm install      # first time only
npm run dev
```

> **Node version note:** Vite 8 requires Node 20+. Check with `node --version`. If it shows 18 or lower:
> ```bash
> # Linux / macOS / WSL — install via nvm
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
> source ~/.nvm/nvm.sh
> nvm install 20 && nvm use 20
> ```
> Windows users can grab the Node 20 LTS installer from [nodejs.org](https://nodejs.org/).

Frontend is now live at **http://localhost:5173** — open it in your browser.

### 4. (Optional) One-command startup

From the project root:
```bash
chmod +x start.sh    # first time only (Linux/macOS/WSL)
./start.sh
```
`start.sh` boots both servers in one terminal, auto-creates the venv and installs dependencies on first run, and stops both with a single `Ctrl+C`.

### URLs

| What | URL |
|---|---|
| Frontend (the app) | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Django Admin | http://localhost:8000/admin |

---

## Demo Credentials. I put them as a test case in the login page.

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

## sQLite3 Setup (Production, default)

Update `backend/backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
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

└── README.md
```
