# Document Categorization System

## Description
## Description
This project implements a Machine Learning-based Document Categorization System that automatically classifies textual documents into predefined categories. The system is designed to handle large volumes of unstructured data and organize them efficiently using intelligent algorithms.

The workflow begins with data preprocessing, where raw text is cleaned through techniques such as tokenization, stop-word removal, and normalization. The processed text is then transformed into numerical features using TF-IDF (Term Frequency–Inverse Document Frequency), which helps in identifying the importance of words within documents.

A supervised learning algorithm, specifically Multinomial Naive Bayes, is trained on labeled datasets to learn patterns and relationships between words and document categories. Once trained, the model can accurately predict the category of new, unseen documents in real-time.

The system is integrated with a user-friendly interface (built using Django) that allows users to input documents and instantly receive classification results. This solution enhances productivity by reducing manual effort, improving accuracy, and enabling scalable document management.

This project can be applied in various real-world domains such as email spam filtering, news article classification, document management systems, and content organization platforms.

## Group Details
Group No: 17  
Team Members:  
- Monishka Nitin Sonawane
- Mayuri Anil Torawane
- Dia Dinesh Waswani
- Yogeshwari Sudhir Chaudhari

## Tech Stack
- Python
- Django
- Machine Learning
- HTML, CSS

## Project Structure
Group17_Document_Categorization/
├── README.md  
├── images/  
├── screenshots/  
├── report/  
├── files/  

## Prerequisites
- Python installed  
- Django installed  
- Required libraries (sklearn, joblib, etc.)

## Installation Steps
1. Clone the repository  
2. Go to project folder  
3. Install dependencies  
4. Run the server using:
   python manage.py runserver  
5. Open browser and run the project
