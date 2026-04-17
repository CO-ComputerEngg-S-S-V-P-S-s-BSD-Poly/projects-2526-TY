1. Project title : GoWheels- Online Multiuser Vehicle Rental and Listing Platform
2. Project description : 
GoWheels is a web-based vehicle rental and listing platform designed to simplify the process of renting vehicles such as cars and bikes.
The system provides a digital platform where users can browse available vehicles, compare prices, check availability, and book vehicles online without visiting rental offices.
This project aims to reduce manual work, eliminate booking conflicts, and improve transparency in vehicle rental services through automation and centralized data management.

3. Group no and Team members:
Piyush Prashant Bhamare	23610960176
Hatim Huzefa Bohri	23610960179
Kartik Bhagwan Chaudhari	23610960183
Chetan Jagdish Patel	23610960192

4. Tech Stack
1. Frontend (Client-Side)
These technologies are responsible for the user interface and interactions in the browser:
•	HTML (HyperText Markup Language): Used to structure web pages such as login, booking, and dashboard interfaces.
•	CSS (Cascading Style Sheets): Used for designing layouts, styling components, and ensuring responsive design.
•	JavaScript (JS): Enables dynamic behavior such as form validation, interactive booking features, charts, and asynchronous requests (AJAX).
•	JSON (JavaScript Object Notation): Used for transferring structured data between the backend and frontend, such as dashboard statistics and booking information.
________________________________________
2. Backend (Server-Side)
These technologies handle application logic, database operations, authentication, and integrations:
2.1 Core Framework
•	Django (Version 5.2.4): A high-level Python web framework used to build the GoWheels application.
Key Django modules used:
o	django.contrib.auth: Manages user authentication, login, and registration.
o	django.db.models: Defines database schema and performs ORM queries (e.g., Sum, Count, Q).
o	django.core.mail: Sends emails such as OTP verification, booking confirmations, and notifications.
o	django.core.cache: Limits failed login attempts to enhance security.
o	django.views.decorators: Secures routes using decorators like @login_required and @require_POST.
________________________________________
2.2 Third-Party Libraries
•	Stripe (stripe): A payment gateway used for wallet recharges and online booking payments via credit/debit cards.
•	Pillow (PIL): A Python imaging library used to generate CAPTCHA images.
o	Modules used include Image, ImageDraw, ImageFilter, and ImageFont.
________________________________________
2.3 Python Built-in Libraries
•	datetime (date, datetime, timedelta): Used for rental duration calculations, availability checks, and penalty handling.
•	decimal (Decimal): Ensures precise financial calculations such as wallet balance and trip costs.
•	json: Serializes data for communication between backend and frontend.
•	random / string: Generates OTPs and CAPTCHA text.
•	io: Handles in-memory image processing for CAPTCHA generation.
•	os / pathlib: Manages file paths and directory structures.

5. Project Structure
GOWHEELS/ # Main project root folder
├── GoWheels/ # Project configuration directory
│   ├── __pycache__/ # Compiled Python byte-code files
│   ├── __init__.py # Marks this directory as a Python package
│   ├── asgi.py # ASGI config for asynchronous server deployment
│   ├── settings.py # Django project settings and configurations
│   ├── urls.py # Main URL routing for the whole project
│   └── wsgi.py # WSGI config for synchronous server deployment
│
├── main/ # Primary Django application for the project
│   ├── __pycache__/ # Compiled Python byte-code files
│   ├── migrations/ # Database schema migration files
│   ├── static/ # Static files (CSS, JavaScript, Images)
│   ├── templates/ # HTML templates for the application
│   │   ├── base.html # Base layout template to be extended
│   │   ├── edit_vehicle.html # Page to edit existing vehicle details
│   │   ├── forgot_password.html # Page for initiating password recovery
│   │   ├── helpdesk.html # Support/customer service page
│   │   ├── home.html # Landing/Home page
│   │   ├── list_vehicle.html # Page for users to list a new vehicle
│   │   ├── login.html # User authentication/login page
│   │   ├── offers.html # Page displaying discounts or special offers
│   │   ├── payments.html # Payment processing or history page
│   │   ├── rent_history.html # Log of a user's past rentals
│   │   ├── rent_vehicle.html # Page for the vehicle renting process
│   │   ├── reset_password.html # Page to set a new password
│   │   ├── signup.html # User registration page
│   │   ├── vehicles.html # General page displaying all vehicles
│   │   └── your_vehicles.html # Dashboard showing user's owned/listed vehicles
│   │
│   ├── __init__.py # Marks the main app as a Python package
│   ├── admin.py # Configuration for the Django admin interface
│   ├── apps.py # Application configuration file
│   ├── models.py # Database tables/models definitions
│   ├── tests.py # Unit tests for the application
│   ├── urls.py # App-specific URL routing
│   └── views.py # Logic for handling requests and returning responses
│
├── media/ # Directory for user-uploaded media files
├── data_backup.json # Exported JSON backup of database records
├── db.sqlite3 # Local SQLite database file
├── LICENSE # Legal license for the project code
└── manage.py # Django command-line utility for administrative tasks
6. Prerequisites and Installation steps
Here are the standard prerequisites and installation steps based on the Django architecture of the GoWheels project shown in your folder structure. You can copy and paste this directly into your project report or README.md file.

6. Prerequisites and Installation Steps
Prerequisites
Before you begin, ensure you have the following installed on your system:

Python (3.8 or higher): The core programming language used for the backend.

pip: The Python package installer (usually comes pre-installed with Python).

Git: For version control and cloning the repository (optional but recommended).

Virtual Environment (venv): Recommended to isolate project dependencies.

Installation Steps

Step 1: Clone or Download the Project
First, get the project files onto your local machine and navigate into the root directory.

Bash
# If using Git:
git clone <your-repository-url>

# Navigate into the project folder
cd GOWHEELS
Step 2: Create a Virtual Environment
It is highly recommended to create a virtual environment to keep the project dependencies isolated from your global Python installation.

Bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
Step 3: Activate the Virtual Environment
You must activate the environment before installing any packages.

Bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
Step 4: Install Dependencies
Install Django and any other required Python packages. (Note: If you have a requirements.txt file, use pip install -r requirements.txt instead).

Bash
pip install django
Step 5: Apply Database Migrations
Since this project uses SQLite (db.sqlite3), you need to apply the migrations to set up the database tables for the application's models (like users, vehicles, rentals, etc.).

Bash
python manage.py migrate
Step 6: Create a Superuser (Optional but Recommended)
To access the Django admin panel and manage your application data, create an admin account.

Bash
python manage.py createsuperuser
(Follow the prompts to set a username, email, and password).

Step 7: Run the Development Server
Start the local server to run the application.

Bash
python manage.py runserver
Step 8: Access the Application
Open your web browser and navigate to the following URL to view the GoWheels homepage:

Plaintext
http://127.0.0.1:8000/
To access the admin dashboard, navigate to:

Plaintext
http://127.0.0.1:8000/admin/
