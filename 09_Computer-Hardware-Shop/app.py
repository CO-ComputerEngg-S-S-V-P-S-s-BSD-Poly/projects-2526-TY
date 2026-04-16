from flask import Flask, Response, flash, g, jsonify, redirect, render_template, request, session, url_for
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, current_user, login_required, login_user, logout_user
from flask_migrate import Migrate
from markupsafe import Markup, escape
from collections import defaultdict
from datetime import datetime
from difflib import get_close_matches
import hashlib
import json
import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from uuid import uuid4


from models import (
    CartItem,
    Order,
    OrderItem,
    Product,
    ServiceRequest,
    SetupImageRule,
    User,
    UserAddress,
    WishlistItem,
    WishlistSetup,
    db,
)

app = Flask(__name__)
app.config["SECRET_KEY"] = "your-secret-key-change-in-production"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///hardware_shop.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login_page"
login_manager.login_message = "Please log in to access this page."


CATEGORY_OPTIONS = [
    {"slug": "cpu", "code": "CPU", "label": "CPU"},
    {"slug": "gpu", "code": "GPU", "label": "GPU"},
    {"slug": "ram", "code": "RAM", "label": "RAM"},
    {"slug": "monitor", "code": "MONITOR", "label": "Monitor"},
    {"slug": "mouse", "code": "MOUSE", "label": "Mouse"},
    {"slug": "keyboard", "code": "KEYBOARD", "label": "Keyboard"},
    {"slug": "storage", "code": "STORAGE", "label": "Storage"},
    {"slug": "motherboard", "code": "MOTHERBOARD", "label": "Motherboard"},
    {"slug": "psu", "code": "PSU", "label": "PSU"},
]
CATEGORY_BY_SLUG = {c["slug"]: c for c in CATEGORY_OPTIONS}

CUSTOM_PC_CATEGORY_FLOW = [
    {"slug": "monitor", "code": "MONITOR", "label": "Monitor"},
    {"slug": "cpu", "code": "CPU", "label": "CPU"},
    {"slug": "gpu", "code": "GPU", "label": "GPU"},
    {"slug": "ram", "code": "RAM", "label": "RAM"},
    {"slug": "storage", "code": "STORAGE", "label": "Storage"},
    {"slug": "keyboard", "code": "KEYBOARD", "label": "Keyboard"},
    {"slug": "mouse", "code": "MOUSE", "label": "Mouse"},
]
CUSTOM_PC_CATEGORY_CODES = [entry["code"] for entry in CUSTOM_PC_CATEGORY_FLOW]
HOME_PROFILE_ORDER = ["student", "gaming", "developer", "professional", "content_creation"]

PRICE_FILTER_MIN = 200
PRICE_FILTER_MAX = 120000

SEARCH_TOKEN_ALIASES = {
    "processor": ["cpu", "intel", "amd", "ryzen", "core"],
    "processer": ["processor", "cpu", "intel", "amd", "ryzen", "core"],
    "proccessor": ["processor", "cpu", "intel", "amd", "ryzen", "core"],
    "processors": ["cpu", "intel", "amd", "ryzen", "core"],
    "cpu": ["processor", "intel", "amd", "ryzen"],
    "chip": ["cpu", "processor", "silicon"],
    "chipset": ["cpu", "processor", "motherboard"],
    "gpu": ["graphics", "graphic", "video", "card", "nvidia", "radeon"],
    "graphics": ["gpu", "graphic", "video", "card"],
    "graphic": ["gpu", "graphics", "video", "card"],
    "card": ["gpu", "graphics", "graphic"],
    "vga": ["gpu", "graphics", "video", "card"],
    "ram": ["memory", "ddr4", "ddr5"],
    "memory": ["ram", "ddr4", "ddr5"],
    "storage": ["ssd", "hdd", "nvme", "drive", "disk"],
    "ssd": ["storage", "nvme"],
    "hdd": ["storage", "hard", "disk"],
    "hard": ["hdd", "storage", "disk"],
    "disk": ["hdd", "storage", "ssd"],
    "monitor": ["display", "screen"],
    "display": ["monitor", "screen"],
    "screen": ["monitor", "display"],
    "keyboard": ["typing", "keys"],
    "mouse": ["pointer"],
    "computer": ["pc", "desktop", "setup"],
    "desktop": ["pc", "computer", "setup"],
    "pc": ["computer", "desktop", "setup"],
    "setup": ["pc", "computer", "build"],
    "pendrive": ["usb", "storage"],
    "usb": ["pendrive", "storage"],
}

SEARCH_PHRASE_ALIASES = {
    "graphic card": ["gpu", "graphics", "video card"],
    "graphics card": ["gpu", "graphics", "video card"],
    "video card": ["gpu", "graphics"],
    "hard disk": ["storage", "hdd", "ssd"],
    "solid state": ["storage", "ssd", "nvme"],
    "solid state drive": ["storage", "ssd", "nvme"],
    "cpu processor": ["cpu", "processor"],
    "central processing unit": ["cpu", "processor"],
    "office work": ["professional", "office"],
    "software developer": ["developer", "coding", "programming"],
    "content creation": ["creator", "editing", "creative"],
    "video editing": ["content creation", "creator", "editing"],
    "photo editing": ["content creation", "creator", "editing"],
}
BRAND_OPTIONS = {
    "CPU": ["Intel", "AMD"],
    "GPU": ["NVIDIA", "Intel", "AMD"],
    "RAM": ["Acer", "Adata", "Corsair", "Crucial", "EVM"],
    "MONITOR": ["Asus", "Dell", "Benq", "Cooler Master", "AOC"],
    "KEYBOARD": ["Logitech", "Zebronics", "Lenovo", "HP", "ProDot"],
    "MOUSE": ["Logitech", "Dell", "HP", "Lenovo"],
    "STORAGE": ["Acer", "Adata", "AddLink", "Asus", "Corsair"],
    "MOTHERBOARD": ["ASRock", "Asus", "GigaByte", "MSI"],
    "PSU": ["Seasonic", "Corsair", "Asus", "MSI", "Cooler Master"],
}
SIZE_OPTIONS = {
    "RAM": ["4GB", "8GB", "16GB", "32GB", "48GB"],
    "GPU": ["4GB", "8GB", "12GB", "16GB", "32GB", "48GB"],
    "STORAGE": ["256GB", "512GB", "1TB", "2TB", "4TB"],
}
MEMORY_TYPE_OPTIONS = {
    "RAM": ["DDR3", "DDR4", "DDR5"],
    "GPU": ["GDDR5X", "GDDR6X", "GDDR7X"],
    "STORAGE": ["HDD", "SSD", "Memory Card", "Pen Drive"],
}

PAYMENT_MODES = [
    {"code": "card", "label": "Credit / Debit Card"},
    {"code": "netbanking", "label": "Net Banking"},
    {"code": "upi_qr", "label": "Scan & Pay with UPI"},
    {"code": "upi_app", "label": "Other UPI Apps"},
    {"code": "cod", "label": "Cash on Delivery"},
]

SERVICE_BOOKING_FEE = 50.0

SHOP_NAME = "S. K. InfoCom, Dhule"
SHOP_CONTACT = {
    "location": "Dhule, Maharashtra",
    "mobile": "1234567890",
    "email": "sk_infocom@dhule.in",
}

PRODUCT_PHOTO_TAGS = {
    "CPU": "cpu,processor,pc-component",
    "GPU": "graphics-card,gpu,pc-component",
    "RAM": "ram,memory,module",
    "MONITOR": "computer-monitor,desktop-display,screen",
    "MOUSE": "computer-mouse,gaming-mouse,desktop-peripheral",
    "KEYBOARD": "computer-keyboard,gaming-keyboard,desktop-peripheral",
    "STORAGE": "ssd,hard-drive,storage-device",
    "MOTHERBOARD": "motherboard,pc-board,circuit-board",
    "PSU": "power-supply,psu,pc-component",
}

SETUP_PHOTO_TAGS = {
    "prebuild": "desktop-computer,pc-setup,computer-desk,monitor,keyboard,mouse",
    "prebuild-pc": "desktop-computer,pc-setup,computer-desk,monitor,keyboard,mouse",
    "prebuild_pc": "desktop-computer,pc-setup,computer-desk,monitor,keyboard,mouse",
    "custom-build": "desktop-computer,custom-pc,pc-setup,computer-desk,monitor,workspace",
    "custom_pc": "desktop-computer,custom-pc,pc-setup,computer-desk,monitor,workspace",
    "setup": "desktop-computer,pc-setup,computer-desk,monitor,keyboard,mouse",
}
CUSTOM_BUILD_DEFAULT_IMAGE = "/static/setup-images/custom-build-default.svg"

PHOTO_TAG_STOPWORDS = {"with", "for", "and", "the", "edition", "series", "model", "wireless", "wired"}
AUTO_IMAGE_PREFIXES = (
    "https://loremflickr.com/",
    # Keep legacy generated-image paths recognizable as auto URLs in old records.
    "/generated-image/",
)

SETUP_IMAGE_TYPE_ALIASES = {
    "prebuild": "prebuild",
    "prebuild-pc": "prebuild",
    "custom": "custom-build",
    "custom-pc": "custom-build",
    "custom-build": "custom-build",
    "setup": "setup",
}

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


@app.template_filter("inr")
def format_inr(value):
    try:
        amount = float(value)
    except (TypeError, ValueError):
        amount = 0.0
    return f"\u20b9{amount:,.2f}"


def _safe_float(value, default):
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def _sanitize_next_url(raw_next):
    if not raw_next:
        return None
    next_url = raw_next.strip()
    if not next_url or next_url.lower() in {"none", "null"}:
        return None
    parsed = urlparse(next_url)
    if parsed.scheme or parsed.netloc:
        return None
    if not next_url.startswith("/"):
        return None
    return next_url


def _normalize_address(raw_address):
    return " ".join((raw_address or "").split())


def _normalize_phone(raw_phone):
    digits = "".join(ch for ch in (raw_phone or "") if ch.isdigit())
    if len(digits) > 10:
        digits = digits[-10:]
    return digits


def _parse_specs(product):
    if not product.specs:
        return {}
    if isinstance(product.specs, dict):
        return product.specs
    try:
        parsed = json.loads(product.specs)
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        return {}


def _photo_tag_slug(raw_text):
    return re.sub(r"[^a-z0-9]+", "-", (raw_text or "").lower()).strip("-")


def _stable_lock(*parts, min_value=1, max_value=999999):
    if min_value > max_value:
        min_value, max_value = max_value, min_value
    seed_text = "|".join(str(part).strip() for part in parts if str(part).strip()) or "lock"
    digest = hashlib.sha256(seed_text.encode("utf-8")).hexdigest()
    span = max_value - min_value + 1
    return min_value + (int(digest[:12], 16) % span)


def _hardware_photo_url(tags, *seed_parts, min_lock=1, max_lock=999999):
    normalized_tags = []
    seen = set()
    for tag in tags:
        slug = _photo_tag_slug(tag)
        if not slug or slug in seen:
            continue
        seen.add(slug)
        normalized_tags.append(slug)
    if not normalized_tags:
        normalized_tags = ["computer", "hardware", "pc"]
    tag_path = ",".join(normalized_tags[:6])
    lock_id = _stable_lock(*seed_parts, min_value=min_lock, max_value=max_lock)
    return f"https://loremflickr.com/1200/900/{tag_path}?lock={lock_id}"




def _is_auto_image_url(raw_url):
    normalized = str(raw_url or "").strip()
    return not normalized or normalized.startswith(AUTO_IMAGE_PREFIXES)


def _object_value(subject, *keys):
    for key in keys:
        if isinstance(subject, dict):
            value = subject.get(key)
        else:
            value = getattr(subject, key, None)
        if value not in (None, ""):
            return value
    return None


def _extract_brand(product_like):
    specs = _object_value(product_like, "specs")
    parsed_specs = specs if isinstance(specs, dict) else {}
    if isinstance(specs, str):
        try:
            parsed_specs = json.loads(specs)
        except Exception:
            parsed_specs = {}
    if isinstance(parsed_specs, dict):
        brand = str(parsed_specs.get("brand") or "").strip()
        if brand:
            return brand
    return ""


def _product_like_photo_tags(product_like):
    category_code = str(_object_value(product_like, "category", "category_label") or "").upper()
    category_tags = PRODUCT_PHOTO_TAGS.get(category_code, "pc-component,computer-hardware").split(",")

    brand = _extract_brand(product_like)
    raw_name = str(_object_value(product_like, "name", "product_name") or "").strip()
    name_tokens = [
        token
        for token in _slugify_text(raw_name).split("-")
        if token and len(token) > 2 and token not in PHOTO_TAG_STOPWORDS
    ]

    tags = list(category_tags)
    if brand:
        tags.append(brand)
    tags.extend(name_tokens[:3])
    return tags


def _generated_product_image(product_like):
    category = str(_object_value(product_like, "category", "category_label") or "hardware").upper()
    brand = _extract_brand(product_like)
    name = str(_object_value(product_like, "name", "product_name") or "Hardware Item").strip()
    product_id = _object_value(product_like, "id", "product_id") or name
    tags = _product_like_photo_tags(product_like)
    return _hardware_photo_url(tags, "product", category, brand, name, product_id, min_lock=10000, max_lock=199999)


def _fallback_pc_image_url(kind, *seed_parts):
    normalized_kind = _photo_tag_slug(kind)
    base_tags = SETUP_PHOTO_TAGS.get(normalized_kind, SETUP_PHOTO_TAGS["setup"]).split(",")
    return _hardware_photo_url(base_tags, "fallback-pc", normalized_kind, *seed_parts, min_lock=700000, max_lock=999999)


def _is_external_http_url(raw_url):
    normalized = str(raw_url or "").strip().lower()
    return normalized.startswith("http://") or normalized.startswith("https://")


def _resolved_product_image(product_like):
    custom_image = str(_object_value(product_like, "image_url") or "").strip()
    if custom_image and not _is_auto_image_url(custom_image):
        if _is_external_http_url(custom_image):
            product_id = _object_value(product_like, "id", "product_id")
            try:
                if product_id is not None:
                    return url_for("product_image_proxy", product_id=int(product_id))
            except Exception:
                pass
        return custom_image
    return _generated_product_image(product_like)


def _image_for_product(product):
    return _resolved_product_image(product)


@app.template_global("product_image")
def product_image_template(product_like):
    return _resolved_product_image(product_like)


@app.context_processor
def inject_shop_context():
    return {"shop_name": SHOP_NAME, "shop_contact": SHOP_CONTACT}


def _slugify_text(raw_text):
    compact = re.sub(r"[^a-z0-9]+", "-", (raw_text or "").lower()).strip("-")
    return compact or "hardware-item"


def _normalize_setup_type(setup_type):
    return SETUP_IMAGE_TYPE_ALIASES.get(_photo_tag_slug(setup_type), "setup")


def _is_setup_image_url(raw_url):
    normalized = str(raw_url or "").strip()
    if not normalized:
        return False
    lowered = normalized.lower()
    return (
        lowered.startswith("/static/")
        or lowered.startswith("http://")
        or lowered.startswith("https://")
    )


def _find_setup_image_override(setup_type, setup_name="", profile_key="", setup_index=None):
    normalized_type = _normalize_setup_type(setup_type)
    normalized_name = _photo_tag_slug(setup_name)
    normalized_profile = _photo_tag_slug(profile_key)

    try:
        normalized_index = int(setup_index) if setup_index is not None else None
    except (TypeError, ValueError):
        normalized_index = None

    fallback_type = "setup" if normalized_type != "setup" else None
    type_candidates = [normalized_type]
    if fallback_type:
        type_candidates.append(fallback_type)

    best_image = ""
    best_score = -1

    for type_candidate in type_candidates:
        rules = SetupImageRule.query.filter_by(setup_type=type_candidate, is_active=True).all()
        for rule in rules:
            image_url = str(rule.image_url or "").strip()
            if not _is_setup_image_url(image_url):
                continue

            score = 1

            rule_profile = _photo_tag_slug(rule.profile_key)
            if rule_profile:
                if rule_profile != normalized_profile:
                    continue
                score += 4

            if rule.setup_index is not None:
                if normalized_index is None or int(rule.setup_index) != normalized_index:
                    continue
                score += 4

            rule_name = _photo_tag_slug(rule.setup_name)
            if rule_name:
                if rule_name != normalized_name:
                    continue
                score += 2

            if score > best_score or (score == best_score and type_candidate == normalized_type):
                best_score = score
                best_image = image_url

        if best_image and type_candidate == normalized_type:
            break

    return best_image

def _product_image_url(product, brand=""):
    product_id = product.id if getattr(product, "id", None) else _stable_lock(product.category, brand, product.name)
    tags = _product_like_photo_tags(product)
    return _hardware_photo_url(tags, "product", product.category, brand, product.name, product_id, min_lock=10000, max_lock=199999)


def _setup_image_url(setup_type, setup_name="", selected_product_ids=None, profile_key="", setup_index=None):
    selected_ids = selected_product_ids or []
    normalized_type = _normalize_setup_type(setup_type)

    manual_image = _find_setup_image_override(
        normalized_type,
        setup_name=setup_name,
        profile_key=profile_key,
        setup_index=setup_index,
    )
    if manual_image:
        return manual_image

    if normalized_type == "custom-build":
        return CUSTOM_BUILD_DEFAULT_IMAGE

    base_tags = SETUP_PHOTO_TAGS.get(normalized_type, SETUP_PHOTO_TAGS["setup"]).split(",")
    name_tokens = [token for token in _slugify_text(setup_name).split("-") if token and token not in PHOTO_TAG_STOPWORDS]
    tags = base_tags + name_tokens[:2]
    id_seed = "-".join(str(pid) for pid in selected_ids) or "no-components"
    return _hardware_photo_url(tags, "setup", normalized_type, setup_name, id_seed, min_lock=200000, max_lock=999999)


