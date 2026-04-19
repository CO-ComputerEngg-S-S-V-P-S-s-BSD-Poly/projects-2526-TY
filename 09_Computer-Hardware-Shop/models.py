from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    service_requests = db.relationship('ServiceRequest', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan')
    activities = db.relationship('UserActivity', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class UserAddress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    full_address = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship(
        'User',
        backref=db.backref('addresses', lazy=True, cascade='all, delete-orphan')
    )

    def __repr__(self):
        return f'<UserAddress {self.id} - User {self.user_id}>'


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)  # CPU, GPU, Monitor, RAM, SSD, etc.
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(300))
    specs = db.Column(db.Text)  # JSON-like string for specifications
    tags = db.Column(db.String(300))  # comma-separated tags for search

    def __repr__(self):
        return f'<Product {self.name}>'


class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship('Product')


class WishlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False, index=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship('Product')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'product_id', name='uq_wishlist_user_product'),
    )

class WishlistSetup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    setup_type = db.Column(db.String(40), nullable=False, default='prebuild', index=True)
    profile_key = db.Column(db.String(40), nullable=False, default='student', index=True)
    setup_index = db.Column(db.Integer, nullable=False, default=0, index=True)
    name = db.Column(db.String(200), nullable=False)
    summary = db.Column(db.String(600))
    image_url = db.Column(db.String(500))
    product_ids = db.Column(db.Text, nullable=False, default='')
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'setup_type', 'profile_key', 'setup_index', name='uq_wishlist_user_setup'),
    )

class Order(db.Model):
    __tablename__ = 'customer_order'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    order_number = db.Column(db.String(40), nullable=False, unique=True, index=True)
    total_amount = db.Column(db.Float, nullable=False)
    payment_mode = db.Column(db.String(40), nullable=False)
    delivery_address = db.Column(db.String(600), nullable=False)
    source = db.Column(db.String(40), default='cart')
    status = db.Column(db.String(20), default='placed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Order {self.order_number}>'


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('customer_order.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    product_name = db.Column(db.String(220), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    product = db.relationship('Product')

    def __repr__(self):
        return f'<OrderItem {self.product_name}>'


class UserActivity(db.Model):
    __tablename__ = 'user_activity'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    activity_type = db.Column(db.String(60), nullable=False)
    summary = db.Column(db.String(300), nullable=False)
    payload = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<UserActivity {self.activity_type}>'

class SetupImageRule(db.Model):
    __tablename__ = 'setup_image_rule'

    id = db.Column(db.Integer, primary_key=True)
    setup_type = db.Column(db.String(40), nullable=False, default='prebuild', index=True)
    profile_key = db.Column(db.String(40), index=True)
    setup_index = db.Column(db.Integer, index=True)
    setup_name = db.Column(db.String(140), index=True)
    image_url = db.Column(db.String(500), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        key_parts = [self.setup_type or 'setup']
        if self.profile_key:
            key_parts.append(self.profile_key)
        if self.setup_index is not None:
            key_parts.append(str(self.setup_index))
        if self.setup_name:
            key_parts.append(self.setup_name)
        return f"<SetupImageRule {'/'.join(key_parts)}>"

class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service_type = db.Column(db.String(50), nullable=False)  # repair, installation, upgrade
    device_model = db.Column(db.String(100))

    # Home visit fields (NEW)
    home_visit = db.Column(db.Boolean, default=False)
    address = db.Column(db.String(500))

    # Repair specific
    part_to_repair = db.Column(db.String(50))
    issue_description = db.Column(db.Text)

    # Installation specific
    os_type = db.Column(db.String(50))  # windows, linux, dual_boot
    os_version = db.Column(db.String(50))

    # Upgrade specific
    upgrade_type = db.Column(db.String(50))  # ram, ssd, both
    # current_specs = db.Column(db.Text)
    # desired_specs = db.Column(db.Text)

    # Common fields
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    estimated_cost = db.Column(db.Float)
    estimated_time = db.Column(db.String(50))  # in hours or days
    # notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ServiceRequest {self.id} - {self.service_type}>'




