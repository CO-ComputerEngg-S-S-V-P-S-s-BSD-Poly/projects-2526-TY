// // // src/context/WishlistContext.js
// // import React, { createContext, useState, useContext, useEffect } from 'react';

// // const WishlistContext = createContext();

// // export const useWishlist = () => {
// //   const context = useContext(WishlistContext);
// //   if (!context) {
// //     throw new Error('useWishlist must be used within a WishlistProvider');
// //   }
// //   return context;
// // };

// // export const WishlistProvider = ({ children }) => {
// //   const [wishlistItems, setWishlistItems] = useState([]);
// //   const [wishlistCount, setWishlistCount] = useState(0);

// //   useEffect(() => {
// //     const savedWishlist = localStorage.getItem('songirWishlist');
// //     if (savedWishlist) {
// //       try {
// //         const parsed = JSON.parse(savedWishlist);
// //         setWishlistItems(parsed);
// //       } catch (error) {
// //         console.error('Error loading wishlist:', error);
// //       }
// //     }
// //   }, []);

// //   useEffect(() => {
// //     setWishlistCount(wishlistItems.length);
// //     localStorage.setItem('songirWishlist', JSON.stringify(wishlistItems));
// //     window.dispatchEvent(new Event('wishlistUpdated'));
// //   }, [wishlistItems]);

// //   const addToWishlist = (product) => {
// //     setWishlistItems(current => {
// //       const exists = current.some(item => item.id === product.id);
// //       if (exists) return current;
// //       return [...current, { ...product, addedAt: new Date().toISOString() }];
// //     });
// //   };

// //   const removeFromWishlist = (productId) => {
// //     setWishlistItems(current => current.filter(item => item.id !== productId));
// //   };

// //   const clearWishlist = () => {
// //     setWishlistItems([]);
// //   };

// //   const isInWishlist = (productId) => {
// //     return wishlistItems.some(item => item.id === productId);
// //   };

// //   return (
// //     <WishlistContext.Provider value={{
// //       wishlistItems,
// //       wishlistCount,
// //       addToWishlist,
// //       removeFromWishlist,
// //       clearWishlist,
// //       isInWishlist
// //     }}>
// //       {children}
// //     </WishlistContext.Provider>
// //   );
// // };

// // ═══════════════════════════════════════════════════
// //  WishlistContext.js  —  src/context/WishlistContext.js
// //  Global wishlist count so Navbar badge always syncs
// // ═══════════════════════════════════════════════════

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { getWishlist } from '../utils/wishlistUtils';

// const WishlistContext = createContext({ wishlistCount: 0, refreshWishlist: () => {} });

// export function WishlistProvider({ children }) {
//   const [wishlistCount, setWishlistCount] = useState(() => getWishlist().length);

//   const refreshWishlist = useCallback(() => {
//     setWishlistCount(getWishlist().length);
//   }, []);

//   useEffect(() => {
//     // Listen to storage events (cross-tab) + custom event (same-tab)
//     window.addEventListener('wishlistUpdated', refreshWishlist);
//     window.addEventListener('storage', refreshWishlist);
//     return () => {
//       window.removeEventListener('wishlistUpdated', refreshWishlist);
//       window.removeEventListener('storage', refreshWishlist);
//     };
//   }, [refreshWishlist]);

//   return (
//     <WishlistContext.Provider value={{ wishlistCount, refreshWishlist }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }

// export function useWishlist() {
//   return useContext(WishlistContext);
// }


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//**** */
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { getWishlist } from '../utils/wishlistUtils';

// const WishlistContext = createContext();

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState(() => getWishlist());

//   // ✅ Sync karo jab bhi wishlistUpdated event fire ho
//   const refreshWishlist = useCallback(() => {
//     setWishlist(getWishlist());
//   }, []);

//   useEffect(() => {
//     window.addEventListener('wishlistUpdated', refreshWishlist);
//     return () => window.removeEventListener('wishlistUpdated', refreshWishlist);
//   }, [refreshWishlist]);

//   return (
//     <WishlistContext.Provider value={{
//       wishlist,
//       wishlistCount: wishlist.length,
//       refreshWishlist,
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }

// export function useWishlist() {
//   const ctx = useContext(WishlistContext);
//   if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
//   return ctx;
// }



import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlistCount } from '../utils/wishlistUtils';

const WishlistContext = createContext({ wishlistCount: 0, refreshWishlist: () => {} });

export function WishlistProvider({ children }) {
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistCount());

  const refreshWishlist = useCallback(() => {
    setWishlistCount(getWishlistCount());
  }, []);

  useEffect(() => {
    // Sync count whenever any component updates wishlist
    const handleUpdate = () => setWishlistCount(getWishlistCount());
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistCount, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

export default WishlistContext;