@app.template_global("pc_fallback_image")
def pc_fallback_image_template(kind="setup", *seed_parts):
    return _fallback_pc_image_url(kind, *seed_parts)


def _model_image_url(model_name, category, brand=""):
    category_code = str(category or "").upper()
    base_tags = PRODUCT_PHOTO_TAGS.get(category_code, "pc-component,computer-hardware").split(",")
    model_tokens = [
        token
        for token in _slugify_text(model_name).split("-")
        if token and len(token) > 2 and token not in PHOTO_TAG_STOPWORDS
    ]
    tags = list(base_tags)
    if brand:
        tags.append(brand)
    tags.extend(model_tokens[:3])
    return _hardware_photo_url(tags, "product", category_code, brand, model_name, min_lock=10000, max_lock=199999)


@app.route("/product-image/<int:product_id>")
def product_image_proxy(product_id):
    product = db.session.get(Product, product_id)
    if product is None:
        return redirect(pc_fallback_image_template("product-fallback", product_id))

    raw_image = (product.image_url or "").strip()
    if not raw_image or _is_auto_image_url(raw_image):
        return redirect(_generated_product_image(product))

    if raw_image.startswith("/static/"):
        return redirect(raw_image)

    if not _is_external_http_url(raw_image):
        return redirect(_generated_product_image(product))

    try:
        req = Request(
            raw_image,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Referer": "",
            },
        )
        with urlopen(req, timeout=10) as remote_response:
            content_type = remote_response.headers.get("Content-Type", "image/jpeg")
            if "image" not in content_type.lower():
                raise ValueError("Remote URL did not return image content.")
            payload = remote_response.read()

        response = Response(payload, mimetype=content_type.split(";")[0])
        response.headers["Cache-Control"] = "public, max-age=43200"
        return response
    except (HTTPError, URLError, TimeoutError, ValueError, OSError):
        return redirect(_generated_product_image(product))

def _address_payload_from_record(address_obj):
    raw = (address_obj.full_address or "").strip()
    if not raw:
        return {"full_name": "", "mobile": "", "address": "", "country": "India", "is_default": False}
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict) and parsed.get("address"):
            return {
                "full_name": parsed.get("full_name", "").strip(),
                "mobile": parsed.get("mobile", "").strip(),
                "address": parsed.get("address", "").strip(),
                "country": parsed.get("country", "India").strip() or "India",
                "is_default": bool(parsed.get("is_default", False)),
            }
    except Exception:
        pass
    return {
        "full_name": "",
        "mobile": "",
        "address": raw,
        "country": "India",
        "is_default": False,
    }


def _address_payload_to_storage(payload):
    clean = {
        "full_name": _normalize_address(payload.get("full_name")),
        "mobile": _normalize_phone(payload.get("mobile")),
        "address": _normalize_address(payload.get("address")),
        "country": (payload.get("country") or "India").strip() or "India",
        "is_default": bool(payload.get("is_default", False)),
    }
    return json.dumps(clean, ensure_ascii=True, separators=(",", ":"))


def _address_display(payload):
    parts = [part for part in [payload.get("full_name"), payload.get("mobile")] if part]
    prefix = " | ".join(parts)
    if prefix:
        return f"{prefix} | {payload.get('address', '')}"
    return payload.get("address", "")






def _get_user_addresses_for_display(user_id):
    addresses = (
        UserAddress.query.filter_by(user_id=user_id)
        .order_by(UserAddress.updated_at.desc(), UserAddress.id.desc())
        .all()
    )
    cards = []
    for addr in addresses:
        payload = _address_payload_from_record(addr)
        cards.append(
            {
                "id": addr.id,
                "full_name": payload.get("full_name", ""),
                "mobile": payload.get("mobile", ""),
                "address": payload.get("address", ""),
                "country": payload.get("country", "India"),
                "is_default": payload.get("is_default", False),
                "display": _address_display(payload),
            }
        )
    return cards


def _save_user_address(user_id, raw_address):
    normalized = _normalize_address(raw_address)
    if not normalized:
        return None

    existing = None
    user_addresses = UserAddress.query.filter_by(user_id=user_id).all()
    for addr in user_addresses:
        payload = _address_payload_from_record(addr)
        if payload.get("address", "").lower() == normalized.lower():
            existing = addr
            break
    if existing:
        existing.updated_at = datetime.utcnow()
        return existing

    payload = {"full_name": "", "mobile": "", "address": normalized, "country": "India", "is_default": False}
    if not user_addresses:
        payload["is_default"] = True
    address = UserAddress(user_id=user_id, full_address=_address_payload_to_storage(payload))
    db.session.add(address)
    return address


def _get_session_cart():
    return session.get("cart", [])


def _set_session_cart(cart_items):
    session["cart"] = cart_items
    session.modified = True


def _normalize_group_id(raw_group_id):
    cleaned = re.sub(r"[^a-zA-Z0-9_-]+", "", str(raw_group_id or "").strip())
    return cleaned[:40]


def _cart_groups_session_key(user_id=None):
    if user_id is None:
        if current_user.is_authenticated:
            user_id = current_user.id
        else:
            return "cart_groups"

    try:
        normalized_user_id = int(user_id)
    except (TypeError, ValueError):
        return "cart_groups"

    return f"cart_groups_user_{normalized_user_id}"


def _sanitize_cart_groups(raw_groups):
    if not isinstance(raw_groups, list):
        return [], bool(raw_groups)

    groups = []
    changed = False

    for entry in raw_groups:
        if not isinstance(entry, dict):
            changed = True
            continue

        group_id = _normalize_group_id(entry.get("id"))
        product_ids = _parse_product_ids_payload(entry.get("product_ids"))
        if not group_id or not product_ids:
            changed = True
            continue

        setup_index = entry.get("setup_index")
        try:
            setup_index = int(setup_index) if setup_index is not None else None
        except (TypeError, ValueError):
            setup_index = None
            changed = True

        group_type = (entry.get("type") or "custom_pc").strip() or "custom_pc"
        group_name = (entry.get("name") or "PC Setup").strip() or "PC Setup"
        profile_key = (entry.get("profile_key") or "").strip()
        raw_image = (entry.get("image_url") or "").strip()
        has_manual_image = _is_setup_image_url(raw_image) and not _is_auto_image_url(raw_image)
        image_url = raw_image if has_manual_image else _setup_image_url(
            group_type,
            group_name,
            product_ids,
            profile_key=profile_key,
            setup_index=setup_index,
        )

        normalized_entry = {
            "id": group_id,
            "type": group_type,
            "name": group_name,
            "summary": (entry.get("summary") or "").strip(),
            "image_url": image_url,
            "profile_key": profile_key,
            "setup_index": setup_index,
            "product_ids": product_ids,
        }

        if image_url != raw_image:
            changed = True

        groups.append(normalized_entry)

    if len(groups) != len(raw_groups):
        changed = True

    return groups, changed


def _get_session_cart_groups(user_id=None):
    session_key = _cart_groups_session_key(user_id)
    raw_groups = session.get(session_key)
    migrated_legacy = False

    if raw_groups is None and session_key != "cart_groups":
        legacy_groups = session.get("cart_groups")
        if isinstance(legacy_groups, list) and legacy_groups:
            raw_groups = legacy_groups
            migrated_legacy = True

    groups, changed = _sanitize_cart_groups(raw_groups if raw_groups is not None else [])

    if migrated_legacy or changed:
        session[session_key] = groups
        if session_key != "cart_groups":
            session.pop("cart_groups", None)
        session.modified = True

    return groups


def _set_session_cart_groups(groups, user_id=None):
    session_key = _cart_groups_session_key(user_id)
    normalized_groups, _ = _sanitize_cart_groups(groups)
    session[session_key] = normalized_groups
    if session_key != "cart_groups":
        session.pop("cart_groups", None)
    session.modified = True


def _current_cart_product_ids():
    if current_user.is_authenticated:
        return {item.product_id for item in CartItem.query.filter_by(user_id=current_user.id).all()}

    ids = set()
    for entry in _get_session_cart():
        try:
            ids.add(int(entry.get("product_id", 0)))
        except (TypeError, ValueError):
            continue
    return {pid for pid in ids if pid > 0}


def _cleanup_cart_groups(valid_product_ids=None):
    valid_ids = set(valid_product_ids or _current_cart_product_ids())
    groups = _get_session_cart_groups()
    cleaned = [group for group in groups if set(group["product_ids"]).issubset(valid_ids)]
    if len(cleaned) != len(groups):
        _set_session_cart_groups(cleaned)
    return cleaned


def _find_cart_group(group_id):
    normalized_id = _normalize_group_id(group_id)
    if not normalized_id:
        return None
    for group in _get_session_cart_groups():
        if group["id"] == normalized_id:
            return group
    return None


def _find_cart_group_by_product(product_id):
    try:
        product_id = int(product_id)
    except (TypeError, ValueError):
        return None

    if product_id <= 0:
        return None

    for group in _get_session_cart_groups():
        if product_id in group["product_ids"]:
            return group
    return None


def _expand_bundle_selection(product_ids):
    selected_ids = set(_parse_product_ids_payload(product_ids))
    if not selected_ids:
        return []

    for group in _get_session_cart_groups():
        group_ids = set(group["product_ids"])
        if selected_ids.intersection(group_ids):
            selected_ids.update(group_ids)
    return sorted(selected_ids)


def _delete_cart_group(group_id):
    normalized_id = _normalize_group_id(group_id)
    if not normalized_id:
        return
    groups = [group for group in _get_session_cart_groups() if group["id"] != normalized_id]
    _set_session_cart_groups(groups)


def _save_cart_group(
    group_type,
    name,
    summary,
    product_ids,
    image_url="",
    profile_key="",
    setup_index=None,
    group_id=None,
):
    cleaned_ids = _parse_product_ids_payload(product_ids)
    if not cleaned_ids:
        return None

    normalized_id = _normalize_group_id(group_id) or uuid4().hex[:12]
    selected_set = set(cleaned_ids)

    groups = []
    overlapping_groups = []
    for group in _get_session_cart_groups():
        if group["id"] == normalized_id:
            continue
        group_ids = set(group["product_ids"])
        if selected_set.intersection(group_ids):
            overlapping_groups.append(group)
            continue
        groups.append(group)

    if overlapping_groups:
        overlapping_ids = {pid for group in overlapping_groups for pid in group.get("product_ids", [])}
        retained_ids = {pid for group in groups for pid in group.get("product_ids", [])}
        removable_ids = sorted(overlapping_ids - retained_ids - selected_set)
        if removable_ids:
            _remove_products_from_cart(removable_ids, persist=False, expand_bundles=False)

    normalized_type = (group_type or "custom_pc").strip() or "custom_pc"
    normalized_name = (name or "PC Setup").strip() or "PC Setup"
    raw_image = (image_url or "").strip()
    has_manual_image = _is_setup_image_url(raw_image) and not _is_auto_image_url(raw_image)
    resolved_image = raw_image if has_manual_image else _setup_image_url(normalized_type, normalized_name, cleaned_ids, profile_key=profile_key, setup_index=setup_index)

    entry = {
        "id": normalized_id,
        "type": normalized_type,
        "name": normalized_name,
        "summary": (summary or "").strip(),
        "image_url": resolved_image,
        "profile_key": (profile_key or "").strip(),
        "setup_index": setup_index if isinstance(setup_index, int) else None,
        "product_ids": cleaned_ids,
    }
    groups.insert(0, entry)
    _set_session_cart_groups(groups)
    return entry


def _remove_products_from_cart(product_ids, persist=True, expand_bundles=True):
    selected_ids = _expand_bundle_selection(product_ids) if expand_bundles else _parse_product_ids_payload(product_ids)
    if not selected_ids:
        return 0

    selected_set = set(selected_ids)

    if current_user.is_authenticated:
        query = CartItem.query.filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id.in_(selected_ids),
        )
        removed = query.count()
        query.delete(synchronize_session=False)
        if persist:
            db.session.commit()
    else:
        session_cart = _get_session_cart()
        before = len(session_cart)
        session_cart = [
            entry
            for entry in session_cart
            if int(entry.get("product_id", 0)) not in selected_set
        ]
        removed = before - len(session_cart)
        _set_session_cart(session_cart)

    _cleanup_cart_groups()

    selected_checkout_ids = session.get("selected_cart_product_ids") or []
    if selected_checkout_ids:
        filtered = [int(pid) for pid in selected_checkout_ids if str(pid).isdigit() and int(pid) not in selected_set]
        session["selected_cart_product_ids"] = filtered
        session.modified = True

    return removed


def merge_session_cart_into_user(user):
    # Ensure any legacy/guest group metadata is migrated into the logged-in user's bucket.
    _get_session_cart_groups(user_id=user.id)

    session_cart = _get_session_cart()
    if not session_cart:
        return

    for entry in session_cart:
        try:
            product_id = int(entry.get("product_id"))
            quantity = max(1, int(entry.get("quantity", 1)))
        except Exception:
            continue

        product = db.session.get(Product, product_id)
        if not product:
            continue

        existing = CartItem.query.filter_by(user_id=user.id, product_id=product_id).first()
        if existing:
            existing.quantity += quantity
        else:
            db.session.add(CartItem(user_id=user.id, product_id=product_id, quantity=quantity))

    db.session.commit()
    session.pop("cart", None)


def _cart_summary_for_current_user():
    raw_items = []

    if current_user.is_authenticated:
        items = (
            CartItem.query.filter_by(user_id=current_user.id)
            .order_by(CartItem.added_at.desc(), CartItem.id.desc())
            .all()
        )
        for item in items:
            if not item.product:
                continue
            raw_items.append(
                {
                    "product_id": item.product_id,
                    "name": item.product.name,
                    "image_url": _image_for_product(item.product),
                    "price": float(item.product.price),
                    "quantity": int(item.quantity),
                    "detail_url": url_for("product_detail", product_id=item.product_id),
                }
            )
    else:
        session_cart = _get_session_cart()
        ids = [int(entry.get("product_id", 0)) for entry in session_cart]
        products = {p.id: p for p in Product.query.filter(Product.id.in_(ids)).all()} if ids else {}

        for entry in session_cart:
            pid = int(entry.get("product_id", 0))
            qty = max(1, int(entry.get("quantity", 1)))
            product = products.get(pid)
            if not product:
                continue
            raw_items.append(
                {
                    "product_id": pid,
                    "name": product.name,
                    "image_url": _image_for_product(product),
                    "price": float(product.price),
                    "quantity": qty,
                    "detail_url": url_for("product_detail", product_id=pid),
                }
            )

    products_by_id = {item["product_id"]: item for item in raw_items}
    grouped_ids = set()
    grouped_rows = []

    for group in _cleanup_cart_groups(set(products_by_id.keys())):
        group_products = [products_by_id.get(pid) for pid in group["product_ids"] if products_by_id.get(pid)]
        if not group_products:
            continue

        grouped_ids.update(group["product_ids"])
        total_price = sum(item["price"] * item["quantity"] for item in group_products)

        grouped_rows.append(
            {
                "item_key": f"bundle:{group['id']}",
                "item_type": "bundle",
                "bundle_id": group["id"],
                "bundle_type": group.get("type", "custom_pc"),
                "product_id": None,
                "product_ids": list(group["product_ids"]),
                "name": group.get("name") or "PC Setup",
                "summary": group.get("summary") or "",
                "image_url": group.get("image_url") or group_products[0]["image_url"],
                "price": float(total_price),
                "quantity": 1,
                "detail_url": url_for("cart_bundle_detail", group_id=group["id"]),
            }
        )

    standalone_rows = []
    for item in raw_items:
        pid = item["product_id"]
        if pid in grouped_ids:
            continue
        standalone_rows.append(
            {
                "item_key": f"product:{pid}",
                "item_type": "product",
                "bundle_id": None,
                "bundle_type": "",
                "product_id": pid,
                "product_ids": [pid],
                "name": item["name"],
                "summary": "",
                "image_url": item["image_url"],
                "price": float(item["price"]),
                "quantity": int(item["quantity"]),
                "detail_url": item["detail_url"],
            }
        )

    return grouped_rows + standalone_rows


def _cart_count(items):
    count = 0
    for item in items:
        if item.get("item_type") == "bundle":
            count += 1
        else:
            count += max(0, int(item.get("quantity", 0)))
    return count


