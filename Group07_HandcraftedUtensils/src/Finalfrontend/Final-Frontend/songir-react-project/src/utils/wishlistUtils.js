// // wishlistUtils.js
// // localStorage mein wishlist manage karta hai
// // AppContext aur WishlistContext dono isko use karte hain

// const WISHLIST_KEY = 'songir_wishlist';

// // ── Get full wishlist array ───────────────────────────────────────────────────
// export function getWishlist() {
//   try {
//     const data = localStorage.getItem(WISHLIST_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch {
//     return [];
//   }
// }

// // ── Add one product ID ────────────────────────────────────────────────────────
// export function addToWishlist(productId) {
//   try {
//     const current = getWishlist();
//     const id = String(productId);
//     if (!current.map(String).includes(id)) {
//       localStorage.setItem(WISHLIST_KEY, JSON.stringify([...current, productId]));
//     }
//   } catch {}
// }

// // ── Remove one product ID ─────────────────────────────────────────────────────
// export function removeFromWishlist(productId) {
//   try {
//     const id = String(productId);
//     const updated = getWishlist().filter(p => String(p) !== id);
//     localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
//   } catch {}
// }

// // ── Toggle (add if absent, remove if present) ─────────────────────────────────
// // Both names exported so old imports (toggleWishlist) and new ones work
// export function toggleWishlist(productId) {
//   return toggleWishlistUtil(productId);
// }

// export function toggleWishlistUtil(productId) {
//   const id = String(productId);
//   const current = getWishlist();
//   if (current.map(String).includes(id)) {
//     removeFromWishlist(productId);
//     return false; // removed
//   } else {
//     addToWishlist(productId);
//     return true;  // added
//   }
// }

// // ── Check if product is wishlisted ────────────────────────────────────────────
// export function isInWishlist(productId) {
//   const id = String(productId);
//   return getWishlist().map(String).includes(id);
// }

// // ── Clear entire wishlist ─────────────────────────────────────────────────────
// export function clearWishlist() {
//   try {
//     localStorage.removeItem(WISHLIST_KEY);
//   } catch {}
// }




// wishlistUtils.js
// localStorage mein wishlist manage karta hai
// AppContext aur WishlistContext dono isko use karte hain
// ✅ FIX: Full product objects store karta hai (sirf IDs nahi)
//         Taaki WishlistPage properly display kar sake

// const WISHLIST_KEY = 'songir_wishlist';
// const BASE_URL = "http://localhost:5000";

// // ── Image URL helper ──────────────────────────────────────────────────────────
// export function getImageUrl(img) {
//   if (!img) return "https://placehold.co/400x300?text=No+Image";
//   if (img.startsWith("http")) return img;
//   return `${BASE_URL}/${img}`;
// }

// // ── Get full wishlist array ───────────────────────────────────────────────────
// export function getWishlist() {
//   try {
//     const data = localStorage.getItem(WISHLIST_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch {
//     return [];
//   }
// }

// // ── Add one product (full object) ─────────────────────────────────────────────
// export function addToWishlist(product) {
//   try {
//     const current = getWishlist();
//     // Support both old (ID only) and new (object) format
//     const productId = typeof product === 'object' ? (product._id || product.id) : product;
//     const id = String(productId);

//     if (!current.find(p => String(p._id || p.id || p) === id)) {
//       // Store full object if available, else store minimal object
//       const itemToStore = typeof product === 'object' ? {
//         id:          product._id || product.id,
//         _id:         product._id || product.id,
//         name:        product.name,
//         price:       product.price,
//         oldPrice:    product.oldPrice || product.originalPrice || product.price + 300,
//         originalPrice: product.originalPrice || product.price + 300,
//         image:       getImageUrl(product.image),
//         category:    product.category,
//         shop:        product.shop || product.shopName,
//         shopName:    product.shop || product.shopName,
//         rating:      product.rating,
//         reviews:     product.reviews,
//         inStock:     product.inStock,
//       } : { id: productId, _id: productId };

//       localStorage.setItem(WISHLIST_KEY, JSON.stringify([...current, itemToStore]));
//     }
//   } catch {}
// }

// // ── Remove one product by ID ──────────────────────────────────────────────────
// export function removeFromWishlist(productId) {
//   try {
//     const id = String(productId);
//     const updated = getWishlist().filter(p => {
//       const pid = String(p._id || p.id || p);
//       return pid !== id;
//     });
//     localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
//   } catch {}
// }

