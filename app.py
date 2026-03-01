from flask import Flask, render_template, request
from nlp.extract import analyze_email
from database.db import init_db
from database.models import save_email, get_all_history
from datetime import datetime


app = Flask(__name__)
app.secret_key = "secretkey123"

init_db()

# ---------------- HOME ----------------
@app.route("/")
def home():
    return render_template("home.html")


# ---------------- CHECK EMAIL ----------------
@app.route("/check", methods=["GET", "POST"])
def check():
    data = None   #  important: create data first

    if request.method == "POST":
        sender = request.form.get("sender")

        body = request.form.get("body")

        data = analyze_email(body, sender)
        date = datetime.now().strftime("%d-%m-%Y %H:%M")
        save_email(date, sender, body, data["final_score"], data["threat"])

        return render_template(
            "check_email.html",
            data=data,
            sender=sender,

            body=body
        )

    return render_template("check_email.html", data=data)


# ---------------- HISTORY PAGE ----------------
@app.route("/history")
def history():
    rows = get_all_history()
    return render_template("history.html", rows=rows)


@app.route("/view/<int:id>")
def view(id):
    import sqlite3
    conn = sqlite3.connect("email.db")
    cur = conn.cursor()

    cur.execute("SELECT * FROM email_history WHERE id=?", (id,))
    row = cur.fetchone()
    conn.close()

    return render_template("view.html", data=row)



# ---------------- CONTACT PAGE ----------------
@app.route("/contact")
def contact():
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(debug=True)