def _wishlist_summary_for_user(user_id):
    product_rows = (
        WishlistItem.query.filter_by(user_id=user_id)
        .order_by(WishlistItem.added_at.desc(), WishlistItem.id.desc())
        .all()
    )
    setup_rows = (
        WishlistSetup.query.filter_by(user_id=user_id)
        .order_by(WishlistSetup.added_at.desc(), WishlistSetup.id.desc())
        .all()
    )

    summary_rows = []

    for row in product_rows:
        product = row.product
        if not product:
            continue
        summary_rows.append(
            {
                "added_at": row.added_at,
                "item_key": f"product:{product.id}",
                "item_type": "product",
                "setup_id": None,
                "product_id": product.id,
                "name": product.name,
                "image_url": _image_for_product(product),
                "price": float(product.price),
                "category": product.category,
                "description": product.description or "",
                "detail_url": url_for("product_detail", product_id=product.id),
            }
        )

    setup_product_ids = {}
    all_setup_product_ids = set()
    for row in setup_rows:
        product_ids = _parse_product_ids_payload(row.product_ids)
        if not product_ids:
            continue
        setup_product_ids[row.id] = product_ids
        all_setup_product_ids.update(product_ids)

    setup_products = Product.query.filter(Product.id.in_(list(all_setup_product_ids))).all() if all_setup_product_ids else []
    products_by_id = {product.id: product for product in setup_products}

    for row in setup_rows:
        product_ids = setup_product_ids.get(row.id, [])
        if not product_ids:
            continue

        ordered_products = [products_by_id[pid] for pid in product_ids if pid in products_by_id]
        if len(ordered_products) != len(product_ids):
            continue

        setup_type = (row.setup_type or "prebuild").strip() or "prebuild"
        profile_key = _photo_tag_slug((row.profile_key or "student").strip() or "student")
        setup_index = int(row.setup_index or 0)
        setup_name = (row.name or "Recommended Pre-Build").strip() or "Recommended Pre-Build"
        setup_summary = (row.summary or "").strip()
        preview = ", ".join(product.name for product in ordered_products[:3])
        total = sum(float(product.price) for product in ordered_products)

        detail_url = url_for("recommended_prebuilds", profession=profile_key)
        if setup_type == "prebuild":
            detail_url = url_for("recommended_prebuild_detail", profile_key=profile_key, setup_index=setup_index)

        stored_image = (row.image_url or "").strip()
        has_manual_image = _is_setup_image_url(stored_image) and not _is_auto_image_url(stored_image)
        image_url = stored_image if has_manual_image else _setup_image_url(
            setup_type,
            setup_name,
            product_ids,
            profile_key=profile_key,
            setup_index=setup_index,
        )

        summary_rows.append(
            {
                "added_at": row.added_at,
                "item_key": f"setup:{row.id}",
                "item_type": "setup",
                "setup_id": row.id,
                "product_id": None,
                "name": setup_name,
                "image_url": image_url,
                "price": total,
                "category": "Pre-Build Setup",
                "description": setup_summary or preview,
                "detail_url": detail_url,
            }
        )

    summary_rows.sort(
        key=lambda item: (
            item.get("added_at") or datetime.min,
            item.get("item_key") or "",
        ),
        reverse=True,
    )

    for item in summary_rows:
        item.pop("added_at", None)

    return summary_rows


def _wishlist_count_for_current_user():
    if not current_user.is_authenticated:
        return 0
    product_count = WishlistItem.query.filter_by(user_id=current_user.id).count()
    setup_count = WishlistSetup.query.filter_by(user_id=current_user.id).count()
    return int(product_count + setup_count)


def _parse_selected_product_ids(raw_ids):
    if not raw_ids:
        return []
    selected = []
    seen = set()
    for token in str(raw_ids).split(","):
        token = token.strip()
        if not token:
            continue
        try:
            product_id = int(token)
        except (TypeError, ValueError):
            continue
        if product_id <= 0 or product_id in seen:
            continue
        seen.add(product_id)
        selected.append(product_id)
    return selected


def _parse_product_ids_payload(raw_ids):
    if isinstance(raw_ids, list):
        csv_payload = ",".join(str(item) for item in raw_ids)
        return _parse_selected_product_ids(csv_payload)
    return _parse_selected_product_ids(raw_ids)


def _normalize_search_text(raw_text):
    normalized = re.sub(r"[^a-z0-9\s]+", " ", (raw_text or "").lower())
    return re.sub(r"\s+", " ", normalized).strip()


def _build_search_terms(raw_query):
    normalized_query = _normalize_search_text(raw_query)
    if not normalized_query:
        return "", [], []

    tokens = [token for token in normalized_query.split(" ") if token]
    expanded_terms = []
    seen = set()

    def add_term(term):
        normalized_term = _normalize_search_text(term)
        if normalized_term and normalized_term not in seen:
            seen.add(normalized_term)
            expanded_terms.append(normalized_term)

    def add_variants(token):
        add_term(token)
        if token.endswith("s") and len(token) > 3:
            add_term(token[:-1])
        if token.endswith("es") and len(token) > 4:
            add_term(token[:-2])
        if token.endswith("ies") and len(token) > 4:
            add_term(f"{token[:-3]}y")
        if token.endswith("er") and len(token) > 5:
            add_term(token[:-2])
        if token.endswith("ing") and len(token) > 6:
            add_term(token[:-3])

    add_term(normalized_query)

    for token in tokens:
        add_variants(token)
        for alias in SEARCH_TOKEN_ALIASES.get(token, []):
            add_term(alias)

        singular_token = token[:-1] if token.endswith("s") and len(token) > 3 else token
        for alias in SEARCH_TOKEN_ALIASES.get(singular_token, []):
            add_term(alias)

    for phrase, aliases in SEARCH_PHRASE_ALIASES.items():
        if phrase in normalized_query:
            add_term(phrase)
            for alias in aliases:
                add_term(alias)

    for term in list(expanded_terms):
        for alias in SEARCH_TOKEN_ALIASES.get(term, []):
            add_term(alias)

    return normalized_query, tokens, expanded_terms


def _product_search_blob(product, specs=None):
    specs = specs or _parse_specs(product)
    searchable_parts = [
        product.name or "",
        product.category or "",
        product.description or "",
        product.tags or "",
    ]
    for key, value in specs.items():
        searchable_parts.append(str(key))
        searchable_parts.append(str(value))
    return _normalize_search_text(" ".join(searchable_parts))


def _search_score_from_blob(search_blob, normalized_query, tokens, expanded_terms):
    if not normalized_query:
        return 0

    score = 0
    if normalized_query in search_blob:
        score += 12
    for token in tokens:
        if token in search_blob:
            score += 4
    for term in expanded_terms:
        if term in search_blob:
            score += 2
    return score


def _fuzzy_search_terms(tokens, search_blobs, cutoff=0.68):
    vocabulary = set()
    for blob in search_blobs:
        for word in blob.split(" "):
            if len(word) >= 3:
                vocabulary.add(word)

    if not vocabulary:
        return []

    fuzzy_terms = set()
    sorted_vocab = sorted(vocabulary)
    for token in tokens:
        if len(token) < 3:
            continue
        for matched in get_close_matches(token, sorted_vocab, n=6, cutoff=cutoff):
            fuzzy_terms.add(matched)
    return sorted(fuzzy_terms)


def _generate_order_number():
    return f"TPH{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}"


def _record_order(user_id, items, payment_mode, selected_address, source="cart"):
    if not items:
        return None

    address_text = ""
    if isinstance(selected_address, dict):
        address_text = selected_address.get("display") or selected_address.get("address") or ""
    elif selected_address:
        address_text = str(selected_address)

    order_number = _generate_order_number()
    while Order.query.filter_by(order_number=order_number).first() is not None:
        order_number = _generate_order_number()

    total_amount = sum(float(item.get("price", 0)) * int(item.get("quantity", 1)) for item in items)
    order = Order(
        user_id=user_id,
        order_number=order_number,
        total_amount=total_amount,
        payment_mode=payment_mode,
        delivery_address=address_text,
        source=source,
        status="placed",
    )
    db.session.add(order)
    db.session.flush()

    for item in items:
        product_id = int(item.get("product_id", 0)) if str(item.get("product_id", "")).isdigit() else None
        product_obj = db.session.get(Product, product_id) if product_id else None
        quantity = max(1, int(item.get("quantity", 1)))
        unit_price = float(item.get("price") or (product_obj.price if product_obj else 0))
        category = product_obj.category if product_obj else str(item.get("category") or "UNKNOWN")
        product_name = item.get("name") or (product_obj.name if product_obj else "Product")

        db.session.add(
            OrderItem(
                order_id=order.id,
                product_id=product_obj.id if product_obj else None,
                product_name=product_name,
                category=category,
                unit_price=unit_price,
                quantity=quantity,
            )
        )

    return order


def _custom_builder_catalog():
    category_cards = []
    for index, category_meta in enumerate(CUSTOM_PC_CATEGORY_FLOW, start=1):
        products = (
            Product.query.filter_by(category=category_meta["code"])
            .order_by(Product.stock.desc(), Product.price.asc(), Product.name.asc())
            .all()
        )

        product_cards = []
        for product in products:
            specs = _parse_specs(product)
            highlights = [
                str(specs.get("brand") or "").strip(),
                str(specs.get("size") or specs.get("capacity") or specs.get("vram") or "").strip(),
                str(specs.get("memory_type") or specs.get("type") or "").strip(),
            ]
            highlight_line = " | ".join(part for part in highlights if part)
            product_cards.append(
                {
                    "id": product.id,
                    "name": product.name,
                    "price": float(product.price),
                    "stock": int(product.stock),
                    "image_url": _image_for_product(product),
                    "description": product.description or "",
                    "highlight": highlight_line,
                    "specs": specs,
                    "brand": str(specs.get("brand") or "").strip(),
                    "size": str(specs.get("size") or specs.get("capacity") or specs.get("vram") or "").strip(),
                    "memory_type": str(specs.get("memory_type") or specs.get("type") or "").strip(),
                }
            )

        category_cards.append(
            {
                "index": index,
                "slug": category_meta["slug"],
                "code": category_meta["code"],
                "label": category_meta["label"],
                "products": product_cards,
            }
        )

    return category_cards


def _upsert_products_in_cart(selected_products):
    selected_ids = [product.id for product in selected_products]

    if current_user.is_authenticated:
        for product in selected_products:
            existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product.id).first()
            if existing:
                existing.quantity = 1
            else:
                db.session.add(CartItem(user_id=current_user.id, product_id=product.id, quantity=1))

        # Persist setup component updates immediately so grouped cart rendering sees them.
        db.session.commit()
    else:
        session_cart = _get_session_cart()
        product_to_entry = {int(entry.get("product_id", 0)): entry for entry in session_cart}
        for product in selected_products:
            entry = product_to_entry.get(product.id)
            if entry:
                entry["quantity"] = 1
            else:
                session_cart.append({"product_id": product.id, "quantity": 1})
        _set_session_cart(session_cart)

    return selected_ids


def _seed_products():
    catalog = {
        "CPU": [
            ("Intel Core i3-12100F", "Intel", 9499, 35, "", "", "4 cores, 8 threads for entry gaming"),
            ("Intel Core i5-13400F", "Intel", 18499, 28, "", "", "10 cores hybrid architecture"),
            ("Intel Core i5-14600K", "Intel", 29999, 23, "", "", "Strong mid-range gaming and creator CPU"),
            ("Intel Core i7-14700K", "Intel", 40999, 18, "", "", "20 cores for high-end workloads"),
            ("Intel Core i9-14900K", "Intel", 56999, 12, "", "", "Flagship Intel performance CPU"),
            ("AMD Ryzen 5 5600", "AMD", 11999, 42, "", "", "Zen 3 CPU for mainstream builds"),
            ("AMD Ryzen 5 7600", "AMD", 19999, 31, "", "", "AM5 processor with strong efficiency"),
            ("AMD Ryzen 7 7700", "AMD", 30999, 21, "", "", "8-core efficient CPU for daily productivity"),
            ("AMD Ryzen 7 7800X3D", "AMD", 37999, 17, "", "", "Best-in-class gaming cache CPU"),
            ("AMD Ryzen 9 7950X", "AMD", 52499, 11, "", "", "16-core creator and workstation CPU"),
        ],
        "GPU": [
            ("NVIDIA GeForce RTX 3050", "NVIDIA", 21999, 24, "8GB", "GDDR6X", "Ray tracing entry GPU"),
            ("NVIDIA GeForce RTX 3060 12GB", "NVIDIA", 27999, 17, "12GB", "GDDR6X", "Balanced GPU for 1080p and creator work"),
            ("NVIDIA GeForce RTX 4060", "NVIDIA", 29999, 21, "8GB", "GDDR6X", "Efficient 1080p gaming card"),
            ("NVIDIA GeForce RTX 4070 SUPER", "NVIDIA", 60999, 14, "12GB", "GDDR6X", "High FPS 1440p gaming"),
            ("NVIDIA GeForce RTX 4080 SUPER", "NVIDIA", 110999, 7, "16GB", "GDDR6X", "Top-tier 4K rendering GPU"),
            ("AMD Radeon RX 7600", "AMD", 25999, 19, "8GB", "GDDR6X", "Value-focused gaming GPU"),
            ("AMD Radeon RX 6750 XT", "AMD", 39999, 12, "12GB", "GDDR6X", "Great 1440p performance at value price"),
            ("AMD Radeon RX 7700 XT", "AMD", 43999, 13, "12GB", "GDDR6X", "Balanced 1440p card"),
            ("AMD Radeon RX 7800 XT", "AMD", 52999, 9, "16GB", "GDDR6X", "High VRAM creator/gaming GPU"),
            ("Intel Arc A770", "Intel", 33999, 10, "16GB", "GDDR6X", "Intel Xe card for creators"),
        ],
        "RAM": [
            ("Corsair Vengeance 8GB DDR4", "Corsair", 2299, 80, "8GB", "DDR4", "Budget desktop memory"),
            ("Crucial Pro 8GB DDR4", "Crucial", 1999, 66, "8GB", "DDR4", "Entry-level memory for office and students"),
            ("Corsair Vengeance 16GB DDR4", "Corsair", 4299, 72, "16GB", "DDR4", "Reliable dual-channel RAM"),
            ("Crucial Pro 16GB DDR5", "Crucial", 5499, 60, "16GB", "DDR5", "Stable DDR5 memory"),
            ("Acer Predator Vesta 16GB DDR5", "Acer", 5899, 38, "16GB", "DDR5", "Performance memory module"),
            ("Corsair Vengeance 32GB DDR5", "Corsair", 9999, 48, "32GB", "DDR5", "High-speed DDR5 kit"),
            ("Acer Predator Vesta 32GB DDR5", "Acer", 10999, 29, "32GB", "DDR5", "Creator-friendly high bandwidth RAM"),
            ("Adata XPG Lancer 32GB DDR5", "Adata", 10499, 34, "32GB", "DDR5", "Gaming DDR5 RGB memory"),
            ("Adata XPG 48GB DDR5", "Adata", 16999, 22, "48GB", "DDR5", "Heavy multitasking RAM kit"),
            ("EVM 8GB DDR4 3200MHz", "EVM", 1999, 95, "8GB", "DDR4", "Affordable daily-use RAM"),
        ],
        "MONITOR": [
            ("Asus TUF Gaming VG249Q", "Asus", 16999, 25, "", "", "24-inch FHD 144Hz IPS monitor"),
            ("Dell S2721DGF", "Dell", 28999, 18, "", "", "27-inch QHD 165Hz IPS monitor"),
            ("Benq MOBIUZ EX2710", "Benq", 23999, 16, "", "", "Gaming monitor with HDR support"),
            ("Cooler Master GM27-CFX", "Cooler Master", 26999, 9, "", "", "27-inch fast refresh panel"),
            ("AOC 24G2", "AOC", 14999, 30, "", "", "Popular esports monitor"),
            ("AOC Q27G3XMN", "AOC", 31999, 10, "", "", "QHD mini-LED panel for gaming and media"),
            ("Asus ProArt PA278QV", "Asus", 32999, 11, "", "", "Color accurate creator monitor"),
            ("Asus ROG Swift PG279QM", "Asus", 46999, 8, "", "", "Premium 240Hz monitor for competitive gaming"),
            ("Dell UltraSharp U2723QE", "Dell", 57999, 6, "", "", "4K office and creator monitor"),
            ("Benq GW2780", "Benq", 13999, 33, "", "", "Eye-care everyday monitor"),
        ],
        "KEYBOARD": [
            ("Logitech K380 Multi-Device", "Logitech", 2999, 41, "", "", "Compact Bluetooth keyboard"),
            ("Logitech G413 TKL SE", "Logitech", 5499, 28, "", "", "Mechanical gaming keyboard"),
            ("Logitech MX Keys S", "Logitech", 9999, 15, "", "", "Premium low-profile productivity keyboard"),
            ("Zebronics Max Pro", "Zebronics", 1699, 55, "", "", "Budget RGB keyboard"),
            ("Zebronics Zeb-Max Ninja 200", "Zebronics", 2199, 36, "", "", "Wireless mechanical-feel keyboard"),
            ("Lenovo 300 USB Keyboard", "Lenovo", 999, 63, "", "", "Daily office keyboard"),
            ("HP GK320", "HP", 2199, 44, "", "", "Backlit keyboard for gaming"),
            ("ProDot KB-207", "ProDot", 899, 70, "", "", "Compact affordable keyboard"),
            ("HP 150 Wired Keyboard", "HP", 1199, 51, "", "", "Full-size comfortable typing"),
            ("Lenovo Legion K500", "Lenovo", 4499, 19, "", "", "Mechanical keyboard for gamers"),
        ],
        "MOUSE": [
            ("Logitech G102 Lightsync", "Logitech", 1499, 64, "", "", "High DPI gaming mouse"),
            ("Logitech G Pro X Superlight", "Logitech", 10999, 9, "", "", "Ultra-light wireless esports mouse"),
            ("Logitech MX Master 3S", "Logitech", 8999, 14, "", "", "Premium productivity mouse"),
            ("Dell MS116", "Dell", 499, 120, "", "", "Reliable office wired mouse"),
            ("HP M100 Gaming Mouse", "HP", 899, 73, "", "", "Entry-level RGB gaming mouse"),
            ("HP Z3700 Wireless Mouse", "HP", 1499, 33, "", "", "Slim wireless mouse for office users"),
            ("Lenovo 400 Wireless Mouse", "Lenovo", 1299, 58, "", "", "Portable wireless mouse"),
            ("Dell Alienware AW610M", "Dell", 6499, 11, "", "", "Wireless gaming-grade mouse"),
            ("HP X200", "HP", 999, 45, "", "", "Ergonomic daily-use mouse"),
            ("Lenovo Legion M300", "Lenovo", 1799, 39, "", "", "Durable gaming mouse"),
        ],
        "STORAGE": [
            ("Acer FA100 256GB SSD", "Acer", 2299, 60, "256GB", "SSD", "Fast NVMe SSD for budget builds"),
            ("Acer FA100 512GB SSD", "Acer", 3499, 49, "512GB", "SSD", "Reliable everyday SSD"),
            ("Adata Legend 960 1TB SSD", "Adata", 6499, 37, "1TB", "SSD", "Gen4 NVMe high-speed SSD"),
            ("AddLink S70 1TB SSD", "AddLink", 6199, 29, "1TB", "SSD", "Performance-focused storage"),
            ("Corsair MP600 1TB SSD", "Corsair", 7799, 26, "1TB", "SSD", "High-endurance SSD for heavy write usage"),
            ("Asus ROG Strix 2TB SSD", "Asus", 13499, 17, "2TB", "SSD", "Premium gaming SSD"),
            ("Corsair MP600 2TB SSD", "Corsair", 13999, 16, "2TB", "SSD", "High endurance NVMe drive"),
            ("Adata HD330 2TB HDD", "Adata", 5199, 32, "2TB", "HDD", "External rugged HDD"),
            ("Adata 4TB HDD Archive", "Adata", 8499, 15, "4TB", "HDD", "Large capacity archival drive"),
            ("Asus TUF Gaming 4TB HDD", "Asus", 8999, 12, "4TB", "HDD", "Long-life hard drive for game libraries"),
        ],
        "MOTHERBOARD": [
            ("ASRock B650M Pro RS", "ASRock", 16999, 21, "", "", "AM5 board for Ryzen 7000"),
            ("Asus TUF B760-PLUS WiFi", "Asus", 21999, 16, "", "", "Intel 13th/14th gen motherboard"),
            ("GigaByte B650 AORUS Elite", "GigaByte", 22999, 14, "", "", "Feature-rich AM5 board"),
            ("MSI PRO B760M-A WiFi", "MSI", 16999, 19, "", "", "Stable micro-ATX Intel board"),
            ("ASRock B550M Steel Legend", "ASRock", 13499, 23, "", "", "AM4 value motherboard"),
            ("Asus Prime H610M-E", "Asus", 8499, 40, "", "", "Entry-level Intel board"),
            ("Asus Prime B650-PLUS", "Asus", 19999, 18, "", "", "Reliable AM5 board for long-term upgrades"),
            ("MSI PRO Z790-P WiFi", "MSI", 27999, 11, "", "", "High-speed board for Intel creator rigs"),
            ("GigaByte Z790 UD AX", "GigaByte", 28499, 9, "", "", "High-end Intel overclock board"),
            ("MSI MAG X670E Tomahawk", "MSI", 32999, 8, "", "", "Premium AM5 enthusiast board"),
        ],
        "PSU": [
            ("Seasonic Focus GX-650", "Seasonic", 7899, 33, "", "", "80+ Gold fully modular PSU"),
            ("Corsair RM750e", "Corsair", 9999, 28, "", "", "Silent 80+ Gold PSU"),
            ("Asus ROG Strix 850G", "Asus", 13999, 12, "", "", "High-end modular PSU"),
            ("MSI MPG A750GF", "MSI", 9199, 20, "", "", "Stable power for gaming PCs"),
            ("Cooler Master MWE 650 Bronze", "Cooler Master", 5899, 36, "", "", "Value 80+ Bronze PSU"),
            ("Seasonic S12III 550", "Seasonic", 4699, 39, "", "", "Efficient PSU for mainstream builds"),
            ("Corsair CX650", "Corsair", 6199, 31, "", "", "Reliable non-modular PSU"),
            ("Asus TUF Gaming 750W Bronze", "Asus", 7399, 22, "", "", "Durable PSU for gaming rigs"),
            ("Corsair RM1000e", "Corsair", 16999, 10, "", "", "ATX 3.0 ready PSU for flagship GPUs"),
            ("Seasonic Focus GX-850", "Seasonic", 12999, 14, "", "", "High efficiency PSU for creator workstations"),
        ],
    }

    existing_names = {name for (name,) in db.session.query(Product.name).all()}
    new_rows = []
    for category, entries in catalog.items():
        for model, brand, price, stock, size, memory_type, description in entries:
            if model in existing_names:
                continue
            specs = {"brand": brand}
            if size:
                specs["size"] = size
                if category == "GPU":
                    specs["vram"] = size
                if category == "STORAGE":
                    specs["capacity"] = size
            if memory_type:
                specs["memory_type"] = memory_type
                if category == "RAM":
                    specs["type"] = memory_type
            image = _model_image_url(model, category, brand)
            tags = f"{brand.lower()},{category.lower()},{(memory_type or '').lower()},{(size or '').lower()}"
            new_rows.append(
                Product(
                    name=model,
                    category=category,
                    description=description,
                    price=float(price),
                    stock=int(stock),
                    image_url=image,
                    tags=tags,
                    specs=json.dumps(specs),
                )
            )
    if new_rows:
        db.session.bulk_save_objects(new_rows)
        db.session.commit()


