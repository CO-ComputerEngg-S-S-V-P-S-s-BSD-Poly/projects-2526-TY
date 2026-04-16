// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './CartSidebar.css';

// /* ── Free shipping threshold ── */
// const FREE_SHIPPING_THRESHOLD = 3000;

// const CartSidebar = ({
//   isOpen,
//   onClose,
//   cartItems = [],
//   updateQuantity,
//   removeItem,
// }) => {
//   const navigate = useNavigate();
//   const [voucherCode,     setVoucherCode]     = useState('');
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [voucherMessage,  setVoucherMessage]  = useState('');
//   const [showVoucher,     setShowVoucher]     = useState(false);
//   const [removingId,      setRemovingId]      = useState(null);

//   /* Lock body scroll when sidebar is open */
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => { document.body.style.overflow = ''; };
//   }, [isOpen]);

//   /* ── Price helpers ── */
//   const subtotalMRP = cartItems.reduce(
//     (acc, item) => acc + (item.originalPrice ?? item.price + 300) * item.quantity, 0
//   );
//   const subtotalSale = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity, 0
//   );
//   const discountMRP  = subtotalMRP - subtotalSale;
//   const extraDiscount = discountApplied ? subtotalSale * 0.1 : 0;
//   const finalTotal   = subtotalSale - extraDiscount;
//   const totalItems   = cartItems.reduce((a, i) => a + i.quantity, 0);

//   /* Free shipping progress */
//   const shippingProgress = Math.min((finalTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
//   const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - finalTotal, 0);

//   /* ── Voucher ── */
//   const handleApplyVoucher = () => {
//     if (voucherCode.toUpperCase() === 'SONGIR10') {
//       if (!discountApplied) {
//         setDiscountApplied(true);
//         setVoucherMessage('✓ 10% extra discount applied!');
//       } else {
//         setVoucherMessage('Already applied');
//       }
//     } else {
//       setVoucherMessage('✗ Invalid code');
//     }
//   };

//   /* ── Animated remove ── */
//   const handleRemove = (id) => {
//     setRemovingId(id);
//     setTimeout(() => {
//       removeItem(id);
//       setRemovingId(null);
//     }, 320);
//   };

//   /* ── Navigation actions ── */
//   const handleViewCart = () => {
//     onClose();
//     navigate('/cart');
//   };

//   const handleCheckout = () => {
//     onClose();
//     navigate('/checkout');
//   };

//   return (
//     <>
//       {/* ── Backdrop ── */}
//       <div
//         className={`cs-backdrop ${isOpen ? 'cs-backdrop--visible' : ''}`}
//         onClick={onClose}
//         aria-hidden="true"
//       />

//       {/* ── Sidebar panel ── */}
//       <aside className={`cs-panel ${isOpen ? 'cs-panel--open' : ''}`}
//         role="dialog" aria-modal="true" aria-label="Shopping cart">

//         {/* ── Header ── */}
//         <div className="cs-header">
//           <div className="cs-header-left">
//             <svg className="cs-cart-icon" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
//               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
//             </svg>
//             <h2 className="cs-title">My Cart</h2>
//             {totalItems > 0 && (
//               <span className="cs-count-badge">{totalItems}</span>
//             )}
//           </div>
//           <button className="cs-close-btn" onClick={onClose} aria-label="Close cart">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
//               strokeLinecap="round">
//               <line x1="18" y1="6" x2="6" y2="18"/>
//               <line x1="6" y1="6" x2="18" y2="18"/>
//             </svg>
//           </button>
//         </div>

//         {/* ── Free shipping bar ── */}
//         {cartItems.length > 0 && (
//           <div className="cs-shipping-bar">
//             <div className="cs-shipping-text">
//               {amountLeft === 0
//                 ? '🎉 You qualify for FREE shipping!'
//                 : <>🚚 Add <strong>₹{amountLeft.toLocaleString()}</strong> more for FREE shipping</>
//               }
//             </div>
//             <div className="cs-progress-track">
//               <div className="cs-progress-fill" style={{ width: `${shippingProgress}%` }} />
//             </div>
//           </div>
//         )}

