from .preprocess import preprocess_text
from fuzzy.fuzzy_logic import calculate_fuzzy_score
from ml_model import ml_predict


# ------------------ helper functions ------------------
def load_spam_words():
    spam = []
    with open("data/spam_words.txt", "r", encoding="utf-8") as f:
        for line in f:
            if "," in line:
                w, r = line.strip().split(",")
                spam.append((w, int(r)))
    return spam

def load_safe_words():
    safe = []
    with open("data/safe_words.txt", "r", encoding="utf-8") as f:
        for line in f:
            if "," in line:
                w, r = line.strip().split(",")
                safe.append((w, int(r)))
    return safe

def load_patterns():
    patterns = []
    with open("data/spam_pattern.txt", "r", encoding="utf-8") as f:
        for line in f:
            p = line.strip()
            if p:
                patterns.append(p)
    return patterns

def load_rules():
    rules = {}
    with open("data/normalization_rules.txt", "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line:
                k, v = line.strip().split("=")
                rules[k] = v
    return rules

def normalize_word(word):
    rules = load_rules()
    for k, v in rules.items():
        word = word.replace(k, v)
    return word

def analyze_email(body, sender):

    fake_flag = False

    # -------- domain check ----------
    if sender and "@" in sender:
        domain = sender.split("@")[-1]

        safe_domains = []
        with open("data/safe_domain.txt", "r") as f:
            for line in f:
                safe_domains.append(line.strip())

        # if not in safe list → fake
        if domain not in safe_domains:
            fake_flag = True

    # -------- normal processing ----------
    words = preprocess_text(body)
    spam_data = load_spam_words()
    safe_data = load_safe_words()
    patterns = load_patterns()

    detected_spam = []

    for word in words:
        nword = normalize_word(word)

        for sw, rank in spam_data:
            if nword == sw:
                detected_spam.append(word)

        for p in patterns:
            if p in nword:
                detected_spam.append(word)

    result = calculate_fuzzy_score(words, detected_spam, spam_data, safe_data)

    spam_score = result["spam_score"]
    safe_score = result["safe_score"]
    final_score = result["final_score"]
    threat = result["result"]

    # if domain fake → override result
    if fake_flag:
        threat = "Suspicious/Fake Domain"
        final_score += 5

    return {
        "detected_spam": detected_spam,
        "spam_score": spam_score,
        "safe_score": safe_score,
        "final_score": final_score,
        "threat": threat
    }