def _refresh_product_images():
    products = Product.query.order_by(Product.id.asc()).all()
    changed = False

    for product in products:
        current_image = (product.image_url or "").strip()
        specs = _parse_specs(product)
        brand = str(specs.get("brand") or "").strip()

        if _is_auto_image_url(current_image):
            refreshed_image = _product_image_url(product, brand)
        else:
            refreshed_image = current_image

        if refreshed_image != current_image:
            product.image_url = refreshed_image
            changed = True

    if changed:
        db.session.commit()


class SecureAdminIndexView(AdminIndexView):
    @expose("/")
    def index(self):
        if not self.is_accessible():
            return self.inaccessible_callback("index")

        stats = {
            "users": int(db.session.query(db.func.count(User.id)).scalar() or 0),
            "products": int(db.session.query(db.func.count(Product.id)).scalar() or 0),
            "orders": int(db.session.query(db.func.count(Order.id)).scalar() or 0),
            "service_requests": int(db.session.query(db.func.count(ServiceRequest.id)).scalar() or 0),
            "pending_services": int(
                db.session.query(db.func.count(ServiceRequest.id))
                .filter(ServiceRequest.status.in_(["pending", "in_progress"]))
                .scalar()
                or 0
            ),
            "wishlist_items": int((db.session.query(db.func.count(WishlistItem.id)).scalar() or 0) + (db.session.query(db.func.count(WishlistSetup.id)).scalar() or 0)),
            "cart_items": int(db.session.query(db.func.count(CartItem.id)).scalar() or 0),
            "inventory_units": int(db.session.query(db.func.sum(Product.stock)).scalar() or 0),
            "low_stock_count": int(
                db.session.query(db.func.count(Product.id))
                .filter(Product.stock <= 5)
                .scalar()
                or 0
            ),
            "inventory_value": float(db.session.query(db.func.sum(Product.price * Product.stock)).scalar() or 0.0),
        }

        category_breakdown = (
            db.session.query(
                Product.category.label("category"),
                db.func.count(Product.id).label("product_count"),
                db.func.sum(Product.stock).label("stock_units"),
            )
            .group_by(Product.category)
            .order_by(db.func.count(Product.id).desc(), Product.category.asc())
            .all()
        )

        low_stock_products = (
            Product.query.filter(Product.stock <= 5)
            .order_by(Product.stock.asc(), Product.name.asc())
            .limit(8)
            .all()
        )
        recent_orders = Order.query.order_by(Order.created_at.desc(), Order.id.desc()).limit(6).all()
        recent_services = (
            ServiceRequest.query.order_by(ServiceRequest.created_at.desc(), ServiceRequest.id.desc()).limit(6).all()
        )

        def _admin_url(endpoint_name):
            try:
                return url_for(endpoint_name)
            except Exception:
                return url_for("admin.index")

        quick_links = [
            {"label": "Products", "icon": "fa-cubes", "url": _admin_url("product.index_view")},
            {"label": "Orders", "icon": "fa-shopping-bag", "url": _admin_url("order.index_view")},
            {"label": "Service Requests", "icon": "fa-wrench", "url": _admin_url("servicerequest.index_view")},
            {"label": "Users", "icon": "fa-users", "url": _admin_url("user.index_view")},
            {"label": "Setup Images", "icon": "fa-picture-o", "url": _admin_url("setupimagerule.index_view")},
            {"label": "Storefront", "icon": "fa-external-link", "url": url_for("index")},
        ]

        return self.render(
            "admin/index.html",
            stats=stats,
            category_breakdown=category_breakdown,
            low_stock_products=low_stock_products,
            recent_orders=recent_orders,
            recent_services=recent_services,
            quick_links=quick_links,
        )

    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin

    def inaccessible_callback(self, name, **kwargs):
        flash("Admin access required.", "danger")
        return redirect(url_for("login_page", next=request.path))


class SecureModelView(ModelView):
    can_view_details = True
    page_size = 25

    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin

    def inaccessible_callback(self, name, **kwargs):
        flash("Admin access required.", "danger")
        return redirect(url_for("login_page", next=request.path))


def _product_image_preview(view, context, model, name):
    image_src = _image_for_product(model)
    stored_value = (model.image_url or "").strip() or "Auto internet fallback image"
    preview_markup = (
        '<div style="display:flex;align-items:center;gap:12px;min-width:260px;">'
        f'<img src="{escape(image_src)}" alt="{escape(model.name)}" '
        'style="width:58px;height:58px;object-fit:cover;border-radius:10px;border:1px solid #d1d5db;">'
        f'<span style="font-size:12px;line-height:1.4;">{escape(stored_value)}</span>'
        '</div>'
    )
    return Markup(preview_markup)


class ProductAdminView(SecureModelView):
    column_list = ("id", "name", "category", "price", "stock", "image_url")
    column_searchable_list = ("name", "category", "description", "tags", "image_url")
    column_filters = ("category",)
    form_columns = ("name", "description", "category", "price", "stock", "image_url", "specs", "tags")
    column_descriptions = {
        "image_url": "Paste your own image URL or a local static path like /static/item-images/rtx-4060.jpg. Leave it blank to use the built-in item artwork.",
    }
    form_args = {
        "image_url": {
            "label": "Image URL / Static Path",
            "description": "Examples: /static/item-images/my-gpu.jpg or https://example.com/my-gpu.png",
        }
    }
    form_widget_args = {
        "image_url": {
            "placeholder": "/static/item-images/my-item.jpg",
        }
    }
    column_formatters = {
        "image_url": _product_image_preview,
    }
    column_formatters_detail = {
        "image_url": _product_image_preview,
    }

def _setup_image_rule_preview(view, context, model, name):
    image_src = (model.image_url or "").strip() or pc_fallback_image_template("setup-rule", model.id)
    scope_parts = [f"type={model.setup_type}"]
    if model.profile_key:
        scope_parts.append(f"profile={model.profile_key}")
    if model.setup_index is not None:
        scope_parts.append(f"index={model.setup_index}")
    if model.setup_name:
        scope_parts.append(f"name={model.setup_name}")
    scope_label = " | ".join(scope_parts)
    preview_markup = (
        '<div style="display:flex;align-items:center;gap:12px;min-width:300px;">'
        f'<img src="{escape(image_src)}" alt="setup image" '
        'style="width:58px;height:58px;object-fit:cover;border-radius:10px;border:1px solid #d1d5db;">'
        f'<span style="font-size:12px;line-height:1.4;">{escape(scope_label)}</span>'
        '</div>'
    )
    return Markup(preview_markup)


class SetupImageRuleAdminView(SecureModelView):
    column_list = ("id", "setup_type", "profile_key", "setup_index", "setup_name", "image_url", "is_active", "updated_at")
    column_searchable_list = ("setup_type", "profile_key", "setup_name", "image_url")
    column_filters = ("setup_type", "is_active", "profile_key")
    form_columns = ("setup_type", "profile_key", "setup_index", "setup_name", "image_url", "is_active")
    form_choices = {
        "setup_type": [
            ("prebuild", "prebuild"),
            ("custom-build", "custom-build"),
            ("setup", "setup (fallback)"),
        ]
    }
    column_descriptions = {
        "setup_type": "prebuild for recommended builds, custom-build for custom builder, setup for generic fallback.",
        "profile_key": "Optional (example: student, gaming, developer, professional, content_creation).",
        "setup_index": "Optional setup card index for exact pre-build match (0, 1, 2...).",
        "setup_name": "Optional setup name for name-based matching (example: Student Essential).",
        "image_url": "Use /static/... or any http/https image URL.",
    }
    form_widget_args = {
        "image_url": {
            "placeholder": "/static/setup-images/student-essential.jpg",
        },
        "profile_key": {
            "placeholder": "student",
        },
        "setup_name": {
            "placeholder": "Student Essential",
        },
    }
    column_formatters = {
        "image_url": _setup_image_rule_preview,
    }
    column_formatters_detail = {
        "image_url": _setup_image_rule_preview,
    }

    def _sync_seeded_rules(self):
        if getattr(g, "_setup_image_rules_synced", False):
            return
        _sync_prebuild_setup_image_rules()
        g._setup_image_rules_synced = True

    def get_query(self):
        self._sync_seeded_rules()
        return super().get_query()

    def get_count_query(self):
        self._sync_seeded_rules()
        return super().get_count_query()

    def on_model_change(self, form, model, is_created):
        model.setup_type = _normalize_setup_type(model.setup_type)
        model.profile_key = _photo_tag_slug(model.profile_key) if model.profile_key else None
        model.setup_name = (model.setup_name or "").strip() or None
        model.image_url = (model.image_url or "").strip()
        if model.setup_index in ("", None):
            model.setup_index = None


admin = Admin(
    app,
    name="S. K. InfoCom Admin",
    index_view=SecureAdminIndexView(url="/admin"),
)
admin.add_view(SecureModelView(User, db.session))
admin.add_view(ProductAdminView(Product, db.session))
admin.add_view(SetupImageRuleAdminView(SetupImageRule, db.session, name="PC Setups"))
admin.add_view(SecureModelView(CartItem, db.session))
admin.add_view(SecureModelView(WishlistItem, db.session))
admin.add_view(SecureModelView(WishlistSetup, db.session, name="Wishlist Setups"))
admin.add_view(SecureModelView(UserAddress, db.session))
admin.add_view(SecureModelView(Order, db.session))
admin.add_view(SecureModelView(OrderItem, db.session))
admin.add_view(SecureModelView(ServiceRequest, db.session))


with app.app_context():
    db.create_all()
    _seed_products()
    _refresh_product_images()

    existing_usernames = {name for (name,) in db.session.query(User.username).all()}
    existing_emails = {email for (email,) in db.session.query(User.email).all()}

    if "demo" not in existing_usernames and "demo@example.com" not in existing_emails:
        demo_user = User(username="demo", email="demo@example.com", is_admin=False)
        demo_user.set_password("demo123")
        db.session.add(demo_user)

    if "admin" not in existing_usernames and "admin@techpro.local" not in existing_emails:
        admin_user = User(username="admin", email="admin@techpro.local", is_admin=True)
        admin_user.set_password("admin123")
        db.session.add(admin_user)

    db.session.commit()


