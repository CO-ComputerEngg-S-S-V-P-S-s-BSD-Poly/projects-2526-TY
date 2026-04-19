// // recentlyViewedUtils.js
// // Per-user recently viewed — key matches ProductDetailPage & home.jsx

// const BASE_URL = "http://localhost:5000";

// /* ── Resolve backend image URL ── */
// const resolveImage = (img) => {
//   if (!img) return "";
//   if (img.startsWith("http")) return img;
//   return `${BASE_URL}/${img.replace(/^\//, "")}`;
// };

// /* ── Get current user ID (matches ProductDetailPage logic) ── */
// const getUserId = () => {
//   try {
//     const keys = ["songirUser", "songir_user", "currentUser", "userData", "user", "loggedInUser"];
//     for (const k of keys) {
//       const raw = localStorage.getItem(k);
//       if (raw) {
//         const u = JSON.parse(raw);
//         const id = u._id || u.id || u.userId || u.email;
//         if (id) return String(id).replace(/[^a-zA-Z0-9_-]/g, "_");
//       }
//     }
//   } catch {}
//   return "guest";
// };

// const getRecentKey = () => `songir_recently_viewed_${getUserId()}`;

// /* ── Save product to per-user recently viewed list ── */
// export const saveRecentlyViewed = (product) => {
//   try {
//     const key = getRecentKey();
//     const pid = String(product._id || product.id);
//     const existing = JSON.parse(localStorage.getItem(key) || "[]");
//     const filtered = existing.filter((p) => String(p.id) !== pid);
//     const entry = {
//       id: pid,
//       name: product.name,
//       price: product.price,
//       // Resolve image URL so home.jsx displays it correctly
//       image: resolveImage(product.image),
//       category: product.category,
//       rating: product.rating,
//       shop: product.shop || product.shopName || "",
//     };
//     const updated = [entry, ...filtered].slice(0, 20);
//     localStorage.setItem(key, JSON.stringify(updated));

//     // Dispatch storage event so home.jsx listener picks it up in same tab
//     window.dispatchEvent(
//       new StorageEvent("storage", {
//         key,
//         newValue: JSON.stringify(updated),
//         storageArea: localStorage,
//       })
//     );
//   } catch (error) {
//     console.error("Error saving recently viewed:", error);
//   }
// };

// /* ── Get per-user recently viewed list ── */
// export const getRecentlyViewed = () => {
//   try {
//     return JSON.parse(localStorage.getItem(getRecentKey()) || "[]");
//   } catch {
//     return [];
//   }
// };

// /* ── Get related products (same category, excluding current) ── */
// export const getRelatedProducts = (productId, allProducts) => {
//   return allProducts
//     .filter((p) => String(p._id || p.id) !== String(productId))
//     .slice(0, 4);
// };



// recentlyViewedUtils.js
// Per-user recently viewed — key matches ProductDetailPage & home.jsx

const BASE_URL = "http://localhost:5000";

/* ── Resolve backend image URL ── */
const resolveImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img.replace(/^\//, "")}`;
};

/* ── Get current user ID (matches ProductDetailPage logic) ── */
const getUserId = () => {
  try {
    const keys = ["songirUser", "songir_user", "currentUser", "userData", "user", "loggedInUser"];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        const u = JSON.parse(raw);
        const id = u._id || u.id || u.userId || u.email;
        if (id) return String(id).replace(/[^a-zA-Z0-9_-]/g, "_");
      }
    }
  } catch {}
  return "guest";
};

const getRecentKey = () => `songir_recently_viewed_${getUserId()}`;

/* ── Save product to per-user recently viewed list ── */
export const saveRecentlyViewed = (product) => {
  try {
    const key = getRecentKey();
    const pid = String(product._id || product.id);
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = existing.filter((p) => String(p.id) !== pid);
    const entry = {
      id: pid,
      name: product.name,
      price: product.price,
      // Resolve image URL so home.jsx displays it correctly
      image: resolveImage(product.image),
      category: product.category,
      rating: product.rating,
      shop: product.shop || product.shopName || "",
    };
    const updated = [entry, ...filtered].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));

    // Dispatch storage event so home.jsx listener picks it up in same tab
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(updated),
        storageArea: localStorage,
      })
    );
  } catch (error) {
    console.error("Error saving recently viewed:", error);
  }
};

/* ── Get per-user recently viewed list ── */
export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(getRecentKey()) || "[]");
  } catch {
    return [];
  }
};

/* ── Get related products (same category, excluding current) ── */
export const getRelatedProducts = (productId, allProducts) => {
  return allProducts
    .filter((p) => String(p._id || p.id) !== String(productId))
    .slice(0, 4);
};