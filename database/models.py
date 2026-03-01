from database.db import get_db
from datetime import datetime
import sqlite3

def save_email(date, sender, body, final_score, threat):
    conn = sqlite3.connect("email.db")
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO email_history (date, sender,  body, final_score, threat)
    VALUES (?, ?, ?, ?, ?)
    """, (date, sender, body, final_score, threat))

    conn.commit()
    conn.close()

def get_all_history():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM email_history ORDER BY id DESC")
    rows = cur.fetchall()

    conn.close()
    return rows
