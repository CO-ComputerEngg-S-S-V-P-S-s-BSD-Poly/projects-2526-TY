from flask import Flask, render_template, request, redirect, session, flash, url_for
import sqlite3
import os
import smtplib
import requests
from twilio.rest import Client

app = Flask(__name__)
app.secret_key = "secret123"

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# -------- DATABASE --------

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Sellers Table
    cursor.execute("""
CREATE TABLE IF NOT EXISTS sellers(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
phone TEXT UNIQUE,
address TEXT,
password TEXT
)
""")

# Products Table
    cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_name TEXT,
    name TEXT,
    per_pack TEXT,
    price TEXT,
    category TEXT,
    ingredients TEXT,
    image TEXT,
    seller_id INTEGER
)
""")

# Orders Table
    cursor.execute("""
CREATE TABLE IF NOT EXISTS orders(
id INTEGER PRIMARY KEY AUTOINCREMENT,
product_id INTEGER,
seller_id INTEGER,
customer_name TEXT,
phone TEXT,
buyer_id INTEGER,
address TEXT,
quantity INTEGER   
)
""")

    # buyer table 
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS buyers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    address TEXT,
    phone TEXT,
    password TEXT
    )
    """)

    # cart table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cart(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    buyer_id INTEGER,
    quantity INTEGER,
    size INTEGER DEFAULT 100
)
""")

    conn.commit()
    conn.close()

# -------- HOME --------

@app.route("/")
def index():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    conn.close()

    return render_template("index.html", products=products)

# -------- SELLER REGISTER --------

@app.route("/seller_register",methods=["GET","POST"])
def seller_register():

    if request.method=="POST":

        name=request.form["name"]
        phone=request.form["phone"]
        address=request.form["address"]
        password=request.form["password"]

        conn=sqlite3.connect("database.db")
        cursor=conn.cursor()

        cursor.execute(
        "INSERT INTO sellers(name,phone,address,password) VALUES(?,?,?,?)",
        (name,phone,address,password)
        )

        conn.commit()

        cursor.execute("SELECT id FROM sellers WHERE phone=?",(phone,))
        seller=cursor.fetchone()

        session["seller"]=seller[0]

        return redirect("/seller_dashboard")

    return render_template("seller_register.html")

       
# -------- SELLER LOGIN --------

@app.route("/seller_login",methods=["GET","POST"])
def seller_login():

    if request.method=="POST":

        phone=request.form["phone"]
        password=request.form["password"]

        conn=sqlite3.connect("database.db")
        cursor=conn.cursor()

        cursor.execute(
        "SELECT * FROM sellers WHERE phone=? AND password=?",
        (phone,password)
        )

        seller=cursor.fetchone()

        if seller:

            session["seller_id"] = seller[0]   # IMPORTANT
            return redirect("/seller_dashboard")

        else:
            return "Can Not Have Account,Please Register First!!!!"

    return render_template("seller_login.html")

# -------- ADD PRODUCT --------

import os

@app.route('/add_product', methods=['GET','POST'])
def add_product():

    if request.method == "POST":

        seller_name = request.form['seller_name']   # NEW
        name = request.form['name']
        per_pack = request.form['per_pack']         # NEW
        price = request.form['price']
        category = request.form['category']
        ingredients = request.form['ingredients']

        image = request.files['image']
        filename = image.filename

        path = os.path.join("static","uploads",filename)
        image.save(path)

        seller_id = session['seller_id']

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        cursor.execute(
        """INSERT INTO products 
        (seller_name,name,per_pack,price,category,ingredients,image,seller_id) 
        VALUES (?,?,?,?,?,?,?,?)""",
        (seller_name,name,per_pack,price,category,ingredients,filename,seller_id)
        )

        conn.commit()
        conn.close()

        return redirect('/seller_dashboard')

    return render_template("add_product.html")


# -------- ORDER PAGE --------

@app.route("/order/<int:id>", methods=["GET","POST"])
def order(id):

    if "buyer_id" not in session:
        return redirect("/buyer_login?next=order/" + str(id))

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # 🔍 Verify user exists
    cursor.execute("SELECT id, name, phone FROM buyers WHERE id = ?", (session["buyer_id"],))
    user = cursor.fetchone()

    if not user:
        session.clear()
        conn.close()
        return redirect("/buyer_register")

    if request.method == "POST":

        address = request.form["address"]

        cursor.execute(
            """INSERT INTO orders(product_id, customer_name, phone, address, buyer_id)
               VALUES(?,?,?,?,?)""",
            (id, user[1], user[2], address, user[0])
        )

        conn.commit()
        conn.close()

        return "<h3 style='color:green;'>Order Success ✅</h3>"

    conn.close()
    return render_template("order.html", user=user)

# -------- VIEW PAPAD --------

@app.route('/view_papad')
def view_papad():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE category='Papad'")
    papads = cursor.fetchall()

    conn.close()

    return render_template("view_papad.html", papads=papads)

# -------- VIEW kuradai --------

@app.route('/view_kuradai')
def view_kuradai():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE category='kuradai'")
    kuradais = cursor.fetchall()

    conn.close()

    return render_template("view_kuradai.html", kuradais=kuradais)

# -------- VIEW snacks --------

@app.route('/snacks')
def snacks():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE category='snacks'")
    snacks = cursor.fetchall()

    conn.close()

    return render_template("view_snacks.html", snacks=snacks)

# -------- VIEW combo --------

@app.route('/combo')
def combo():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE category='combo'")
    combos = cursor.fetchall()

    conn.close()

    return render_template("view_combo.html", combos=combos)


# -------- VIEW upwas --------

@app.route('/upwas')
def upwas():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE category='upwas'")
    upwas = cursor.fetchall()

    conn.close()

    return render_template("view_upwas.html", upwas=upwas)


# ---- VIEW LONCHE ----

@app.route('/view_lonche')
def view_lonche():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE category LIKE '%lonch%'")
    lonches = cursor.fetchall()

    conn.close()

    return render_template("view_lonche.html", lonches=lonches)



# -------- ADMIN LOGIN --------

@app.route("/admin_login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        # Fixed Admin Login
        if username == "admin" and password == "admin123":
            session["admin_id"] = username
            return redirect("/admin_dashboard")

        else:
            return "Invalid Username or Password"

    return render_template("admin_login.html")


# -------- ADMIN DASHBOARD --------

@app.route('/admin_dashboard')
def admin_dashboard():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Seller Count
    cursor.execute("SELECT COUNT(*) FROM sellers")
    seller_count = cursor.fetchone()[0]

    # Buyer Count
    cursor.execute("SELECT COUNT(*) FROM buyers")
    buyer_count = cursor.fetchone()[0]

    # Product Count
    cursor.execute("SELECT COUNT(*) FROM products")
    product_count = cursor.fetchone()[0]

    

    conn.close()

    return render_template(
        "admin_dashboard.html",
        seller_count=seller_count,
        buyer_count=buyer_count,
        product_count=product_count
    )

#-----Seller Dashboard----

@app.route("/seller_dashboard")
def seller_dashboard():

    if "seller_id" not in session:
        return redirect("/seller_login")

    seller_id=session["seller_id"]

    conn=sqlite3.connect("database.db")
    cursor=conn.cursor()

    cursor.execute(
    "SELECT * FROM products WHERE seller_id=?",
    (seller_id,)
    )

    products=cursor.fetchall()

    conn.close()

    return render_template("seller_dashboard.html",products=products)

#-----Delete product----

@app.route("/delete_product/<int:id>")
def delete_product(id):

    if "seller_id" not in session:
        return redirect("/seller_login")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM products WHERE id=?", (id,))

    conn.commit()
    conn.close()

    return redirect("/seller_dashboard")

#-----Search Bar-------#

@app.route("/search")
def search():

    query = request.args.get("query")

    if not query:
        return redirect("/")

    words = query.lower().split()   # split words

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    sql = "SELECT * FROM products WHERE "
    conditions = []
    values = []

    for word in words:
        conditions.append("(LOWER(name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(ingredients) LIKE ?)")
        values.extend([f"%{word}%", f"%{word}%", f"%{word}%"])

    sql += " AND ".join(conditions)

    cursor.execute(sql, values)
    products = cursor.fetchall()

    conn.close()

    return render_template(
        "search_results.html",
        products=products,
        query=query
    )

# ---------------- DB ----------------
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# ---------------- HOME ----------------
@app.route("/")
def home():
    if "buyer_id" in session:
        return redirect("/buyer_dashboard")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    return render_template("home.html", products=products)

# ---------------- REGISTER ----------------
@app.route("/buyer_register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        phone = request.form["phone"]
        address = request.form["address"]
        password = request.form["password"]

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO buyers(name,email,phone,address,password)
        VALUES(?,?,?,?,?)
        """,(name,email,phone,address,password))

        conn.commit()
        session["buyer_id"] = cursor.lastrowid
        conn.close()

        return redirect("/buyer_dashboard")

    return render_template("buyer_register.html")

