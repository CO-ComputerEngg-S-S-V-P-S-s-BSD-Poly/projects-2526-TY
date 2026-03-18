from flask import Flask, render_template, request, redirect, url_for, session
from nlp.extract import analyze_email
from database.db import init_db
from database.models import save_email, get_all_history
from datetime import datetime
import sqlite3



app = Flask(__name__)
app.secret_key = "secretkey123"

init_db()# ---------------- ADMIN CREDENTIAL ----------------
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "123"

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
    print("SESSION VALUE:", session.get("admin"))

    if not session.get("admin"):
        return redirect("/login")

    rows = get_all_history()
    return render_template("history.html", rows=rows)

# ---------------- LOGIN ----------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session["admin"] = True
            return redirect("/history")
        else:
            return render_template("login.html", error="Invalid Username or Password")

    return render_template("login.html")

#---------Logout-----------
@app.route("/logout")
def logout():
    session.pop("admin", None)
    return redirect(url_for("home"))

@app.route("/delete/<int:id>", methods=["POST"])
def delete_record(id):
    conn = sqlite3.connect("email.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM email_history WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return "", 204




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
