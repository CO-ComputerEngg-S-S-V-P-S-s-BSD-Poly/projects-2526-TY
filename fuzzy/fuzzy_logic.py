def calculate_fuzzy_score(words, detected_spam, spam_data, safe_data):
    """
    words: list of preprocessed words
    detected_spam: words detected from extract.py
    """

    spam_score = 0
    safe_score = 0

    # Convert to dictionary for fast lookup
    spam_dict = dict(spam_data)
    safe_dict = dict(safe_data)

    # Remove duplicates to prevent inflation
    unique_spam = set(detected_spam)
    unique_words = set(words)

    # -------- SPAM SCORE --------
    for word in unique_spam:
        if word in spam_dict:
            spam_score += spam_dict[word]

    # -------- SAFE SCORE --------
    for word in unique_words:
        if word in safe_dict:
            safe_score += safe_dict[word]

    final_score = spam_score - safe_score

    # Prevent negative explosion
    final_score = max(final_score, 0)

    # -------- DECISION --------
    if final_score >= 20:
        result = "Malicious Email"
    elif final_score >= 10:
        result = "Suspicious Email"
    else:
        result = "Safe Email"

    return {
        "spam_score": spam_score,
        "safe_score": safe_score,
        "final_score": final_score,
        "result": result
    }
