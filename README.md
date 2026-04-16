# Malicious Email Detection System using NLP

## 1. Project Title

Malicious Email Detection System using NLP

---

## 2. Project Description

This project is a rule-based system that detects malicious or spam emails using Natural Language Processing (NLP) techniques. It analyzes email content and classifies it as safe or malicious based on predefined keywords and patterns.

---

## 3. Group Number and Team Members

**Group No:** 29

**Team Members:**

* Zeba Ansari
* Pradnya Chavan
* Vaishnavi Patil
* Neha Samudre

---

## 4. Tech Stack

* **Programming Language/Backend:** Python, Javascript
* **Framework:** Flask
* **Frontend:** HTML, CSS
* **Concepts Used:** Natural Language Processing (NLP)
* **Database:** SQLite

---

## 5. Project Structure

```
Malicious-Email-Detection-System/
│
├── app.py
├── login.py
├── email.db
├── README.md
├── requirements.txt
│
├── data/
│   ├── normalization_rules.txt
│   ├── safe_domain.txt
│   ├── spam_pattern.txt
│   └── spam_words.txt
│
├── database/
│   ├── __init__.py
│   ├── db.py
│   └── models.py
│
├── fuzzy/
│   ├── __init__.py
│   └── fuzzy_logic.py
│
├── nlp/
│   ├── __init__.py
│   ├── __.txt
│   ├── extract.py
│   └── preprocess.py
│
├── utils/
│   └── domain_check.py
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── images/
│       ├── accuracy.png
│       ├── img1.png
│       ├── img3.png
│       ├── img4.png
│       ├── img5.png
│       └── logo.png
│
├── templates/
│   ├── base.html
│   ├── check_email.html
│   ├── contact.html
│   ├── history.html
│   ├── home.html
│   ├── login.html
│   └── view.html
│
└── screenshots/
    ├── 1_Home.png
    ├── 2_Email.png
    ├── 3_Admin_Login.png
    ├── 4_History.png
    ├── 5_View.png
    └── 6_Contact.png

---

## 6. Prerequisites and Installation Steps

### Prerequisites

* Python 3.x installed
* pip (Python package manager)

### Installation Steps


1. Navigate to project folder:

```
cd Malicious-Email-Detection
```

2. Install required packages:

```
pip install -r requirements.txt
```

---

## 7. How to Run

1. Run the application:

```
python app.py
```

2. Open browser and go to:

```
http://localhost:5000
```

---

## 8. Features

* Detects malicious or spam emails
* Rule-based analysis (no machine learning)
* Uses NLP techniques for text processing
* Fast and lightweight system
* Easy to understand and implement

---

## 9. Working Principle

* Takes email content as input
* Applies NLP preprocessing (tokenization, stopword removal)
* Matches keywords and patterns using rule-based logic
* Classifies email as **Safe** or **Malicious**

---

## 10. License

This project is developed for educational purposes only.
