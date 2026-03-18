import re
from nlp.preprocess import preprocess_text
from fuzzy.fuzzy_logic import calculate_fuzzy_score
from utils.domain_check import check_domain_virustotal


# ------------------ LOAD DATA ONCE ------------------

def load_spam_words():
    spam = []
    with open("data/spam_words.txt", "r", encoding="utf-8") as f:
        for line in f:
            if "," in line:
                w, r = line.strip().split(",")
                spam.append((w.lower(), int(r)))
    return spam


def load_safe_words():
    safe = []
    with open("data/safe_words.txt", "r", encoding="utf-8") as f:
        for line in f:
            if "," in line:
                w, r = line.strip().split(",")
                safe.append((w.lower(), int(r)))
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


def load_safe_domains():
    domains = []
    with open("data/safe_domain.txt", "r", encoding="utf-8") as f:
        for line in f:
            domains.append(line.strip().lower())
    return domains


# ------------------ GLOBAL LOAD ------------------

spam_data = load_spam_words()
safe_data = load_safe_words()
patterns = load_patterns()
rules = load_rules()
safe_domains = load_safe_domains()


# ------------------ NORMALIZATION ------------------

def normalize_word(word):
    for k, v in rules.items():
        word = word.replace(k, v)
    return word


# ------------------ MAIN ANALYSIS ------------------

def analyze_email(body, sender):

    fake_flag = False
    domain_score = 0
    spam_score = 0
    max_score = 50  # define maximum score

    body = body.lower()

    # ---------- BASIC OBFUSCATION CLEAN ----------
    body = body.replace("0", "o").replace("1", "l").replace("3", "e")

    # ---------- DOMAIN CHECK ----------
    if sender:
        # Extract domain if email format
        if "@" in sender:
            domain = sender.split("@")[-1].lower()
        else:
            domain = sender.lower()  # treat input directly as domain

        # 1️⃣ Trusted domain whitelist
        if any(domain.endswith(safe) for safe in safe_domains):
            domain_score -= 15

        else:
            # 2️⃣ VirusTotal API check
            malicious, suspicious = check_domain_virustotal(domain)

            if malicious >= 5:
                domain_score += 25
                fake_flag = True
            elif malicious >= 1:
                domain_score += 15
                fake_flag = True
            elif suspicious >= 3:
                domain_score += 8

    # ---------- TEXT PROCESSING ----------
    words = preprocess_text(body)
    detected_spam = []

    # Word matching
    for word in words:
        nword = normalize_word(word)

        for sw, rank in spam_data:
            if nword == sw:
                detected_spam.append(word)

    # Pattern matching (outside loop)
    for p in patterns:
        if re.search(p, body):
            detected_spam.append(p)

    # ---------- FUZZY LOGIC SCORING ----------
    result = calculate_fuzzy_score(words, detected_spam, spam_data, safe_data)

    spam_score = result["spam_score"]
    safe_score = result["safe_score"]
    final_score = result["final_score"]

    # ---------- CONTEXT BASED REDUCTION ----------
    if "unsubscribe" in body:
        final_score -= 5

    if "regards" in body or "thank you" in body:
        final_score -= 3

    if "comment" in body and "upvote" in body:
        final_score -= 8  # newsletter detection (Quora type)

    # ---------- DOMAIN SCORE ADD ----------
    final_score += domain_score

    # Prevent negative score
    final_score = max(final_score, 0)

    # ---------- FINAL DECISION ----------
    if final_score >= 20:
        threat = "Malicious"
    elif final_score >= 10:
        threat = "Suspicious"
    else:
        threat = "Safe"

    if fake_flag:
        threat += " (Risky Domain)"

    spam_percentage = (final_score / max_score) * 100
    spam_percentage = max(0, spam_percentage)

    return {
        "detected_spam": list(set(detected_spam)),
        "spam_score": spam_score,
        "safe_score": safe_score,
        "final_score": final_score,
        "spam_percentage": round(spam_percentage, 2),
        "threat": threat
    }