//         {/* ── Body ── */}
//         <div className="cs-body">

//           {cartItems.length === 0 ? (
//             /* Empty state */
//             <div className="cs-empty">
//               <div className="cs-empty-icon">🛒</div>
//               <h3>Your cart is empty</h3>
//               <p>Discover our handcrafted brass &amp; copper collection</p>
//               <button className="cs-browse-btn" onClick={() => { onClose(); navigate('/products'); }}>
//                 Browse Products
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* PRODUCTS section label */}
//               <p className="cs-section-label">PRODUCTS</p>

//               {/* ── Item list ── */}
//               <ul className="cs-item-list">
//                 {cartItems.map(item => (
//                   <li
//                     key={item.id}
//                     className={`cs-item ${removingId === item.id ? 'cs-item--removing' : ''}`}
//                   >
//                     {/* Product image */}
//                     <div className="cs-item-img-wrap">
//                       {item.image ? (
//                         <img src={item.image} alt={item.name} className="cs-item-img" />
//                       ) : (
//                         <span className="cs-item-emoji">
//                           {item.category === 'Copper' ? '🏺' : '🪔'}
//                         </span>
//                       )}
//                     </div>

//                     {/* Product info */}
//                     <div className="cs-item-info">
//                       <p className="cs-item-name">{item.name}</p>
//                       <p className="cs-item-shop">{item.shop}</p>

//                       {/* Pricing */}
//                       <div className="cs-item-pricing">
//                         <span className="cs-item-price">₹{item.price.toLocaleString()}</span>
//                         <span className="cs-item-original">
//                           ₹{(item.originalPrice ?? item.price + 300).toLocaleString()}
//                         </span>
//                       </div>

//                       {/* Qty + Delete row */}
//                       <div className="cs-item-actions">
//                         <div className="cs-qty-control">
//                           <button
//                             className="cs-qty-btn"
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                             aria-label="Decrease"
//                           >−</button>
//                           <span className="cs-qty-num">{item.quantity}</span>
//                           <button
//                             className="cs-qty-btn"
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                             aria-label="Increase"
//                           >+</button>
//                         </div>

//                         <button
//                           className="cs-delete-btn"
//                           onClick={() => handleRemove(item.id)}
//                           aria-label="Remove item"
//                         >
//                           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <polyline points="3 6 5 6 21 6"/>
//                             <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//                             <path d="M10 11v6M14 11v6"/>
//                             <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>

//               {/* ── Voucher toggle ── */}
//               <div className="cs-voucher-wrap">
//                 <button
//                   className="cs-voucher-toggle"
//                   onClick={() => setShowVoucher(v => !v)}
//                 >
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
//                     <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>
//                     <path d="M15 3h6v6"/><path d="M10 14L21 3"/>
//                   </svg>
//                   Have a voucher code?
//                   <span className={`cs-chevron ${showVoucher ? 'cs-chevron--up' : ''}`}>▾</span>
//                 </button>

//                 {showVoucher && (
//                   <div className="cs-voucher-body">
//                     <div className="cs-voucher-row">
//                       <input
//                         type="text"
//                         className="cs-voucher-input"
//                         placeholder="e.g. SONGIR10"
//                         value={voucherCode}
//                         onChange={e => setVoucherCode(e.target.value)}
//                         onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
//                       />
//                       <button className="cs-voucher-apply" onClick={handleApplyVoucher}>
//                         Apply
//                       </button>
//                     </div>
//                     {voucherMessage && (
//                       <p className={`cs-voucher-msg ${voucherMessage.includes('✓') ? 'success' : 'error'}`}>
//                         {voucherMessage}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* ── Footer (Order summary + buttons) — only when items exist ── */}
//         {cartItems.length > 0 && (
//           <div className="cs-footer">
//             {/* Order Summary */}
//             <div className="cs-summary">
//               <div className="cs-summary-row">
//                 <span>Subtotal ({totalItems} items)</span>
//                 <span>₹{subtotalMRP.toLocaleString()}</span>
//               </div>
//               <div className="cs-summary-row cs-discount">
//                 <span>Discount on MRP</span>
//                 <span>− ₹{discountMRP.toLocaleString()}</span>
//               </div>
//               {discountApplied && (
//                 <div className="cs-summary-row cs-extra">
//                   <span>Voucher (SONGIR10)</span>
//                   <span>− ₹{extraDiscount.toFixed(0)}</span>
//                 </div>
//               )}
//               <div className="cs-summary-row cs-total">
//                 <span>Total</span>
//                 <span>₹{finalTotal.toFixed(0)}</span>
//               </div>
//               <p className="cs-tax-note">Tax included. Shipping calculated at checkout.</p>
//             </div>

