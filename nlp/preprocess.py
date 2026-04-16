import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords



def preprocess_text(body):
    """
    NLP preprocessing using NLTK
    Steps:
    1. Lowercase conversion
    2. Remove special characters
    3. Tokenization
    4. Stopword removal
    """

    # convert to lowercase
    text = body.lower()

    # remove special characters
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)

    # tokenize text into words
    words = word_tokenize(text)

    # load stopwords
    stop_words = set(stopwords.words('english'))

    # remove stopwords
    clean_words = []
    for word in words:
        if word not in stop_words and len(word) > 1:
            clean_words.append(word)

    return clean_words
