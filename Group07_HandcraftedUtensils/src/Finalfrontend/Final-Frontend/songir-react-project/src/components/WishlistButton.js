import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toggleWishlist, isInWishlist } from '../utils/wishlistUtils';

const WishlistButton = ({ product, productId, size = 20, className = '' }) => {
  // Support both `product` (full object) and `productId` (ID only) props
  const pid = product ? (product._id || product.id) : productId;

  const [wishlisted, setWishlisted] = useState(() => isInWishlist(pid));

  // Sync when other components update wishlist
  useEffect(() => {
    const sync = () => setWishlisted(isInWishlist(pid));
    window.addEventListener('wishlistUpdated', sync);
    return () => window.removeEventListener('wishlistUpdated', sync);
  }, [pid]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Pass full product object if available, else just ID
    const itemToToggle = product || pid;
    const added = toggleWishlist(itemToToggle);
    setWishlisted(added);

    // Dispatch event so navbar count and other components update
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  return (
    <motion.button
      className={`wishlist-btn ${wishlisted ? 'active' : ''} ${className}`}
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: wishlisted ? 1.2 : 1,
          rotate: wishlisted ? 360 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>
          {wishlisted ? '❤️' : '🤍'}
        </span>
      </motion.div>
    </motion.button>
  );
};

export default WishlistButton;