# ---------------- LOGIN ----------------
@app.route("/buyer_login", methods=["GET","POST"])
def buyer_login():

    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM buyers WHERE email=? AND password=?", (email,password))
        buyer = cursor.fetchone()
        conn.close()

        if buyer:

            session["buyer_id"] = buyer[0]   # IMPORTANT
            return redirect("/buyer_dashboard")

        else:
            return "Can Not Have Account,Please Register First!!!!"

    return render_template("buyer_login.html")

# ---------------- DASHBOARD ----------------
@app.route("/buyer_dashboard")
def buyer_dashboard():

    if "buyer_id" not in session:
        return redirect("/buyer_login")

    conn = get_db()
    cursor = conn.cursor()

    search = request.args.get("search")

    if search:
        cursor.execute("SELECT * FROM products WHERE name LIKE ?",('%'+search+'%',))
    else:
        cursor.execute("SELECT * FROM products")

    products = cursor.fetchall()

    cursor.execute("SELECT name FROM buyers WHERE id=?", (session["buyer_id"],))
    user = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as count FROM cart WHERE buyer_id=?", (session["buyer_id"],))
    cart_count = cursor.fetchone()["count"]

    conn.close()

    return render_template("buyer_dashboard.html",
                           products=products,
                           username=user["name"],
                           cart_count=cart_count)

