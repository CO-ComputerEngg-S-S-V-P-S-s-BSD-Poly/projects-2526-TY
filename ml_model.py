from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# Simple training dataset (you can improve later)
emails = [
    "You won free lottery",
    "Claim your reward now",
    "Limited time offer click here",
    "Meeting scheduled tomorrow",
    "Project discussion update",
    "Team report submission"
]

labels = [1, 1, 1, 0, 0, 0]   # 1 = spam, 0 = safe

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(emails)

model = MultinomialNB()
model.fit(X, labels)

def ml_predict(text):
    text_vector = vectorizer.transform([text])
    prediction = model.predict(text_vector)
    probability = model.predict_proba(text_vector)

    return prediction[0], max(probability[0])