class SmartConsultant:
    PROFILE_LABELS = {
        "student": "Student",
        "gaming": "Gaming",
        "developer": "Software Developer",
        "professional": "Professional Worker",
        "content_creation": "Content Creation",
    }

    PROFILE_KEYWORDS = {
        "student": ["student", "school", "college", "university", "learner", "study"],
        "gaming": ["gamer", "gaming", "esports", "streaming", "fps", "battle royale"],
        "developer": ["developer", "programmer", "coding", "software", "web", "app", "backend", "frontend"],
        "professional": ["professional", "office", "business", "corporate", "workstation", "productivity"],
        "content_creation": ["content", "creator", "editing", "video", "design", "creative", "animation"],
    }

    PROFILE_ALIASES = {
        "gaming": "gaming",
        "gamer": "gaming",
        "software developer": "developer",
        "developer": "developer",
        "programmer": "developer",
        "professional worker": "professional",
        "office work": "professional",
        "office": "professional",
        "content creation": "content_creation",
        "content creator": "content_creation",
        "editing": "content_creation",
        "student": "student",
    }

    PRODUCT_RECOMMENDATIONS = {
        "student": {
            "description": "Balanced and budget-conscious setup for learning and everyday tasks.",
            "priority": ["Affordable", "Easy to upgrade", "Reliable parts"],
            "setups": [
                {
                    "name": "Student Essential",
                    "summary": "Great for classes, coding basics, and media consumption.",
                    "components": {
                        "MONITOR": ["Benq GW2780", "AOC 24G2"],
                        "CPU": ["Intel Core i3-12100F", "AMD Ryzen 5 5600"],
                        "GPU": ["NVIDIA GeForce RTX 3050", "AMD Radeon RX 7600"],
                        "RAM": ["EVM 8GB DDR4 3200MHz", "Corsair Vengeance 16GB DDR4"],
                        "STORAGE": ["Acer FA100 512GB SSD", "Acer FA100 256GB SSD"],
                        "KEYBOARD": ["Lenovo 300 USB Keyboard", "ProDot KB-207"],
                        "MOUSE": ["Dell MS116", "Lenovo 400 Wireless Mouse"],
                    },
                },
                {
                    "name": "Student Plus",
                    "summary": "Extra performance headroom for projects and multitasking.",
                    "components": {
                        "MONITOR": ["AOC 24G2", "Asus TUF Gaming VG249Q"],
                        "CPU": ["Intel Core i5-13400F", "AMD Ryzen 5 7600"],
                        "GPU": ["NVIDIA GeForce RTX 4060", "Intel Arc A770"],
                        "RAM": ["Corsair Vengeance 16GB DDR4", "Crucial Pro 16GB DDR5"],
                        "STORAGE": ["Adata Legend 960 1TB SSD", "Corsair MP600 1TB SSD"],
                        "KEYBOARD": ["HP GK320", "Logitech K380 Multi-Device"],
                        "MOUSE": ["HP M100 Gaming Mouse", "Lenovo Legion M300"],
                    },
                },
            ],
        },
        "gaming": {
            "description": "High-FPS setups tuned for modern gaming workloads.",
            "priority": ["Strong GPU", "Fast RAM", "High refresh monitor"],
            "setups": [
                {
                    "name": "Competitive Gaming",
                    "summary": "Smooth 1440p gaming for esports and AAA titles.",
                    "components": {
                        "MONITOR": ["Dell S2721DGF", "Asus TUF Gaming VG249Q"],
                        "CPU": ["AMD Ryzen 7 7800X3D", "Intel Core i7-14700K"],
                        "GPU": ["NVIDIA GeForce RTX 4070 SUPER", "AMD Radeon RX 7800 XT"],
                        "RAM": ["Corsair Vengeance 32GB DDR5", "Acer Predator Vesta 32GB DDR5"],
                        "STORAGE": ["Corsair MP600 2TB SSD", "Adata Legend 960 1TB SSD"],
                        "KEYBOARD": ["Logitech G413 TKL SE", "Lenovo Legion K500"],
                        "MOUSE": ["Logitech G Pro X Superlight", "Logitech G102 Lightsync"],
                    },
                },
                {
                    "name": "Value Gaming",
                    "summary": "Excellent performance per rupee for mainstream players.",
                    "components": {
                        "MONITOR": ["AOC 24G2", "Benq MOBIUZ EX2710"],
                        "CPU": ["Intel Core i5-14600K", "AMD Ryzen 7 7700"],
                        "GPU": ["AMD Radeon RX 6750 XT", "NVIDIA GeForce RTX 3060 12GB"],
                        "RAM": ["Crucial Pro 16GB DDR5", "Corsair Vengeance 16GB DDR4"],
                        "STORAGE": ["Corsair MP600 1TB SSD", "Acer FA100 512GB SSD"],
                        "KEYBOARD": ["HP GK320", "Zebronics Max Pro"],
                        "MOUSE": ["Lenovo Legion M300", "HP M100 Gaming Mouse"],
                    },
                },
            ],
        },
        "developer": {
            "description": "Fast compile times, multitasking room, and comfortable viewing.",
            "priority": ["CPU performance", "RAM capacity", "Fast SSD"],
            "setups": [
                {
                    "name": "Developer Productivity",
                    "summary": "Ideal for coding, containers, and daily development tools.",
                    "components": {
                        "MONITOR": ["Dell UltraSharp U2723QE", "Benq GW2780"],
                        "CPU": ["AMD Ryzen 5 7600", "Intel Core i5-14600K"],
                        "GPU": ["Intel Arc A770", "NVIDIA GeForce RTX 4060"],
                        "RAM": ["Adata XPG Lancer 32GB DDR5", "Corsair Vengeance 32GB DDR5"],
                        "STORAGE": ["Adata Legend 960 1TB SSD", "Corsair MP600 1TB SSD"],
                        "KEYBOARD": ["Logitech MX Keys S", "Logitech K380 Multi-Device"],
                        "MOUSE": ["Logitech MX Master 3S", "HP Z3700 Wireless Mouse"],
                    },
                },
                {
                    "name": "Developer Pro",
                    "summary": "Extra compute for heavy local builds and virtualization.",
                    "components": {
                        "MONITOR": ["Asus ProArt PA278QV", "Dell S2721DGF"],
                        "CPU": ["Intel Core i7-14700K", "AMD Ryzen 9 7950X"],
                        "GPU": ["NVIDIA GeForce RTX 4070 SUPER", "AMD Radeon RX 7800 XT"],
                        "RAM": ["Adata XPG 48GB DDR5", "Acer Predator Vesta 32GB DDR5"],
                        "STORAGE": ["Corsair MP600 2TB SSD", "Asus ROG Strix 2TB SSD"],
                        "KEYBOARD": ["Logitech MX Keys S", "Lenovo Legion K500"],
                        "MOUSE": ["Logitech MX Master 3S", "Logitech G Pro X Superlight"],
                    },
                },
            ],
        },
        "professional": {
            "description": "Reliable office setups for multitasking, reports, and business applications.",
            "priority": ["Stability", "Comfort", "Low maintenance"],
            "setups": [
                {
                    "name": "Office Balanced",
                    "summary": "Responsive setup for spreadsheets, calls, and web apps.",
                    "components": {
                        "MONITOR": ["Benq GW2780", "Dell S2721DGF"],
                        "CPU": ["Intel Core i5-13400F", "AMD Ryzen 5 7600"],
                        "GPU": ["NVIDIA GeForce RTX 3050", "Intel Arc A770"],
                        "RAM": ["Corsair Vengeance 16GB DDR4", "Crucial Pro 16GB DDR5"],
                        "STORAGE": ["Acer FA100 512GB SSD", "Corsair MP600 1TB SSD"],
                        "KEYBOARD": ["Logitech K380 Multi-Device", "HP 150 Wired Keyboard"],
                        "MOUSE": ["HP Z3700 Wireless Mouse", "Dell MS116"],
                    },
                },
                {
                    "name": "Office Power User",
                    "summary": "Built for heavy multitasking, dashboards, and analytics tools.",
                    "components": {
                        "MONITOR": ["Dell UltraSharp U2723QE", "Asus ProArt PA278QV"],
                        "CPU": ["Intel Core i7-14700K", "AMD Ryzen 7 7700"],
                        "GPU": ["NVIDIA GeForce RTX 4060", "AMD Radeon RX 6750 XT"],
                        "RAM": ["Adata XPG Lancer 32GB DDR5", "Corsair Vengeance 32GB DDR5"],
                        "STORAGE": ["Corsair MP600 2TB SSD", "Asus ROG Strix 2TB SSD"],
                        "KEYBOARD": ["Logitech MX Keys S", "Lenovo 300 USB Keyboard"],
                        "MOUSE": ["Logitech MX Master 3S", "Lenovo 400 Wireless Mouse"],
                    },
                },
            ],
        },
        "content_creation": {
            "description": "Color-accurate and GPU-accelerated builds for editing workflows.",
            "priority": ["High VRAM", "Color accuracy", "Fast storage"],
            "setups": [
                {
                    "name": "Creator Studio",
                    "summary": "Strong platform for 4K editing and rendering timelines.",
                    "components": {
                        "MONITOR": ["Asus ProArt PA278QV", "Dell UltraSharp U2723QE"],
                        "CPU": ["AMD Ryzen 9 7950X", "Intel Core i9-14900K"],
                        "GPU": ["NVIDIA GeForce RTX 4080 SUPER", "AMD Radeon RX 7800 XT"],
                        "RAM": ["Adata XPG 48GB DDR5", "Corsair Vengeance 32GB DDR5"],
                        "STORAGE": ["Corsair MP600 2TB SSD", "Asus ROG Strix 2TB SSD"],
                        "KEYBOARD": ["Logitech MX Keys S", "Lenovo Legion K500"],
                        "MOUSE": ["Logitech MX Master 3S", "Logitech G Pro X Superlight"],
                    },
                },
                {
                    "name": "Creator Balanced",
                    "summary": "Balanced build for photo editing, animation, and streaming.",
                    "components": {
                        "MONITOR": ["AOC Q27G3XMN", "Dell S2721DGF"],
                        "CPU": ["Intel Core i7-14700K", "AMD Ryzen 7 7800X3D"],
                        "GPU": ["NVIDIA GeForce RTX 4070 SUPER", "AMD Radeon RX 7800 XT"],
                        "RAM": ["Acer Predator Vesta 32GB DDR5", "Adata XPG Lancer 32GB DDR5"],
                        "STORAGE": ["Adata Legend 960 1TB SSD", "Corsair MP600 1TB SSD"],
                        "KEYBOARD": ["Logitech G413 TKL SE", "Logitech MX Keys S"],
                        "MOUSE": ["Logitech G Pro X Superlight", "HP M100 Gaming Mouse"],
                    },
                },
            ],
        },
    }

    @staticmethod
    def resolve_profile_meta(user_input):
        normalized_input = _normalize_search_text(user_input)
        if not normalized_input:
            return {"profile_key": "student", "score": 0, "matched": False, "source": "empty"}

        alias_map = SmartConsultant.PROFILE_ALIASES
        for alias, profile_key in alias_map.items():
            if normalized_input == alias or alias in normalized_input:
                return {"profile_key": profile_key, "score": 100, "matched": True, "source": "alias"}

        best_profile = "student"
        best_score = 0
        for profile_key, keywords in SmartConsultant.PROFILE_KEYWORDS.items():
            score = 0
            for keyword in keywords:
                if keyword in normalized_input:
                    score += 2 if keyword == normalized_input else 1
            if score > best_score:
                best_profile = profile_key
                best_score = score

        if best_score > 0:
            return {
                "profile_key": best_profile,
                "score": best_score,
                "matched": True,
                "source": "keywords",
            }

        fuzzy_aliases = get_close_matches(normalized_input, sorted(alias_map.keys()), n=1, cutoff=0.72)
        if fuzzy_aliases:
            matched_alias = fuzzy_aliases[0]
            return {
                "profile_key": alias_map.get(matched_alias, "student"),
                "score": 1,
                "matched": True,
                "source": "fuzzy_alias",
            }

        token_alias = next((token for token in normalized_input.split(" ") if token in alias_map), None)
        if token_alias:
            return {
                "profile_key": alias_map[token_alias],
                "score": 1,
                "matched": True,
                "source": "token_alias",
            }

        return {"profile_key": "student", "score": 0, "matched": False, "source": "fallback"}

    @staticmethod
    def resolve_profile(user_input):
        profile_meta = SmartConsultant.resolve_profile_meta(user_input)
        return profile_meta.get("profile_key", "student")

    @staticmethod
    def get_recommendations(user_input):
        profile_meta = SmartConsultant.resolve_profile_meta(user_input)
        profile_key = profile_meta.get("profile_key", "student")
        recommendation = SmartConsultant.PRODUCT_RECOMMENDATIONS.get(
            profile_key,
            SmartConsultant.PRODUCT_RECOMMENDATIONS["student"],
        )
        recommendation_payload = json.loads(json.dumps(recommendation))
        recommendation_payload["profile_key"] = profile_key
        recommendation_payload["profile_label"] = SmartConsultant.PROFILE_LABELS.get(profile_key, profile_key.title())
        recommendation_payload["profile_score"] = profile_meta.get("score", 0)
        recommendation_payload["profile_matched"] = bool(profile_meta.get("matched", False))
        recommendation_payload["profile_source"] = profile_meta.get("source", "fallback")
        return recommendation_payload