//             {/* Action buttons */}
//             <div className="cs-actions">
//               <button className="cs-btn cs-btn--view" onClick={handleViewCart}>
//                 View Cart
//               </button>
//               {/* <button className="cs-btn cs-btn--checkout" onClick={handleCheckout}>
//                 Proceed to Checkout
//               </button> */}
//                <button
//                 className="checkout-btn"
//                 onClick={() => navigate('/quote')}
//               >
//                 Checkout
//               </button>
//               {/* <button className="cs-btn cs-btn--continue" onClick={onClose}>
//                 Continue Shopping
//               </button> */}

//               <button
//                 className="cs-btn cs-btn--continue"
//                 onClick={() => navigate('/products')}
//               >
//                 Continue Shopping
//               </button>


//             </div>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// };

// export default CartSidebar;





















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

/* ── Free shipping threshold ── */
const FREE_SHIPPING_THRESHOLD = 3000;

/* ✅ FIX: Backend image URL helper */
const BASE_URL = "http://localhost:5000";
function getImageUrl(img) {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
}

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems = [],
  updateQuantity,
  removeItem,
}) => {
  const navigate = useNavigate();
  const [voucherCode,     setVoucherCode]     = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [voucherMessage,  setVoucherMessage]  = useState('');
  const [showVoucher,     setShowVoucher]     = useState(false);
  const [removingId,      setRemovingId]      = useState(null);

  /* Lock body scroll when sidebar is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Price helpers ── */
  const subtotalMRP = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice ?? item.price + 300) * item.quantity, 0
  );
  const subtotalSale = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );
  const discountMRP  = subtotalMRP - subtotalSale;
  const extraDiscount = discountApplied ? subtotalSale * 0.1 : 0;
  const finalTotal   = subtotalSale - extraDiscount;
  const totalItems   = cartItems.reduce((a, i) => a + i.quantity, 0);

  /* Free shipping progress */
  const shippingProgress = Math.min((finalTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - finalTotal, 0);

  /* ── Voucher ── */
  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'SONGIR10') {
      if (!discountApplied) {
        setDiscountApplied(true);
        setVoucherMessage('✓ 10% extra discount applied!');
      } else {
        setVoucherMessage('Already applied');
      }
    } else {
      setVoucherMessage('✗ Invalid code');
    }
  };

  /* ── Animated remove ── */
  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 320);
  };

  /* ── Navigation actions ── */
  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`cs-backdrop ${isOpen ? 'cs-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sidebar panel ── */}
      <aside className={`cs-panel ${isOpen ? 'cs-panel--open' : ''}`}
        role="dialog" aria-modal="true" aria-label="Shopping cart">

        {/* ── Header ── */}
        <div className="cs-header">
          <div className="cs-header-left">
            <svg className="cs-cart-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 className="cs-title">My Cart</h2>
            {totalItems > 0 && (
              <span className="cs-count-badge">{totalItems}</span>
            )}
          </div>
          <button className="cs-close-btn" onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Free shipping bar ── */}
        {cartItems.length > 0 && (
          <div className="cs-shipping-bar">
            <div className="cs-shipping-text">
              {amountLeft === 0
                ? '🎉 You qualify for FREE shipping!'
                : <>🚚 Add <strong>₹{amountLeft.toLocaleString()}</strong> more for FREE shipping</>
              }
            </div>
            <div className="cs-progress-track">
              <div className="cs-progress-fill" style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="cs-body">

          {cartItems.length === 0 ? (
            /* Empty state */
            <div className="cs-empty">
              <div className="cs-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Discover our handcrafted brass &amp; copper collection</p>
              <button className="cs-browse-btn" onClick={() => { onClose(); navigate('/products'); }}>
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* PRODUCTS section label */}
              <p className="cs-section-label">PRODUCTS</p>

              {/* ── Item list ── */}
              <ul className="cs-item-list">
                {cartItems.map(item => {
                  // ✅ FIX: Use getImageUrl to resolve backend image paths
                  const imageUrl = getImageUrl(item.image);

                  return (
                    <li
                      key={item.id}
                      className={`cs-item ${removingId === item.id ? 'cs-item--removing' : ''}`}
                    >
                      {/* Product image */}
                      <div className="cs-item-img-wrap">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="cs-item-img"
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className="cs-item-emoji"
                          style={{ display: imageUrl ? 'none' : 'flex' }}
                        >
                          {item.category === 'Copper' ? '🏺' : '🪔'}
                        </span>
                      </div>

                      {/* Product info */}
                      <div className="cs-item-info">
                        <p className="cs-item-name">{item.name}</p>
                        <p className="cs-item-shop">{item.shop || item.shopName}</p>

                        {/* Pricing */}
                        <div className="cs-item-pricing">
                          <span className="cs-item-price">₹{item.price.toLocaleString()}</span>
                          <span className="cs-item-original">
                            ₹{(item.originalPrice ?? item.price + 300).toLocaleString()}
                          </span>
                        </div>

                        {/* Qty + Delete row */}
                        <div className="cs-item-actions">
                          <div className="cs-qty-control">
                            <button
                              className="cs-qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease"
                            >−</button>
                            <span className="cs-qty-num">{item.quantity}</span>
                            <button
                              className="cs-qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase"
                            >+</button>
                          </div>

                          <button
                            className="cs-delete-btn"
                            onClick={() => handleRemove(item.id)}
                            aria-label="Remove item"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* ── Voucher toggle ── */}
              <div className="cs-voucher-wrap">
                <button
                  className="cs-voucher-toggle"
                  onClick={() => setShowVoucher(v => !v)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>
                    <path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                  </svg>
                  Have a voucher code?
                  <span className={`cs-chevron ${showVoucher ? 'cs-chevron--up' : ''}`}>▾</span>
                </button>

                {showVoucher && (
                  <div className="cs-voucher-body">
                    <div className="cs-voucher-row">
                      <input
                        type="text"
                        className="cs-voucher-input"
                        placeholder="e.g. SONGIR10"
                        value={voucherCode}
                        onChange={e => setVoucherCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
                      />
                      <button className="cs-voucher-apply" onClick={handleApplyVoucher}>
                        Apply
                      </button>
                    </div>
                    {voucherMessage && (
                      <p className={`cs-voucher-msg ${voucherMessage.includes('✓') ? 'success' : 'error'}`}>
                        {voucherMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer (Order summary + buttons) — only when items exist ── */}
        {cartItems.length > 0 && (
          <div className="cs-footer">
            {/* Order Summary */}
            <div className="cs-summary">
              <div className="cs-summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotalMRP.toLocaleString()}</span>
              </div>
              <div className="cs-summary-row cs-discount">
                <span>Discount on MRP</span>
                <span>− ₹{discountMRP.toLocaleString()}</span>
              </div>
              {discountApplied && (
                <div className="cs-summary-row cs-extra">
                  <span>Voucher (SONGIR10)</span>
                  <span>− ₹{extraDiscount.toFixed(0)}</span>
                </div>
              )}
              <div className="cs-summary-row cs-total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
              <p className="cs-tax-note">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Action buttons */}
            <div className="cs-actions">
              <button className="cs-btn cs-btn--view" onClick={handleViewCart}>
                View Cart
              </button>
              <button
                className="checkout-btn"
                onClick={() => navigate('/quote')}
              >
                Checkout
              </button>
              <button
                className="cs-btn cs-btn--continue"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;