// // ── Toggle (add if absent, remove if present) ─────────────────────────────────
// // Returns true if added, false if removed
// export function toggleWishlist(product) {
//   return toggleWishlistUtil(product);
// }

// export function toggleWishlistUtil(product) {
//   const productId = typeof product === 'object' ? (product._id || product.id) : product;
//   const id = String(productId);
//   const current = getWishlist();

//   const alreadyIn = current.find(p => String(p._id || p.id || p) === id);

//   if (alreadyIn) {
//     removeFromWishlist(productId);
//     return false; // removed
//   } else {
//     addToWishlist(product); // pass full object
//     return true;  // added
//   }
// }

// // ── Check if product is wishlisted ────────────────────────────────────────────
// export function isInWishlist(productId) {
//   const id = String(productId);
//   return !!getWishlist().find(p => String(p._id || p.id || p) === id);
// }

// // ── Clear entire wishlist ─────────────────────────────────────────────────────
// export function clearWishlist() {
//   try {
//     localStorage.removeItem(WISHLIST_KEY);
//   } catch {}
// }




const WISHLIST_KEY = 'songir_wishlist';
const BASE_URL = "http://localhost:5000";

// ── Image URL helper ──────────────────────────────────────────────────────────
export function getImageUrl(img) {
  if (!img) return "https://placehold.co/400x300?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
}

// ── Get full wishlist array (only full objects, no raw IDs) ───────────────────
export function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    const all = data ? JSON.parse(data) : [];
    // Filter: only keep full product objects with name+price
    return all.filter(item =>
      item !== null &&
      typeof item === 'object' &&
      item.name &&
      item.price !== undefined
    );
  } catch {
    return [];
  }
}

// ── Get count (for navbar badge) ─────────────────────────────────────────────
export function getWishlistCount() {
  return getWishlist().length;
}

// ── Add one product (full object) ─────────────────────────────────────────────
export function addToWishlist(product) {
  try {
    // Read raw storage (may have old ID-only entries too)
    const raw = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    const productId = typeof product === 'object' ? (product._id || product.id) : product;
    const id = String(productId);

    // Check if already exists
    const exists = raw.find(p =>
      typeof p === 'object'
        ? String(p._id || p.id) === id
        : String(p) === id
    );
    if (exists) return;

    const itemToStore = typeof product === 'object' ? {
      id:            product._id || product.id,
      _id:           product._id || product.id,
      name:          product.name,
      price:         product.price,
      oldPrice:      product.oldPrice || product.originalPrice || product.price + 300,
      originalPrice: product.originalPrice || product.price + 300,
      image:         product.image, // store raw path, resolve at display time
      category:      product.category,
      shop:          product.shop || product.shopName,
      shopName:      product.shop || product.shopName,
      rating:        product.rating,
      reviews:       product.reviews,
      inStock:       product.inStock,
      material:      product.material,
      weight:        product.weight,
      description:   product.description,
    } : { id: productId, _id: productId, name: String(productId), price: 0 };

    localStorage.setItem(WISHLIST_KEY, JSON.stringify([itemToStore, ...raw]));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  } catch {}
}

// ── Remove one product by ID ──────────────────────────────────────────────────
export function removeFromWishlist(productId) {
  try {
    const id = String(productId);
    const raw = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    const updated = raw.filter(p => {
      const pid = typeof p === 'object' ? String(p._id || p.id) : String(p);
      return pid !== id;
    });
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  } catch {}
}

// ── Toggle (add if absent, remove if present) ─────────────────────────────────
// Returns true if added, false if removed
export function toggleWishlist(product) {
  const productId = typeof product === 'object' ? (product._id || product.id) : product;
  const id = String(productId);

  if (isInWishlist(id)) {
    removeFromWishlist(id);
    return false; // removed
  } else {
    addToWishlist(product);
    return true;  // added
  }
}

// ── Check if product is wishlisted ────────────────────────────────────────────
export function isInWishlist(productId) {
  const id = String(productId);
  try {
    const raw = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    return !!raw.find(p => {
      const pid = typeof p === 'object' ? String(p._id || p.id) : String(p);
      return pid === id;
    });
  } catch {
    return false;
  }
}

// ── Clear entire wishlist ─────────────────────────────────────────────────────
export function clearWishlist() {
  try {
    localStorage.removeItem(WISHLIST_KEY);
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  } catch {}
}