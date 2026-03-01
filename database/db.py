import sqlite3

def get_db():
    conn = sqlite3.connect("email.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect("email.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS email_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        sender TEXT,
        
        body TEXT,
        final_score INTEGER,
        threat TEXT
    )
    """)

    conn.commit()
    conn.close()
