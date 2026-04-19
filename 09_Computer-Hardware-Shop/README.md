# Computer Hardware Shop

Group No. - 9,
Members :
Amey Pravin Dere
Shrutika Sandip Dhondge
Anushka Sangram Digole
Sujal Nitin Pardeshi

A full-stack Flask web application for a computer hardware store with:
- product browsing and search
- account system (register/login/profile)
- cart and wishlist flows
- prebuilt and custom PC recommendation journeys
- order checkout simulation
- hardware service request booking
- admin panel for store management

## Features

- User authentication with session-based login/logout.
- Product catalog with category, brand, size, memory-type, and price filtering.
- Smart search suggestions and fuzzy matching.
- Prebuilt PC recommendations by user profile.
- Custom PC builder flow with grouped/bundled cart items.
- Wishlist with move-to-cart and remove-selected APIs.
- Checkout flow with saved addresses and order history.
- Service booking (repair, installation, upgrade) with payment confirmation.
- Admin dashboard (`/admin`) using Flask-Admin.
- Auto data initialization on startup:
  - database tables are created
  - product seed data is loaded
  - demo/admin users are created if missing

## Tech Stack

- Python 3
- Flask
- Flask-SQLAlchemy + SQLAlchemy
- Flask-Migrate + Alembic
- Flask-Login
- Flask-Admin
- SQLite
- Jinja2 templates + static assets

## Project Structure

```text
.
|- app.py
|- models.py
|- profiles.py
|- recommendation_engine.py
|- requirements.txt
|- templates/
|- static/
|- migrations/
|- instance/
|  `- hardware_shop.db
`- login.py  (optional Selenium login test script)
```

## Quick Start

### 1. Clone and enter the project

```bash
git clone <your-repo-url>
cd Computer-Hardware-Shop
```

### 2. Create a virtual environment

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the app

```bash
python app.py
```

Open: `http://127.0.0.1:5000`

## Default Users (Created Automatically)

- Demo user:
  - username: `demo`
  - password: `demo123`
- Admin user:
  - username: `admin`
  - password: `admin123`

Admin panel: `http://127.0.0.1:5000/admin`

## Database Notes

- SQLite database file: `instance/hardware_shop.db`
- On app startup, the project currently runs:
  - `db.create_all()`
  - internal product seeding
  - setup image refresh/sync logic

If you want migration-based schema control, use Flask-Migrate/Alembic commands (optional):

```bash
flask db upgrade
```

## API Endpoints (Examples)

- `GET /api/cart`
- `GET /api/cart/count`
- `POST /api/cart/add`
- `GET /api/wishlist/count`
- `POST /api/wishlist/add`
- `GET /api/product_suggestions`
- `GET /api/recommendations?profession=developer`

## Optional Selenium Script

`login.py` contains a Selenium-based login flow test.  
To run it, you need Chrome/Chromium and a compatible driver setup.

## GitHub Upload Checklist

- Include: source code, templates, static assets, migrations, `requirements.txt`, `README.md`.
- Exclude local artifacts:
  - `.venv/`
  - `venv/`
  - `__pycache__/`
  - `.tmp/`
  - `instance/*.db` (if you don't want to version local DB state)

## Future Improvements

- Move secrets/config into environment variables (`.env`).
- Add automated tests (unit + integration).
- Add CI workflow for lint/test/build checks.
- Add Docker setup for one-command deployment.