def _build_recommendation_setups(recommendations, desired_count=7):
    inventory = Product.query.filter(Product.stock > 0).all()
    products_by_name = {product.name: product for product in inventory}
    products_by_category = defaultdict(list)

    for product in inventory:
        products_by_category[product.category].append(product)

    for category_code in products_by_category:
        products_by_category[category_code].sort(key=lambda product: (-product.stock, product.price, product.name))

    base_setups = recommendations.get("setups") or [{"name": "Recommended Setup", "summary": "", "components": {}}]
    target_count = max(desired_count, len(base_setups))

    def ordered_candidates(category_code, preferred_names):
        seen_ids = set()
        ordered = []

        for preferred_name in preferred_names:
            matched = products_by_name.get(preferred_name)
            if matched and matched.category == category_code and matched.id not in seen_ids:
                ordered.append(matched)
                seen_ids.add(matched.id)

        for product in products_by_category.get(category_code, []):
            if product.id in seen_ids:
                continue
            ordered.append(product)
            seen_ids.add(product.id)

        return ordered

    setup_cards = []
    seen_combinations = set()
    seed = 0
    safety_limit = max(20, target_count * 20)

    while len(setup_cards) < target_count and seed < safety_limit:
        template = base_setups[seed % len(base_setups)]
        setup_components = template.get("components", {})

        selected_components = []
        selected_ids = []
        total = 0.0

        for category_index, category_meta in enumerate(CUSTOM_PC_CATEGORY_FLOW):
            category_code = category_meta["code"]
            preferred_names = setup_components.get(category_code, [])
            if isinstance(preferred_names, str):
                preferred_names = [preferred_names]

            candidates = ordered_candidates(category_code, preferred_names)
            if not candidates:
                continue

            if seed < len(base_setups):
                selected_product = candidates[0]
            else:
                spread = min(len(candidates), 8)
                pick_index = (seed + (category_index * 2) + (seed // max(1, len(base_setups)))) % spread
                selected_product = candidates[pick_index]

            selected_ids.append(selected_product.id)
            total += float(selected_product.price)
            selected_components.append(
                {
                    "category_code": category_code,
                    "category_label": category_meta["label"],
                    "product_id": selected_product.id,
                    "product_name": selected_product.name,
                    "price": float(selected_product.price),
                    "image_url": _image_for_product(selected_product),
                    "description": selected_product.description or "",
                    "specs": _parse_specs(selected_product),
                }
            )

        if len(selected_components) != len(CUSTOM_PC_CATEGORY_FLOW):
            seed += 1
            continue

        combination_key = tuple(selected_ids)
        if combination_key in seen_combinations:
            seed += 1
            continue

        seen_combinations.add(combination_key)
        setup_index = len(setup_cards)
        template_name = template.get("name", "Recommended Setup")
        variant_count = max(1, setup_index - len(base_setups) + 2)
        setup_name = template_name if setup_index < len(base_setups) else f"{template_name} Variant {variant_count}"

        setup_cards.append(
            {
                "setup_index": setup_index,
                "setup_key": f"{recommendations.get('profile_key', 'student')}-{setup_index}",
                "name": setup_name,
                "summary": template.get("summary", ""),
                "components": selected_components,
                "total": total,
                "selected_product_ids": selected_ids,
                "image_url": _setup_image_url("prebuild", setup_name, selected_ids, profile_key=recommendations.get("profile_key"), setup_index=setup_index),
                "preview": ", ".join(component["product_name"] for component in selected_components[:3]),
            }
        )
        seed += 1

    return setup_cards


def _sync_prebuild_setup_image_rules():
    existing_rules = SetupImageRule.query.filter_by(setup_type="prebuild").all()
    existing_by_key = {}
    for rule in existing_rules:
        profile_slug = _photo_tag_slug(rule.profile_key)
        if profile_slug and isinstance(rule.setup_index, int):
            existing_by_key[(profile_slug, rule.setup_index)] = rule

    created = 0
    updated = 0

    for profile_key in HOME_PROFILE_ORDER:
        recommendations = SmartConsultant.get_recommendations(profile_key)
        normalized_profile = _photo_tag_slug(recommendations.get("profile_key") or profile_key)
        setup_cards = _build_recommendation_setups(recommendations)

        for setup in setup_cards:
            setup_index = setup.get("setup_index")
            if not isinstance(setup_index, int):
                continue

            setup_name = (setup.get("name") or "Recommended Setup").strip() or "Recommended Setup"
            setup_image = (setup.get("image_url") or "").strip()
            if not setup_image:
                setup_image = _setup_image_url(
                    "prebuild",
                    setup_name,
                    setup.get("selected_product_ids") or [],
                    profile_key=normalized_profile,
                    setup_index=setup_index,
                )

            key = (normalized_profile, setup_index)
            existing = existing_by_key.get(key)
            if existing:
                changed = False
                if (existing.setup_name or "").strip() != setup_name:
                    existing.setup_name = setup_name
                    changed = True
                if not (existing.image_url or "").strip() and setup_image:
                    existing.image_url = setup_image
                    changed = True
                if changed:
                    updated += 1
                continue

            if not _is_setup_image_url(setup_image):
                continue

            rule = SetupImageRule(
                setup_type="prebuild",
                profile_key=normalized_profile,
                setup_index=setup_index,
                setup_name=setup_name,
                image_url=setup_image,
                is_active=True,
            )
            db.session.add(rule)
            existing_by_key[key] = rule
            created += 1

    if created or updated:
        db.session.commit()

    return {"created": created, "updated": updated}

def _get_recommendation_setup(profile_key, setup_index):
    recommendations = SmartConsultant.get_recommendations(profile_key)
    setup_cards = _build_recommendation_setups(recommendations)
    if setup_index < 0 or setup_index >= len(setup_cards):
        return recommendations, setup_cards, None
    return recommendations, setup_cards, setup_cards[setup_index]

@app.route("/")
def login_page():
    next_url = _sanitize_next_url(request.args.get("next"))
    if current_user.is_authenticated:
        if next_url and next_url.startswith("/admin") and not current_user.is_admin:
            flash("Sign in with an admin account to access the admin panel.", "warning")
            return render_template("login.html", next_url=next_url)
        return redirect(url_for("index"))
    return render_template("login.html", next_url=next_url)


@app.route("/index")
def index():
    profile_cards = []
    for profile_key in HOME_PROFILE_ORDER:
        recommendations = SmartConsultant.get_recommendations(profile_key)
        setup_cards = _build_recommendation_setups(recommendations, desired_count=3)
        profile_cards.append(
            {
                "profile_key": recommendations.get("profile_key", profile_key),
                "profile_label": recommendations.get("profile_label", profile_key.title()),
                "description": recommendations.get("description", ""),
                "priority": recommendations.get("priority", [])[:3],
                "starting_price": min((setup.get("total", 0) for setup in setup_cards), default=0),
                "setups": [
                    {
                        "setup_index": setup.get("setup_index", 0),
                        "name": setup.get("name", "Recommended Setup"),
                        "summary": setup.get("summary", ""),
                        "total": setup.get("total", 0),
                    }
                    for setup in setup_cards[:3]
                ],
            }
        )

    profile_price_map = {
        str(card.get("profile_label", "")).strip(): float(card.get("starting_price", 0) or 0)
        for card in profile_cards
        if str(card.get("profile_label", "")).strip()
    }

    featured_products = (
        Product.query.filter(Product.stock > 0)
        .order_by(Product.stock.desc(), Product.price.asc(), Product.name.asc())
        .limit(8)
        .all()
    )
    featured_product_cards = []
    for product in featured_products:
        specs = _parse_specs(product)
        featured_product_cards.append(
            {
                "product": product,
                "brand": str(specs.get("brand") or "").strip(),
                "size": str(specs.get("size") or specs.get("capacity") or specs.get("vram") or "").strip(),
                "memory_type": str(specs.get("memory_type") or specs.get("type") or "").strip(),
            }
        )

    category_count_rows = (
        db.session.query(Product.category, db.func.count(Product.id))
        .filter(Product.stock > 0)
        .group_by(Product.category)
        .all()
    )
    category_counts = {category: int(count) for category, count in category_count_rows}
    category_overview = [
        {
            "slug": category_meta["slug"],
            "label": category_meta["label"],
            "count": category_counts.get(category_meta["code"], 0),
        }
        for category_meta in CATEGORY_OPTIONS
    ]

    in_stock_items = db.session.query(db.func.sum(Product.stock)).filter(Product.stock > 0).scalar() or 0
    minimum_price = db.session.query(db.func.min(Product.price)).filter(Product.stock > 0).scalar() or 0
    home_stats = {
        "in_stock_items": int(in_stock_items),
        "active_categories": sum(1 for category in category_overview if category["count"] > 0),
        "starting_price": float(minimum_price),
        "recommended_setups": sum(len(card.get("setups", [])) for card in profile_cards),
    }

    return render_template(
        "index.html",
        home_profile_cards=profile_cards,
        featured_product_cards=featured_product_cards,
        category_overview=category_overview,
        home_stats=home_stats,
        profile_price_map=profile_price_map,
        category_count_by_slug={item["slug"]: item["count"] for item in category_overview},
    )

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    next_url = _sanitize_next_url(request.form.get("next") or request.args.get("next"))

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        merge_session_cart_into_user(user)
        flash("Logged in successfully.", "success")
        return redirect(next_url or url_for("index"))

    flash("Invalid username or password.", "danger")
    if next_url:
        return redirect(url_for("login_page", next=next_url))
    return redirect(url_for("login_page"))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")

    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    confirm = request.form.get("confirm_password")

    if not username or not email or not password:
        flash("All fields are required.", "danger")
        return redirect(url_for("register"))
    if password != confirm:
        flash("Passwords do not match.", "danger")
        return redirect(url_for("register"))
    if User.query.filter_by(username=username).first():
        flash("Username already exists.", "danger")
        return redirect(url_for("register"))
    if User.query.filter_by(email=email).first():
        flash("Email already registered.", "danger")
        return redirect(url_for("register"))

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    flash("Registration successful! Please log in.", "success")
    return redirect(url_for("login_page"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    session.pop("cart", None)
    session.pop("cart_groups", None)
    session.pop("selected_cart_product_ids", None)
    session.pop("selected_address_id", None)
    session.pop("checkout_source", None)
    flash("You have been logged out.", "info")
    return redirect(url_for("login_page"))


@app.route("/profile")
@login_required
def profile():
    service_requests = ServiceRequest.query.filter_by(user_id=current_user.id).order_by(ServiceRequest.created_at.desc()).all()
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()

    return render_template(
        "profile.html",
        service_requests=service_requests,
        orders=orders,
    )


@app.route("/profile/orders/<int:order_id>")
@login_required
def profile_order_detail(order_id):
    order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
    if not order:
        flash("Order not found.", "warning")
        return redirect(url_for("profile"))

    return render_template("order_detail.html", order=order, order_items=order.items)


@app.route("/api/cart", methods=["GET"])
def api_cart_list():
    items = _cart_summary_for_current_user()
    return jsonify({"items": items, "count": _cart_count(items)})


@app.route("/api/cart/count", methods=["GET"])
def api_cart_count():
    items = _cart_summary_for_current_user()
    return jsonify({"count": _cart_count(items)})


@app.route("/api/cart/add", methods=["POST"])
def api_cart_add():
    data = request.get_json(silent=True) or request.form
    product_id = data.get("product_id") if data else None
    quantity = data.get("quantity", 1) if data else 1

    try:
        product_id = int(product_id)
        quantity = max(1, int(quantity))
    except Exception:
        return jsonify({"error": "Invalid product or quantity"}), 400

    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    group = _find_cart_group_by_product(product_id)
    if group:
        return jsonify({"error": "This component belongs to a PC setup. Edit that setup from cart details."}), 400

    if current_user.is_authenticated:
        existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
        if existing:
            existing.quantity += quantity
        else:
            db.session.add(CartItem(user_id=current_user.id, product_id=product_id, quantity=quantity))
        db.session.commit()
    else:
        session_cart = _get_session_cart()
        matched = False
        for entry in session_cart:
            if int(entry.get("product_id", 0)) == product_id:
                entry["quantity"] = max(1, int(entry.get("quantity", 1)) + quantity)
                matched = True
                break
        if not matched:
            session_cart.append({"product_id": product_id, "quantity": quantity})
        _set_session_cart(session_cart)

    items = _cart_summary_for_current_user()
    return jsonify({"message": "Added to cart.", "count": _cart_count(items)})


@app.route("/api/cart/update", methods=["POST"])
def api_cart_update():
    data = request.get_json(silent=True) or request.form
    product_id = data.get("product_id") if data else None
    quantity = data.get("quantity") if data else None

    try:
        product_id = int(product_id)
        quantity = int(quantity)
    except Exception:
        return jsonify({"error": "Invalid product or quantity"}), 400

    group = _find_cart_group_by_product(product_id)
    if group:
        return jsonify({"error": "This component is part of a PC setup. Open setup details to edit it."}), 400

    if current_user.is_authenticated:
        existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
        if not existing:
            return jsonify({"error": "Item not found in cart"}), 404
        if quantity <= 0:
            db.session.delete(existing)
        else:
            existing.quantity = max(1, quantity)
        db.session.commit()
    else:
        session_cart = _get_session_cart()
        updated = []
        found = False
        for entry in session_cart:
            try:
                pid = int(entry.get("product_id", 0))
            except Exception:
                continue
            if pid != product_id:
                updated.append(entry)
                continue
            found = True
            if quantity > 0:
                updated.append({"product_id": product_id, "quantity": max(1, quantity)})
        if not found:
            return jsonify({"error": "Item not found in cart"}), 404
        _set_session_cart(updated)

    _cleanup_cart_groups()
    items = _cart_summary_for_current_user()
    return jsonify({"message": "Cart updated.", "count": _cart_count(items)})


@app.route("/api/cart/remove-selected", methods=["POST"])
def api_cart_remove_selected():
    data = request.get_json(silent=True) or request.form
    selected_ids = _parse_product_ids_payload(data.get("product_ids") if data else None)
    if not selected_ids:
        return jsonify({"error": "No items selected."}), 400

    removed = _remove_products_from_cart(selected_ids)
    if current_user.is_authenticated:
        db.session.commit()
    items = _cart_summary_for_current_user()
    return jsonify({"message": f"Removed {removed} item(s).", "count": _cart_count(items)})


@app.route("/api/cart/clear", methods=["POST"])
def api_cart_clear():
    if current_user.is_authenticated:
        CartItem.query.filter_by(user_id=current_user.id).delete(synchronize_session=False)
        db.session.commit()
    else:
        _set_session_cart([])

    _set_session_cart_groups([])
    session.pop("selected_cart_product_ids", None)
    session.pop("checkout_source", None)
    session.modified = True
    return jsonify({"message": "Cart cleared.", "count": 0})


@app.route("/wishlist")
@login_required
def wishlist_page():
    items = _wishlist_summary_for_user(current_user.id)
    return render_template("wishlist.html", items=items)


@app.route("/api/wishlist/count", methods=["GET"])
def api_wishlist_count():
    return jsonify({"count": _wishlist_count_for_current_user()})


@app.route("/api/wishlist/add", methods=["POST"])
def api_wishlist_add():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    try:
        product_id = int((data or {}).get("product_id"))
    except Exception:
        return jsonify({"error": "Invalid product."}), 400

    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404

    existing = WishlistItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if existing:
        return jsonify({"message": "Item already in wishlist.", "count": _wishlist_count_for_current_user()})

    db.session.add(WishlistItem(user_id=current_user.id, product_id=product_id))
    db.session.commit()
    return jsonify({"message": "Added to wishlist.", "count": _wishlist_count_for_current_user()})


@app.route("/api/wishlist/add-prebuild", methods=["POST"])
def api_wishlist_add_prebuild():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    profile_key = _photo_tag_slug((data or {}).get("profile_key") or "student")
    if not profile_key:
        profile_key = "student"

    try:
        setup_index = int((data or {}).get("setup_index"))
    except Exception:
        return jsonify({"error": "Invalid setup."}), 400

    recommendations, _, selected_setup = _get_recommendation_setup(profile_key, setup_index)
    if not selected_setup:
        return jsonify({"error": "Pre-build setup not found."}), 404

    resolved_profile = _photo_tag_slug(recommendations.get("profile_key") or profile_key) or "student"
    resolved_index = int(selected_setup.get("setup_index", setup_index) or 0)
    selected_product_ids = _parse_product_ids_payload(selected_setup.get("selected_product_ids"))

    if not selected_product_ids:
        return jsonify({"error": "Selected setup has no components."}), 400

    existing = WishlistSetup.query.filter_by(
        user_id=current_user.id,
        setup_type="prebuild",
        profile_key=resolved_profile,
        setup_index=resolved_index,
    ).first()
    if existing:
        return jsonify({"message": "Pre-build already in wishlist.", "count": _wishlist_count_for_current_user()})

    setup_name = (selected_setup.get("name") or "Recommended Pre-Build").strip() or "Recommended Pre-Build"
    setup_summary = (selected_setup.get("summary") or "").strip()
    setup_image = (selected_setup.get("image_url") or "").strip() or _setup_image_url(
        "prebuild",
        setup_name,
        selected_product_ids,
        profile_key=resolved_profile,
        setup_index=resolved_index,
    )

    db.session.add(
        WishlistSetup(
            user_id=current_user.id,
            setup_type="prebuild",
            profile_key=resolved_profile,
            setup_index=resolved_index,
            name=setup_name,
            summary=setup_summary,
            image_url=setup_image,
            product_ids=",".join(str(pid) for pid in selected_product_ids),
        )
    )
    db.session.commit()
    return jsonify({"message": "Pre-build added to wishlist.", "count": _wishlist_count_for_current_user()})


@app.route("/api/wishlist/remove", methods=["POST"])
def api_wishlist_remove():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    setup_id = (data or {}).get("setup_id")
    product_id = (data or {}).get("product_id")

    if setup_id not in (None, ""):
        try:
            setup_id = int(setup_id)
        except Exception:
            return jsonify({"error": "Invalid setup."}), 400

        WishlistSetup.query.filter_by(user_id=current_user.id, id=setup_id).delete(synchronize_session=False)
        db.session.commit()
        return jsonify({"message": "Removed from wishlist.", "count": _wishlist_count_for_current_user()})

    try:
        product_id = int(product_id)
    except Exception:
        return jsonify({"error": "Invalid product."}), 400

    WishlistItem.query.filter_by(user_id=current_user.id, product_id=product_id).delete(synchronize_session=False)
    db.session.commit()
    return jsonify({"message": "Removed from wishlist.", "count": _wishlist_count_for_current_user()})


@app.route("/api/wishlist/remove-selected", methods=["POST"])
def api_wishlist_remove_selected():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    selected_product_ids = _parse_product_ids_payload((data or {}).get("product_ids"))
    selected_setup_ids = _parse_product_ids_payload((data or {}).get("setup_ids"))

    if not selected_product_ids and not selected_setup_ids:
        return jsonify({"error": "No items selected."}), 400

    if selected_product_ids:
        WishlistItem.query.filter(
            WishlistItem.user_id == current_user.id,
            WishlistItem.product_id.in_(selected_product_ids),
        ).delete(synchronize_session=False)

    if selected_setup_ids:
        WishlistSetup.query.filter(
            WishlistSetup.user_id == current_user.id,
            WishlistSetup.id.in_(selected_setup_ids),
        ).delete(synchronize_session=False)

    db.session.commit()
    return jsonify({"message": "Selected wishlist items removed.", "count": _wishlist_count_for_current_user()})


@app.route("/api/wishlist/clear", methods=["POST"])
def api_wishlist_clear():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    WishlistItem.query.filter_by(user_id=current_user.id).delete(synchronize_session=False)
    WishlistSetup.query.filter_by(user_id=current_user.id).delete(synchronize_session=False)
    db.session.commit()
    return jsonify({"message": "Wishlist cleared.", "count": 0})


@app.route("/api/wishlist/move-to-cart", methods=["POST"])
def api_wishlist_move_to_cart():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    setup_id = (data or {}).get("setup_id")
    if setup_id not in (None, ""):
        try:
            setup_id = int(setup_id)
        except Exception:
            return jsonify({"error": "Invalid setup."}), 400

        wishlist_setup = WishlistSetup.query.filter_by(user_id=current_user.id, id=setup_id).first()
        if not wishlist_setup:
            return jsonify({"error": "Wishlist setup not found."}), 404

        product_ids = _parse_product_ids_payload(wishlist_setup.product_ids)
        if not product_ids:
            return jsonify({"error": "Saved setup has no components."}), 400

        products = Product.query.filter(Product.id.in_(product_ids)).all()
        product_map = {product.id: product for product in products}
        ordered_products = [product_map[pid] for pid in product_ids if pid in product_map]
        if len(ordered_products) != len(product_ids):
            return jsonify({"error": "Some setup components are unavailable."}), 400

        ordered_ids = _upsert_products_in_cart(ordered_products)
        setup_type = (wishlist_setup.setup_type or "prebuild").strip() or "prebuild"
        group_type = "prebuild_pc" if setup_type == "prebuild" else "custom_pc"

        _save_cart_group(
            group_type=group_type,
            name=(wishlist_setup.name or "Saved PC Setup").strip() or "Saved PC Setup",
            summary=(wishlist_setup.summary or "").strip(),
            product_ids=ordered_ids,
            image_url=(wishlist_setup.image_url or "").strip(),
            profile_key=(wishlist_setup.profile_key or "").strip(),
            setup_index=wishlist_setup.setup_index,
        )

        db.session.delete(wishlist_setup)
        db.session.commit()
        return jsonify(
            {
                "message": "Pre-build moved to cart.",
                "cart_count": _cart_count(_cart_summary_for_current_user()),
                "wishlist_count": _wishlist_count_for_current_user(),
            }
        )

    try:
        product_id = int((data or {}).get("product_id"))
    except Exception:
        return jsonify({"error": "Invalid product."}), 400

    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404

    group = _find_cart_group_by_product(product_id)
    if group:
        return jsonify({"error": "This component belongs to a PC setup in cart. Edit that setup first."}), 400

    wishlist_item = WishlistItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if wishlist_item:
        db.session.delete(wishlist_item)

    existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if existing:
        existing.quantity += 1
    else:
        db.session.add(CartItem(user_id=current_user.id, product_id=product_id, quantity=1))

    db.session.commit()
    return jsonify(
        {
            "message": "Item moved to cart.",
            "cart_count": _cart_count(_cart_summary_for_current_user()),
            "wishlist_count": _wishlist_count_for_current_user(),
        }
    )


@app.route("/api/cart/move-to-wishlist", methods=["POST"])
def api_cart_move_to_wishlist():
    data = request.get_json(silent=True) or request.form
    next_path = _sanitize_next_url((data or {}).get("next") or request.referrer or url_for("index"))

    if not current_user.is_authenticated:
        return jsonify({"error": "Login required", "login_url": url_for("login_page", next=next_path)}), 401

    try:
        product_id = int((data or {}).get("product_id"))
    except Exception:
        return jsonify({"error": "Invalid product."}), 400

    group = _find_cart_group_by_product(product_id)
    if group:
        return jsonify({"error": "This component belongs to a saved PC setup. Open setup details to edit."}), 400

    existing_wishlist = WishlistItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if not existing_wishlist:
        db.session.add(WishlistItem(user_id=current_user.id, product_id=product_id))

    CartItem.query.filter_by(user_id=current_user.id, product_id=product_id).delete(synchronize_session=False)
    db.session.commit()
    return jsonify({"message": "Item moved to wishlist.", "wishlist_count": _wishlist_count_for_current_user()})


@app.route("/cart/setup/<group_id>")
def cart_bundle_detail(group_id):
    group = _find_cart_group(group_id)
    if not group:
        flash("The requested setup was not found in your cart.", "warning")
        return redirect(url_for("cart_page"))

    products = Product.query.filter(Product.id.in_(group.get("product_ids", []))).all()
    products_by_id = {product.id: product for product in products}

    components = []
    total = 0.0
    for product_id in group.get("product_ids", []):
        product = products_by_id.get(product_id)
        if not product:
            continue
        price = float(product.price)
        total += price
        components.append(
            {
                "product_id": product.id,
                "name": product.name,
                "category": product.category,
                "price": price,
                "image_url": _image_for_product(product),
                "description": product.description or "",
                "specs": _parse_specs(product),
            }
        )

    if not components:
        _delete_cart_group(group.get("id"))
        flash("The setup items are no longer available in cart.", "warning")
        return redirect(url_for("cart_page"))

    edit_url = url_for("custom_pc_builder", edit_group_id=group.get("id"))
    if group.get("type") == "prebuild_pc":
        setup_index = group.get("setup_index")
        profile_key = group.get("profile_key") or "student"
        if isinstance(setup_index, int) and setup_index >= 0:
            edit_url = url_for("recommended_prebuild_detail", profile_key=profile_key, setup_index=setup_index)

    return render_template(
        "cart_setup_detail.html",
        group=group,
        components=components,
        total=total,
        edit_url=edit_url,
    )


@app.route("/cart")
def cart_page():
    items = _cart_summary_for_current_user()
    selected_ids = set(_parse_product_ids_payload(session.get("selected_cart_product_ids") or []))

    if not selected_ids and items:
        for item in items:
            for product_id in item.get("product_ids", []):
                selected_ids.add(int(product_id))

    for item in items:
        item_ids = {int(pid) for pid in item.get("product_ids", [])}
        item["is_selected"] = bool(item_ids.intersection(selected_ids))

    total = 0.0
    for item in items:
        if item.get("is_selected"):
            total += float(item.get("price", 0)) * max(1, int(item.get("quantity", 1)))

    addresses = []
    selected_address_id = None
    if current_user.is_authenticated:
        addresses = _get_user_addresses_for_display(current_user.id)
        if addresses:
            selected_address_id = session.get("selected_address_id")
            valid_ids = {addr["id"] for addr in addresses}
            if selected_address_id not in valid_ids:
                default_addr = next((addr for addr in addresses if addr.get("is_default")), None)
                selected_address_id = default_addr["id"] if default_addr else addresses[0]["id"]
                session["selected_address_id"] = selected_address_id

    all_selected = bool(items) and all(item.get("is_selected") for item in items)
    return render_template(
        "cart.html",
        items=items,
        total=total,
        addresses=addresses,
        selected_address_id=selected_address_id,
        all_selected=all_selected,
    )


@app.route("/addresses/add", methods=["POST"])
@login_required
def add_address():
    next_url = _sanitize_next_url(request.form.get("next") or request.referrer or url_for("cart_page"))

    full_name = " ".join((request.form.get("full_name") or "").split())
    mobile = _normalize_phone(request.form.get("mobile"))
    address_text = _normalize_address(request.form.get("address"))
    is_default = request.form.get("is_default") == "on"

    if not full_name or not mobile or not address_text:
        flash("Please fill all required address fields.", "warning")
        return redirect(next_url)

    payload = {
        "full_name": full_name,
        "mobile": mobile,
        "address": address_text,
        "country": "India",
        "is_default": is_default,
    }

    if is_default:
        for existing in UserAddress.query.filter_by(user_id=current_user.id).all():
            existing_payload = _address_payload_from_record(existing)
            existing_payload["is_default"] = False
            existing.full_address = _address_payload_to_storage(existing_payload)

    elif not UserAddress.query.filter_by(user_id=current_user.id).first():
        payload["is_default"] = True

    db.session.add(UserAddress(user_id=current_user.id, full_address=_address_payload_to_storage(payload)))
    db.session.commit()

    flash("Address saved.", "success")
    return redirect(next_url)


@app.route("/addresses/<int:address_id>/update", methods=["POST"])
@login_required
def update_address(address_id):
    next_url = _sanitize_next_url(request.form.get("next") or request.referrer or url_for("cart_page"))

    address = UserAddress.query.filter_by(id=address_id, user_id=current_user.id).first()
    if not address:
        flash("Address not found.", "warning")
        return redirect(next_url)

    full_name = " ".join((request.form.get("full_name") or "").split())
    mobile = _normalize_phone(request.form.get("mobile"))
    address_text = _normalize_address(request.form.get("address"))
    is_default = request.form.get("is_default") == "on"

    if not full_name or not mobile or not address_text:
        flash("Please fill all required address fields.", "warning")
        return redirect(next_url)

    payload = _address_payload_from_record(address)
    payload.update(
        {
            "full_name": full_name,
            "mobile": mobile,
            "address": address_text,
            "country": payload.get("country") or "India",
            "is_default": is_default,
        }
    )

    if is_default:
        for existing in UserAddress.query.filter_by(user_id=current_user.id).all():
            if existing.id == address.id:
                continue
            existing_payload = _address_payload_from_record(existing)
            existing_payload["is_default"] = False
            existing.full_address = _address_payload_to_storage(existing_payload)

    address.full_address = _address_payload_to_storage(payload)
    db.session.commit()

    flash("Address updated.", "success")
    return redirect(next_url)


@app.route("/addresses/<int:address_id>/delete", methods=["POST"])
@login_required
def delete_address(address_id):
    next_url = _sanitize_next_url(request.form.get("next") or request.referrer or url_for("cart_page"))

    address = UserAddress.query.filter_by(id=address_id, user_id=current_user.id).first()
    if not address:
        flash("Address not found.", "warning")
        return redirect(next_url)

    was_default = _address_payload_from_record(address).get("is_default")
    db.session.delete(address)
    db.session.commit()

    if was_default:
        remaining = UserAddress.query.filter_by(user_id=current_user.id).order_by(UserAddress.updated_at.desc()).all()
        if remaining:
            payload = _address_payload_from_record(remaining[0])
            payload["is_default"] = True
            remaining[0].full_address = _address_payload_to_storage(payload)
            db.session.commit()

    if session.get("selected_address_id") == address_id:
        session.pop("selected_address_id", None)

    flash("Address deleted successfully.", "success")
    return redirect(next_url)


@app.route("/proceed-payment", methods=["POST"])
@login_required
def proceed_payment():
    selected_ids = _parse_selected_product_ids(request.form.get("selected_product_ids"))
    cart_product_ids = {item.product_id for item in CartItem.query.filter_by(user_id=current_user.id).all()}
    selected_ids = [pid for pid in selected_ids if pid in cart_product_ids]
    if not selected_ids:
        flash("Please select at least one cart item to continue.", "warning")
        return redirect(url_for("cart_page"))
    session["selected_cart_product_ids"] = selected_ids
    session["checkout_source"] = "cart"

    address_id = request.form.get("address_id", type=int)
    if address_id:
        selected = UserAddress.query.filter_by(id=address_id, user_id=current_user.id).first()
        if selected:
            session["selected_address_id"] = selected.id
        else:
            session.pop("selected_address_id", None)
            flash("Please choose a valid saved address.", "warning")
            return redirect(url_for("cart_page"))
    else:
        session.pop("selected_address_id", None)
        flash("Please choose an address before payment.", "warning")
        return redirect(url_for("cart_page"))
    return redirect(url_for("payment_page"))


@app.route("/payment", methods=["GET", "POST"])
@login_required
def payment_page():
    cart_rows = CartItem.query.filter_by(user_id=current_user.id).all()
    all_items = []
    for row in cart_rows:
        if not row.product:
            continue
        all_items.append(
            {
                "product_id": row.product_id,
                "name": row.product.name,
                "image_url": _image_for_product(row.product),
                "price": float(row.product.price),
                "quantity": int(row.quantity),
                "category": row.product.category,
            }
        )

    if not all_items:
        flash("Your cart is empty.", "warning")
        return redirect(url_for("cart_page"))

    selected_ids = session.get("selected_cart_product_ids") or []
    selected_ids = [int(pid) for pid in selected_ids if str(pid).isdigit()]
    selected_set = set(selected_ids)
    if not selected_set:
        flash("Please select cart items before proceeding to payment.", "warning")
        return redirect(url_for("cart_page"))

    items = [item for item in all_items if item["product_id"] in selected_set]
    if not items:
        session.pop("selected_cart_product_ids", None)
        flash("Selected items are no longer available in your cart.", "warning")
        return redirect(url_for("cart_page"))

    selected_items_by_id = {item["product_id"]: item for item in items}
    grouped_selected_ids = set()
    display_items = []

    for group in _cleanup_cart_groups(set(selected_items_by_id.keys())):
        group_ids = set(group.get("product_ids", []))
        if not group_ids or not group_ids.issubset(selected_set):
            continue

        grouped_rows = [selected_items_by_id.get(pid) for pid in group.get("product_ids", []) if selected_items_by_id.get(pid)]
        if not grouped_rows:
            continue

        grouped_selected_ids.update(group_ids)
        display_items.append(
            {
                "name": group.get("name") or "PC Setup",
                "quantity": 1,
                "price": sum(row["price"] * row["quantity"] for row in grouped_rows),
                "is_bundle": True,
            }
        )

    for item in items:
        if item["product_id"] in grouped_selected_ids:
            continue
        display_items.append(
            {
                "name": item["name"],
                "quantity": item["quantity"],
                "price": item["price"],
                "is_bundle": False,
            }
        )

    total = sum(item["price"] * item["quantity"] for item in items)
    selected_address_id = session.get("selected_address_id")
    selected_address = None
    if selected_address_id:
        addr_obj = UserAddress.query.filter_by(id=selected_address_id, user_id=current_user.id).first()
        if addr_obj:
            payload = _address_payload_from_record(addr_obj)
            selected_address = {
                "id": addr_obj.id,
                "full_name": payload.get("full_name", ""),
                "mobile": payload.get("mobile", ""),
                "address": payload.get("address", ""),
                "display": _address_display(payload),
            }

    if request.method == "POST":
        if not selected_address:
            flash("Please choose a delivery address before payment.", "warning")
            return redirect(url_for("cart_page"))

        payment_mode = request.form.get("payment_mode")
        if payment_mode not in {mode["code"] for mode in PAYMENT_MODES}:
            flash("Please choose a valid payment mode.", "danger")
            return redirect(url_for("payment_page"))

        checkout_source = session.get("checkout_source", "cart")
        order = _record_order(
            user_id=current_user.id,
            items=items,
            payment_mode=payment_mode,
            selected_address=selected_address,
            source=checkout_source,
        )

        CartItem.query.filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id.in_(selected_ids),
        ).delete(synchronize_session=False)
        _cleanup_cart_groups()

        session.pop("selected_cart_product_ids", None)
        session.pop("selected_address_id", None)
        session.pop("checkout_source", None)
        db.session.commit()

        label = next((mode["label"] for mode in PAYMENT_MODES if mode["code"] == payment_mode), payment_mode)
        flash(f"Order {order.order_number} placed successfully using {label}. Approval generated.", "success")
        return redirect(url_for("profile_order_detail", order_id=order.id))

    return render_template(
        "payment.html",
        items=items,
        display_items=display_items,
        total=total,
        payment_modes=PAYMENT_MODES,
        selected_address=selected_address,
    )


@app.route("/api/product_suggestions")
def api_product_suggestions():
    raw_query = request.args.get("q", "").strip()
    if not raw_query:
        return jsonify([])

    normalized_query, tokens, expanded_terms = _build_search_terms(raw_query)
    catalog = Product.query.filter(Product.stock > 0).all()
    prepared = []

    for product in catalog:
        specs = _parse_specs(product)
        search_blob = _product_search_blob(product, specs)
        score = _search_score_from_blob(search_blob, normalized_query, tokens, expanded_terms)
        prepared.append({"product": product, "search_blob": search_blob, "score": score})

    suggestions = [entry for entry in prepared if entry["score"] > 0]
    if not suggestions and tokens:
        fuzzy_terms = _fuzzy_search_terms(tokens, [entry["search_blob"] for entry in prepared])
        if fuzzy_terms:
            for entry in prepared:
                entry["score"] = _search_score_from_blob(entry["search_blob"], normalized_query, tokens, fuzzy_terms)
            suggestions = [entry for entry in prepared if entry["score"] > 0]

    suggestions.sort(key=lambda entry: (entry["score"], entry["product"].stock, entry["product"].name), reverse=True)
    top = suggestions[:12]
    return jsonify(
        [
            {"id": entry["product"].id, "name": entry["product"].name, "category": entry["product"].category}
            for entry in top
        ]
    )


@app.route("/search", methods=["GET", "POST"])
def search():
    if request.method == "POST":
        user_input = request.form.get("profession", "").strip()
    else:
        user_input = request.args.get("profession", "").strip()

    if not user_input:
        flash("Please select your purpose to get pre-build recommendations.", "warning")
        return redirect(url_for("index"))

    profile_meta = SmartConsultant.resolve_profile_meta(user_input)
    if not profile_meta.get("matched") and profile_meta.get("score", 0) <= 0:
        flash(
            "Please enter one of these profiles: Student, Gaming, Software Developer, Professional Worker, or Content Creation.",
            "warning",
        )
        return redirect(url_for("index"))

    recommendations = SmartConsultant.get_recommendations(user_input)
    return redirect(url_for("recommended_prebuilds", profession=user_input))


@app.route("/recommended-prebuilds")
def recommended_prebuilds():
    user_input = request.args.get("profession", "").strip()
    if not user_input:
        flash("Please choose a purpose first.", "warning")
        return redirect(url_for("index"))

    profile_meta = SmartConsultant.resolve_profile_meta(user_input)
    if not profile_meta.get("matched") and profile_meta.get("score", 0) <= 0:
        flash(
            "Please choose one of the supported profiles: Student, Gaming, Software Developer, Professional Worker, or Content Creation.",
            "warning",
        )
        return redirect(url_for("index"))

    recommendations = SmartConsultant.get_recommendations(user_input)
    setup_cards = _build_recommendation_setups(recommendations)

    return render_template(
        "recommended_prebuilds.html",
        profession=user_input,
        recommendations=recommendations,
        setup_cards=setup_cards,
    )


@app.route("/recommended-prebuilds/<profile_key>/<int:setup_index>")
def recommended_prebuild_detail(profile_key, setup_index):
    recommendations, setup_cards, selected_setup = _get_recommendation_setup(profile_key, setup_index)
    if not selected_setup:
        flash("Requested setup was not found.", "warning")
        return redirect(url_for("recommended_prebuilds", profession=recommendations.get("profile_label", profile_key)))

    return render_template(
        "prebuild_detail.html",
        recommendations=recommendations,
        setup_cards=setup_cards,
        setup=selected_setup,
    )


@app.route("/prebuild/checkout", methods=["POST"])
def prebuild_checkout():
    data = request.get_json(silent=True) or request.form
    expects_json = request.is_json

    def build_error(message):
        if expects_json:
            return jsonify({"error": message}), 400
        flash(message, "warning")
        return redirect(url_for("index"))

    profile_key = (data.get("profile_key") or "student").strip() or "student"
    try:
        setup_index = int(data.get("setup_index", 0))
    except (TypeError, ValueError):
        setup_index = -1

    recommendations, _, selected_setup = _get_recommendation_setup(profile_key, setup_index)
    if not selected_setup:
        return build_error("Selected pre-build setup is unavailable.")

    selected_ids = selected_setup.get("selected_product_ids", [])
    products = Product.query.filter(Product.id.in_(selected_ids)).all()
    product_map = {product.id: product for product in products}
    ordered_products = [product_map[pid] for pid in selected_ids if pid in product_map]
    if len(ordered_products) != len(selected_ids):
        return build_error("Some setup components are unavailable. Please try another setup.")

    ordered_ids = _upsert_products_in_cart(ordered_products)
    _save_cart_group(
        group_type="prebuild_pc",
        name=selected_setup.get("name", "Recommended Pre-Build"),
        summary=selected_setup.get("summary", "Recommended pre-built PC setup."),
        product_ids=ordered_ids,
        image_url=selected_setup.get("image_url", ""),
        profile_key=recommendations.get("profile_key", profile_key),
        setup_index=selected_setup.get("setup_index"),
    )

    total = sum(product.price for product in ordered_products)
    session["selected_cart_product_ids"] = ordered_ids
    session["checkout_source"] = "prebuild_pc"

    if expects_json:
        return jsonify({"message": "Pre-build setup added to cart.", "redirect": url_for("cart_page")})

    flash("Pre-build setup added to cart. Choose address and proceed to payment.", "success")
    return redirect(url_for("cart_page"))


@app.route("/custom-pc")
def custom_pc_builder():
    preset = request.args.get("preset", "").strip()
    preset_setup_index = request.args.get("setup_index", type=int)
    edit_group_id = _normalize_group_id(request.args.get("edit_group_id"))
    preselected_components = {}
    preset_label = ""

    if edit_group_id:
        group = _find_cart_group(edit_group_id)
        if group:
            products = Product.query.filter(Product.id.in_(group.get("product_ids", []))).all()
            for product in products:
                if product.category in CUSTOM_PC_CATEGORY_CODES:
                    preselected_components[product.category] = product.id
            preset_label = f"Editing setup: {group.get('name', 'Custom PC Setup')}"

    elif preset:
        recommendation = SmartConsultant.get_recommendations(preset)
        selected_setup = None

        if isinstance(preset_setup_index, int):
            _, _, selected_setup = _get_recommendation_setup(recommendation.get("profile_key", preset), preset_setup_index)

        if not selected_setup:
            preset_setups = _build_recommendation_setups(recommendation, desired_count=1)
            if preset_setups:
                selected_setup = preset_setups[0]

        if selected_setup:
            for component in selected_setup.get("components", []):
                category_code = component.get("category_code")
                product_id = component.get("product_id")
                if category_code in CUSTOM_PC_CATEGORY_CODES and product_id:
                    preselected_components[category_code] = int(product_id)
            preset_label = f"Setup selected: {selected_setup.get('name', 'Recommended Setup')}"
        else:
            preset_label = f"Profile selected: {recommendation.get('profile_label', 'Recommended')}"

    return render_template(
        "custom_pc.html",
        custom_catalog=_custom_builder_catalog(),
        preselected_components=preselected_components,
        preset_label=preset_label,
        edit_group_id=edit_group_id,
        required_category_count=len(CUSTOM_PC_CATEGORY_FLOW),
    )


@app.route("/custom-pc/checkout", methods=["POST"])
def custom_pc_checkout():
    data = request.get_json(silent=True) or request.form
    selected_ids = _parse_product_ids_payload(data.get("selected_product_ids") or data.get("selected_ids"))
    replace_group_id = _normalize_group_id(data.get("replace_group_id"))
    expects_json = request.is_json

    def build_error(message):
        if expects_json:
            return jsonify({"error": message}), 400
        flash(message, "warning")
        return redirect(url_for("custom_pc_builder"))

    if len(selected_ids) != len(CUSTOM_PC_CATEGORY_CODES):
        return build_error("Please select exactly one product from each required category.")

    products = Product.query.filter(Product.id.in_(selected_ids)).all()
    if len(products) != len(selected_ids):
        return build_error("Some selected products are unavailable. Please rebuild your configuration.")

    selected_by_category = {}
    for product in products:
        if product.category not in CUSTOM_PC_CATEGORY_CODES:
            return build_error("Selected products must belong to the custom PC categories.")
        if product.category in selected_by_category:
            return build_error("Only one product can be selected per category.")
        selected_by_category[product.category] = product

    missing_categories = [
        category_meta["label"]
        for category_meta in CUSTOM_PC_CATEGORY_FLOW
        if category_meta["code"] not in selected_by_category
    ]
    if missing_categories:
        return build_error(f"Missing selections for: {', '.join(missing_categories)}")

    replacement_group = _find_cart_group(replace_group_id) if replace_group_id else None
    if replacement_group:
        _remove_products_from_cart(replacement_group.get("product_ids", []), persist=False)
        _delete_cart_group(replace_group_id)

    ordered_products = [selected_by_category[category_meta["code"]] for category_meta in CUSTOM_PC_CATEGORY_FLOW]
    ordered_ids = _upsert_products_in_cart(ordered_products)
    total = sum(product.price for product in ordered_products)

    cpu_name = next((product.name for product in ordered_products if product.category == "CPU"), "")
    gpu_name = next((product.name for product in ordered_products if product.category == "GPU"), "")
    ram_name = next((product.name for product in ordered_products if product.category == "RAM"), "")
    summary_bits = [bit for bit in [cpu_name, gpu_name, ram_name] if bit]
    setup_summary = " | ".join(summary_bits) if summary_bits else "Custom configured setup"

    setup_image = _setup_image_url("custom-build", "custom-pc", ordered_ids)

    _save_cart_group(
        group_type="custom_pc",
        name="Custom PC Setup",
        summary=setup_summary,
        product_ids=ordered_ids,
        image_url=setup_image,
        group_id=replace_group_id if replacement_group else None,
    )

    session["selected_cart_product_ids"] = ordered_ids
    session["checkout_source"] = "custom_pc"

    if expects_json:
        return jsonify({"message": "Configuration saved.", "redirect": url_for("cart_page")})

    if current_user.is_authenticated:
        flash("Custom PC setup saved in cart. Choose address and proceed to payment.", "success")
    else:
        flash("Custom PC setup saved in cart. Log in during checkout to add address and payment details.", "info")
    return redirect(url_for("cart_page"))


@app.route("/products")
def products():
    category_slug = request.args.get("category", "all").lower()
    if category_slug != "all" and category_slug not in CATEGORY_BY_SLUG:
        category_slug = "all"

    brand = request.args.get("brand", "").strip()
    size = request.args.get("size", "").strip()
    memory_type = request.args.get("memory_type", "").strip()
    search_query = request.args.get("q", "").strip()
    recommend_for = request.args.get("recommend_for", "").strip()
    sort = request.args.get("sort", "").strip()
    search_scope = request.args.get("scope", "").strip().lower()

    if recommend_for:
        return redirect(url_for("recommended_prebuilds", profession=recommend_for))

    min_price = _safe_float(request.args.get("min_price"), PRICE_FILTER_MIN)
    max_price = _safe_float(request.args.get("max_price"), PRICE_FILTER_MAX)
    min_price = max(PRICE_FILTER_MIN, min(min_price, PRICE_FILTER_MAX))
    max_price = max(PRICE_FILTER_MIN, min(max_price, PRICE_FILTER_MAX))
    if min_price > max_price:
        min_price, max_price = max_price, min_price

    selected_category_code = None
    base_query = Product.query.filter(Product.price >= min_price, Product.price <= max_price)
    filtered_query = base_query
    if category_slug != "all":
        selected_category_code = CATEGORY_BY_SLUG[category_slug]["code"]
        filtered_query = filtered_query.filter_by(category=selected_category_code)

    def build_candidate_cards(rows, apply_attribute_filters=True):
        cards = []
        for product in rows:
            specs = _parse_specs(product)
            product_brand = str(specs.get("brand", "")).strip()
            product_size = str(specs.get("size") or specs.get("capacity") or specs.get("vram") or "").strip()
            product_memory_type = str(specs.get("memory_type") or specs.get("type") or "").strip()

            if apply_attribute_filters:
                if brand and product_brand.lower() != brand.lower():
                    continue
                if size and product_size.lower() != size.lower():
                    continue
                if memory_type and product_memory_type.lower() != memory_type.lower():
                    continue

            cards.append(
                {
                    "product": product,
                    "specs": specs,
                    "brand": product_brand,
                    "size": product_size,
                    "memory_type": product_memory_type,
                    "search_blob": _product_search_blob(product, specs),
                    "search_score": 0,
                }
            )
        return cards

    def score_candidates(cards, normalized_query, tokens, expanded_terms):
        scored_cards = []
        for card in cards:
            score = _search_score_from_blob(card["search_blob"], normalized_query, tokens, expanded_terms)
            if score > 0:
                card["search_score"] = score
                scored_cards.append(card)

        local_fuzzy_terms = []
        if not scored_cards and tokens:
            local_fuzzy_terms = _fuzzy_search_terms(tokens, [card["search_blob"] for card in cards])
            if local_fuzzy_terms:
                for card in cards:
                    score = _search_score_from_blob(card["search_blob"], normalized_query, tokens, local_fuzzy_terms)
                    if score > 0:
                        card["search_score"] = score
                        scored_cards.append(card)

        return scored_cards, local_fuzzy_terms

    candidate_cards = build_candidate_cards(filtered_query.all(), apply_attribute_filters=True)

    normalized_query = ""
    search_tokens = []
    search_terms = []
    fuzzy_terms = []
    expanded_scope = False

    if search_query:
        normalized_query, search_tokens, search_terms = _build_search_terms(search_query)
        candidate_cards, fuzzy_terms = score_candidates(candidate_cards, normalized_query, search_tokens, search_terms)

        has_active_component_filters = bool(selected_category_code or brand or size or memory_type)
        should_expand_scope = bool(search_scope == "global" or has_active_component_filters)
        if not candidate_cards and should_expand_scope:
            expanded_scope = True
            fallback_cards = build_candidate_cards(base_query.all(), apply_attribute_filters=False)
            candidate_cards, fallback_fuzzy_terms = score_candidates(
                fallback_cards,
                normalized_query,
                search_tokens,
                search_terms,
            )
            if not fuzzy_terms:
                fuzzy_terms = fallback_fuzzy_terms
    if sort == "price_asc":
        candidate_cards.sort(key=lambda card: card["product"].price)
    elif sort == "price_desc":
        candidate_cards.sort(key=lambda card: card["product"].price, reverse=True)
    elif search_query:
        candidate_cards.sort(
            key=lambda card: (card.get("search_score", 0), card["product"].stock, -card["product"].price),
            reverse=True,
        )
    else:
        candidate_cards.sort(key=lambda card: card["product"].stock, reverse=True)

    featured_products = Product.query.filter(Product.stock > 0).order_by(Product.stock.desc()).limit(8).all()

    if selected_category_code:
        brand_options = BRAND_OPTIONS.get(selected_category_code, [])
        size_options = SIZE_OPTIONS.get(selected_category_code, [])
        memory_type_options = MEMORY_TYPE_OPTIONS.get(selected_category_code, [])
    else:
        brand_options = sorted({brand_name for values in BRAND_OPTIONS.values() for brand_name in values})
        size_options = []
        memory_type_options = []

    return render_template(
        "products.html",
        product_cards=candidate_cards,
        featured_products=featured_products,
        categories=CATEGORY_OPTIONS,
        filters={
            "category": category_slug,
            "brand": brand,
            "size": size,
            "memory_type": memory_type,
            "q": search_query,
            "recommend_for": recommend_for,
            "sort": sort,
            "scope": search_scope,
            "min_price": int(min_price),
            "max_price": int(max_price),
        },
        brand_options=brand_options,
        size_options=size_options,
        memory_type_options=memory_type_options,
        recommendation_context=None,
        recommendation_setups=[],
        result_count=len(candidate_cards),
        price_bounds={"min": PRICE_FILTER_MIN, "max": PRICE_FILTER_MAX},
        search_feedback={"fuzzy_terms": fuzzy_terms, "expanded_scope": expanded_scope},
    )

@app.route("/product/<int:product_id>")
def product_detail(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return redirect(url_for("products"))

    specs = _parse_specs(product)
    related_products = (
        Product.query.filter(Product.category == product.category, Product.id != product.id)
        .order_by(Product.stock.desc())
        .limit(4)
        .all()
    )

    return render_template("product_detail.html", product=product, specs=specs, related_products=related_products)


def _service_issue_summary(form_data):
    service_type = (form_data or {}).get("service_type")
    if service_type == "repair":
        part = (form_data.get("part_to_repair") or "Repair").strip()
        issue = (form_data.get("issue_description") or "General issue").strip()
        return f"{part}: {issue}"
    if service_type == "installation":
        os_type = (form_data.get("os_type") or "OS Installation").strip()
        version = (form_data.get("os_version") or "").strip()
        return f"{os_type} {version}".strip()
    if service_type == "upgrade":
        upgrade = (form_data.get("upgrade_type") or "Upgrade").strip()
        current_specs = (form_data.get("current_specs") or "N/A").strip()
        desired_specs = (form_data.get("desired_specs") or "N/A").strip()
        return f"{upgrade}: from {current_specs} to {desired_specs}"
    return "General hardware support"

def _create_service_request(form_data, user_id):
    service_type = form_data.get("service_type")
    device_model = form_data.get("device_model")
    home_visit = form_data.get("home_visit") == "on"
    address = _normalize_address(form_data.get("address")) if home_visit else None
    if not address:
        address = None

    sr = ServiceRequest(
        user_id=user_id,
        service_type=service_type,
        device_model=device_model,
        home_visit=home_visit,
        address=address,
        status="pending",
        priority="medium",
    )

    estimated_cost = 45.00
    estimated_time = "1-2 hours"
    issue_or_requirement = _service_issue_summary(form_data)

    if service_type == "repair":
        sr.part_to_repair = form_data.get("part_to_repair")
        sr.issue_description = form_data.get("issue_description")
        estimated_cost = 50.00
        estimated_time = "2-3 days"
        issue_or_requirement = _service_issue_summary(form_data)
    elif service_type == "installation":
        sr.os_type = form_data.get("os_type")
        sr.os_version = form_data.get("os_version")
        estimated_cost = 30.00
        estimated_time = "2-4 hours"
        issue_or_requirement = _service_issue_summary(form_data)
    elif service_type == "upgrade":
        sr.upgrade_type = form_data.get("upgrade_type")
        sr.current_specs = form_data.get("current_specs")
        sr.desired_specs = form_data.get("desired_specs")
        estimated_cost = 40.00
        estimated_time = "1-2 hours"
        issue_or_requirement = _service_issue_summary(form_data)

    sr.estimated_cost = estimated_cost
    sr.estimated_time = estimated_time

    if address:
        _save_user_address(user_id, address)

    db.session.add(sr)
    db.session.commit()

    confirmation_data = {
        "request_id": sr.id,
        "service_type": service_type,
        "device_model": device_model,
        "home_visit": home_visit,
        "address": address,
        "issue_or_requirement": issue_or_requirement,
        "estimated_cost": estimated_cost,
        "estimated_time": estimated_time,
        "date": datetime.now().strftime("%B %d, %Y"),
    }
    return sr, confirmation_data


@app.route("/service", methods=["GET", "POST"])
def service_request():
    if request.method == "GET":
        saved_addresses = []
        selected_address = ""
        selected_address_id = None

        if current_user.is_authenticated:
            saved_addresses = _get_user_addresses_for_display(current_user.id)
            if saved_addresses:
                selected_address_id = session.get("selected_address_id")
                valid_ids = {addr["id"] for addr in saved_addresses}
                if selected_address_id not in valid_ids:
                    default_addr = next((addr for addr in saved_addresses if addr["is_default"]), None)
                    selected_address_id = default_addr["id"] if default_addr else saved_addresses[0]["id"]
                selected = next((addr for addr in saved_addresses if addr["id"] == selected_address_id), None)
                if selected:
                    selected_address = selected["address"]
                    session["selected_address_id"] = selected["id"]

        if request.args.get("resume") == "1" and current_user.is_authenticated and session.get("pending_service_form"):
            return redirect(url_for("service_payment"))

        return render_template(
            "service.html",
            saved_addresses=saved_addresses,
            selected_address=selected_address,
            selected_address_id=selected_address_id,
        )

    form_data = request.form.to_dict(flat=True)
    service_type = form_data.get("service_type")
    if not service_type:
        flash("Please select a service type.", "danger")
        return redirect(url_for("service_request"))

    if form_data.get("home_visit") == "on":
        if current_user.is_authenticated:
            address_id = request.form.get("address_id", type=int)
            if address_id:
                selected = UserAddress.query.filter_by(id=address_id, user_id=current_user.id).first()
                if selected:
                    payload = _address_payload_from_record(selected)
                    form_data["address"] = payload.get("address", "")
                    session["selected_address_id"] = selected.id

        if not _normalize_address(form_data.get("address")):
            flash("Please select or add a service address for home visit.", "warning")
            return redirect(url_for("service_request"))
    else:
        form_data["address"] = ""

    session["pending_service_form"] = form_data

    if not current_user.is_authenticated:
        flash("Please log in to continue service payment. We saved your request details.", "info")
        return redirect(url_for("login_page", next=url_for("service_payment")))

    return redirect(url_for("service_payment"))


@app.route("/service/payment", methods=["GET", "POST"])
@login_required
def service_payment():
    pending_form = session.get("pending_service_form")
    if not isinstance(pending_form, dict) or not pending_form.get("service_type"):
        flash("Please submit service details first.", "warning")
        return redirect(url_for("service_request"))

    service_type = pending_form.get("service_type")
    estimated_map = {
        "repair": 50.0,
        "installation": 30.0,
        "upgrade": 40.0,
    }
    estimated_cost = float(estimated_map.get(service_type, 45.0))
    issue_or_requirement = _service_issue_summary(pending_form)

    if request.method == "POST":
        payment_mode = request.form.get("payment_mode")
        if payment_mode not in {mode["code"] for mode in PAYMENT_MODES}:
            flash("Please choose a valid payment mode.", "danger")
            return redirect(url_for("service_payment"))

        _, confirmation_data = _create_service_request(pending_form, current_user.id)
        session.pop("pending_service_form", None)

        payment_label = next((mode["label"] for mode in PAYMENT_MODES if mode["code"] == payment_mode), payment_mode)
        confirmation_data.update(
            {
                "booking_fee": SERVICE_BOOKING_FEE,
                "paid_amount": SERVICE_BOOKING_FEE,
                "payment_label": payment_label,
            }
        )
        flash("Service booking payment completed and approval generated.", "success")
        return render_template("service_confirm.html", **confirmation_data)

    return render_template(
        "service_payment.html",
        form_data=pending_form,
        issue_or_requirement=issue_or_requirement,
        estimated_cost=estimated_cost,
        booking_fee=SERVICE_BOOKING_FEE,
        payment_modes=PAYMENT_MODES,
    )


@app.route("/api/recommendations")
def api_recommendations():
    profession = request.args.get("profession", "").strip()
    if not profession:
        return jsonify({"error": "No profession provided"}), 400

    profile_meta = SmartConsultant.resolve_profile_meta(profession)
    if not profile_meta.get("matched") and profile_meta.get("score", 0) <= 0:
        return jsonify(
            {
                "error": "No matching profile found",
                "supported_profiles": [
                    "Student",
                    "Gaming",
                    "Software Developer",
                    "Professional Worker",
                    "Content Creation",
                ],
            }
        ), 400

    return jsonify(SmartConsultant.get_recommendations(profession))


with app.app_context():
    _sync_prebuild_setup_image_rules()

if __name__ == "__main__":
    app.run(debug=True)
