Project Title : Co Attainment Calculation for Outcome Based Education.

Project Description : 
"Faculty in a CO-PO Attainment System define Course Outcomes (COs) for each subject and map them with Program Outcomes (POs). They enter student marks from internal and external assessments to evaluate performance. The system calculates CO attainment and converts it into PO attainment using mapping levels. Faculty can generate reports to analyze student achievement and identify weak areas. Based on results, teachers take corrective actions to improve teaching and learning outcomes."

Group No.    : 13 

Team members : 1.Ruchika Dilip patil
               2.Krishna Vinodkumar Popali
               3.Aman Anjum Iqbal Shaikh
               4.Suvarna Mahendra Sonawane

Tech Stack   : 

                Backend
                Django (Python-based web framework)

                Frontend :-
                HTML, CSS, JavaScript,
                Bootstrap

                Database:-
                SQLite (default Django database)

                Programming Language:-
                Python

                Tools & IDE:-
                Visual Studio Code 
                Git

                Server:-
                Django Development Server (Localhost)

Project Struture :
                13_Co-PO Attainment Calculation/
                └── co1/
                    └── cpp1/
                        ├── excel_project/
                        │   ├── __pycache__/
                        │   ├── __init__.py
                        │   ├── asgi.py
                        │   ├── settings.py
                        │   ├── urls.py
                        │   └── wsgi.py
                        │
                        ├── excelapp/
                        │   ├── __pycache__/
                        │   ├── migrations/
                        │   │
                        │   ├── static/
                        │   │   ├── css/
                        │   │   │   └── ui.css
                        │   │   ├── images/
                        │   │   │   ├── book.jpg
                        │   │   │   └── logo.png
                        │   │   └── videos/
                        │   │       └── about.mp4
                        │   │
                        │   ├── templates/
                        │   │   ├── admin_panel.html
                        │   │   ├── assignment.html
                        │   │   ├── class_test_1.html
                        │   │   ├── class_test_2.html
                        │   │   ├── co_attainment.html
                        │   │   ├── exit_survey.html
                        │   │   ├── microproject.html
                        │   │   ├── overall.html
                        │   │   ├── plan_po_matrix.html
                        │   │   ├── sa_pr.html
                        │   │   ├── sa_th.html
                        │   │   ├── signup.html
                        │   │   ├── sla_both.html
                        │   │   └── sla.html
                        │   │
                        │   ├── __init__.py
                        │   ├── admin_forms.py
                        │   ├── admin.py
                        │   ├── apps.py
                        │   ├── forms.py
                        │   ├── models.py
                        │   ├── tests.py
                        │   ├── urls.py
                        │   ├── validators.py
                        │   └── views.py
                        │
                        ├── db.sqlite3
                        ├── manage.py
                        ├── README.MD
                        └── README.md

Prerequisites and Installation steps :
                        Prerequisites

                            
                            1.Python (Version 3.x)
                            Django
                            Visual Studio Code , Git
                            Web Browser (Chrome)

                            2.Installation Steps:-
                                Install Python
                                Download and install Python
                                Verify installation:
                                "python --version"

                                Install Django
                                pip install django
                                Verify:

                            3.Project Directory
                                cd "13_Co-PO Attainment Calculation/co1/cpp1"

                            4.Database Migrations
                                python manage.py makemigrations
                                python manage.py migrate

                            5. Create Superuser (Admin Login)
                                python manage.py createsuperuser
                                Enter username, email, password

                            6. Run Development Server
                                python manage.py runserver

                            7. Open in Browser
                                Go to:
                                http://127.0.0.1:8000/