# ---------------- ADD TO CART ----------------
@app.route("/add_to_cart/<int:id>")
def add_to_cart(id):

    if "buyer_id" not in session:
        session["next"] = f"/add_to_cart/{id}"
        return redirect("/buyer_login")

    buyer = session["buyer_id"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cart WHERE product_id=? AND buyer_id=?", (id,buyer))
    item = cursor.fetchone()

    if item:
        cursor.execute("UPDATE cart SET quantity=quantity+1 WHERE id=?", (item["id"],))
    else:
        cursor.execute("INSERT INTO cart(product_id,buyer_id,quantity,size) VALUES(?,?,?,?)",
                       (id,buyer,1,100))

    conn.commit()
    conn.close()

    return redirect("/cart")

# 🛒 CART PAGE
@app.route("/cart")
def cart():
    if "buyer_id" not in session:
        return redirect("/buyer_login")

    buyer = session["buyer_id"]

    conn = get_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
        SELECT cart.id, products.name, products.price,
               cart.quantity, products.category, cart.size,
               products.image
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.buyer_id = ?
    """, (buyer,))

    items = cursor.fetchall()

    total = 0
    updated_items = []

    for item in items:
        price = float(item["price"])        # 🔥 convert
        quantity = int(item["quantity"])    # 🔥 convert

        subtotal = price * quantity         # 🔥 correct calc
        total += subtotal

        updated_items.append({
            "id": item["id"],
            "name": item["name"],
            "price": price,
            "quantity": quantity,
            "category": item["category"],
            "size": item["size"],
            "image": item["image"],
            "subtotal": subtotal           # 🔥 send to HTML
        })

    return render_template("cart.html", items=updated_items, total=total)

# 🔄 AUTO UPDATE (size + quantity)
@app.route("/update_quantity/<int:id>", methods=["POST"])
def update_quantity(id):

    # ✅ Safe default values
    quantity = int(request.form.get("quantity", 1))
    size = int(request.form.get("size", 1))

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE cart 
        SET quantity=?, size=? 
        WHERE id=?
    """, (quantity, size, id))

    conn.commit()

    return redirect(url_for("cart"))


# ❌ REMOVE ITEM
@app.route("/remove/<int:id>")
def remove(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cart WHERE id=?", (id,))
    conn.commit()
    return redirect(url_for("cart"))

# ---------------- PLACE ORDER ----------------
@app.route("/place_order")
def place_order():

    if "buyer_id" not in session:
        return redirect("/buyer_login")

    buyer = session["buyer_id"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT name, phone, address FROM buyers WHERE id=?", (buyer,))
    user = cursor.fetchone()

    if not user:
        return "User not found"

    cursor.execute("SELECT product_id, quantity FROM cart WHERE buyer_id=?", (buyer,))
    items = cursor.fetchall()

    if not items:
        return "Cart is empty"

    for item in items:
        cursor.execute("""
        INSERT INTO orders (product_id, quantity, buyer_id, customer_name, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (item["product_id"], item["quantity"], buyer, user["name"], user["phone"], user["address"]))

    cursor.execute("DELETE FROM cart WHERE buyer_id=?", (buyer,))

    conn.commit()
    conn.close()

    return redirect("/orders")


# ---------------- ORDERS ----------------
@app.route("/orders")
def orders():

    if "buyer_id" not in session:
        return redirect("/buyer_login")

    buyer = session["buyer_id"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT orders.id, products.name, orders.customer_name, orders.phone, orders.address
    FROM orders
    JOIN products ON orders.product_id = products.id
    WHERE orders.buyer_id = ?
    """, (buyer,))

    data = cursor.fetchall()
    conn.close()

    return render_template("orders.html", data=data)

@app.route('/edit_order/<int:id>')
def edit_order(id):
    import sqlite3
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders WHERE id=?", (id,))
    order = cursor.fetchone()

    conn.close()

    return render_template("edit_order.html", order=order)
    

@app.route('/update_order/<int:id>', methods=['POST'])
def update_order(id):
    from flask import request, redirect
    import sqlite3

    customer_name = request.form.get('customer_name')
    phone = request.form.get('phone')
    address = request.form.get('address')

    print(customer_name, phone, address, id)  # 🔥 DEBUG

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE orders 
        SET customer_name=?, phone=?, address=? 
        WHERE id=?
    """, (customer_name, phone, address, id))

    conn.commit()

    print("Rows updated:", cursor.rowcount)  # 🔥 DEBUG

    conn.close()

    return redirect('/orders')


# ---------------- LOGOUT ----------------
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


# ---------------- RUN ----------------

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
