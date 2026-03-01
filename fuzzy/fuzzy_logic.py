def calculate_fuzzy_score(words, detected_spam, spam_data, safe_data):
    """
    words: list of preprocessed words
    detected_spam: words detected from extract.py

    """

    spam_score = 0
    safe_score = 0

    # calculate spam score
    for word in detected_spam:
        for sw, rank in spam_data:
            if word == sw:
                spam_score += rank

    # calculate safe score
    for word in words:
        for safe, rank in safe_data:
            if word == safe:
                safe_score += rank

    final_score = spam_score - safe_score

    # decision
    if final_score >= 8:
        result = "Malicious Email"
    elif final_score >= 4:
        result = "Suspicious Email"
    else:
        result = "Safe Email"

    return {
        "spam_score": spam_score,
        "safe_score": safe_score,
        "final_score": final_score,
        "result": result
    }
