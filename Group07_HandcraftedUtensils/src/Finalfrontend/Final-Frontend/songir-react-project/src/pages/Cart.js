// import React, { useState } from 'react';
// import './Cart.css';

// // ─────────────────────────────────────────────────────────────
// //  Cart.js
// //  Props from App.js:
// //    cartItems      – array of cart items
// //    updateQuantity – (id, newQty) => void
// //    removeItem     – (id) => void
// // ─────────────────────────────────────────────────────────────
// const Cart = ({ cartItems = [], updateQuantity, removeItem }) => {
//   const [voucherCode,     setVoucherCode]     = useState('');
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [voucherMessage,  setVoucherMessage]  = useState('');

//   /* ── Price helpers ── */
//   const calculateSubtotal = () =>
//     cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const calculateOriginalSubtotal = () =>
//     cartItems.reduce(
//       (acc, item) => acc + (item.originalPrice ?? item.price + 300) * item.quantity,
//       0
//     );

//   const totalDiscount = () => calculateOriginalSubtotal() - calculateSubtotal();
//   const extraDiscount = discountApplied ? calculateSubtotal() * 0.1 : 0;
//   const finalTotal    = calculateSubtotal() - extraDiscount;

//   /* ── Voucher ── */
//   const handleApplyVoucher = () => {
//     if (voucherCode.toUpperCase() === 'SONGIR10') {
//       if (!discountApplied) {
//         setDiscountApplied(true);
//         setVoucherMessage('✓ Voucher applied: 10% extra discount');
//       } else {
//         setVoucherMessage('Voucher already applied');
//       }
//     } else {
//       setVoucherMessage('✗ Invalid voucher code');
//     }
//   };

//   return (
//     <div className="cart-container">
//       <div className="cart-wrapper">

//         <h1 className="cart-title">
//           <span className="title-brass">My</span>
//           <span className="title-copper"> Cart</span>
//         </h1>

//         {/* ── Empty state ── */}
//         {cartItems.length === 0 ? (
//           <div className="empty-cart">
//             <div className="empty-cart-icon">🛒</div>
//             <h2>Your cart is empty</h2>
//             <p>Add some handcrafted brass &amp; copper utensils from our collection</p>
//             <a href="/products" className="shop-now-btn">Browse Products</a>
//           </div>
//         ) : (
//           <div className="cart-layout">

//             {/* ── Item list ── */}
//             <div className="cart-items-section">
//               {cartItems.map(item => (
//                 <div
//                   key={item.id}
//                   className={`cart-item ${item.category?.toLowerCase() || 'brass'}`}
//                 >
//                   <div className="item-image">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         style={{
//                           width: '100%', height: '100%',
//                           objectFit: 'cover', borderRadius: '50%'
//                         }}
//                       />
//                     ) : (
//                       item.category === 'Copper' ? '🏺' : '🪔'
//                     )}
//                   </div>

//                   <div className="item-details">
//                     <h3 className="item-name">{item.name}</h3>
//                     <p className="item-description">{item.description}</p>

//                     <div className="item-pricing">
//                       <span className="current-price">₹{item.price.toLocaleString()}</span>
//                       <span className="original-price">
//                         ₹{(item.originalPrice ?? item.price + 300).toLocaleString()}
//                       </span>
//                     </div>

//                     <div className="item-actions">
//                       <div className="quantity-control">
//                         <button
//                           className="qty-btn"
//                           aria-label="Decrease quantity"
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                         >−</button>
//                         <span className="quantity">{item.quantity}</span>
//                         <button
//                           className="qty-btn"
//                           aria-label="Increase quantity"
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                         >+</button>
//                       </div>

//                       <button
//                         className="remove-btn"
//                         onClick={() => removeItem(item.id)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── Order summary ── */}
//             <div className="order-summary">
//               <h2>Order Summary</h2>

//               <div className="summary-content">
//                 <div className="summary-row">
//                   <span>
//                     Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)
//                   </span>
//                   <span>₹{calculateOriginalSubtotal().toLocaleString()}</span>
//                 </div>

//                 <div className="summary-row discount-row">
//                   <span>Discount on MRP</span>
//                   <span>− ₹{totalDiscount().toLocaleString()}</span>
//                 </div>

//                 {discountApplied && (
//                   <div className="summary-row extra-discount">
//                     <span>Extra 10% (SONGIR10)</span>
//                     <span>− ₹{extraDiscount.toFixed(0)}</span>
//                   </div>
//                 )}

//                 <div className="summary-row total-row">
//                   <span>Total</span>
//                   <span>₹{finalTotal.toFixed(0)}</span>
//                 </div>

//                 {/* Voucher */}
//                 {/* <div className="voucher-section">
//                   <p className="voucher-label">Have a voucher code?</p>
//                   <div className="voucher-input-group">
//                     <input
//                       type="text"
//                       placeholder="Enter code e.g. SONGIR10"
//                       value={voucherCode}
//                       onChange={e => setVoucherCode(e.target.value)}
//                       onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
//                       className="voucher-input"
//                     />
//                     <button className="apply-btn" onClick={handleApplyVoucher}>
//                       Apply
//                     </button>
//                   </div>
//                   {voucherMessage && (
//                     <p className={`voucher-message ${voucherMessage.includes('✓') ? 'success' : 'error'}`}>
//                       {voucherMessage}
//                     </p>
//                   )}
//                 </div> */}

//                 <button className="checkout-btn">Checkout</button>
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Cart.css';

// // ─────────────────────────────────────────────────────────────
// //  Cart.js
// //  Props from App.js:
// //    cartItems      – array of cart items
// //    updateQuantity – (id, newQty) => void
// //    removeItem     – (id) => void
// // ─────────────────────────────────────────────────────────────

// const Cart = ({ cartItems = [], updateQuantity, removeItem }) => {

//   const navigate = useNavigate();   // 👈 added navigation

//   const [voucherCode, setVoucherCode] = useState('');
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [voucherMessage, setVoucherMessage] = useState('');

//   /* ── Price helpers ── */
//   const calculateSubtotal = () =>
//     cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const calculateOriginalSubtotal = () =>
//     cartItems.reduce(
//       (acc, item) => acc + (item.originalPrice ?? item.price + 300) * item.quantity,
//       0
//     );

//   const totalDiscount = () => calculateOriginalSubtotal() - calculateSubtotal();
//   const extraDiscount = discountApplied ? calculateSubtotal() * 0.1 : 0;
//   const finalTotal = calculateSubtotal() - extraDiscount;

//   /* ── Voucher ── */
//   const handleApplyVoucher = () => {
//     if (voucherCode.toUpperCase() === 'SONGIR19') {
//       if (!discountApplied) {
//         setDiscountApplied(true);
//         setVoucherMessage('✓ Voucher applied: 10% extra discount');
//       } else {
//         setVoucherMessage('Voucher already applied');
//       }
//     } else {
//       setVoucherMessage('✗ Invalid voucher code');
//     }
//   };

//   /* ── Checkout Handler ── */
//   const handleCheckout = () => {
//     navigate('/quote');   // 👈 change route if needed
//   };

//   return (
//     <div className="cart-container">
//       <div className="cart-wrapper">

//         <h1 className="cart-title">
//           <span className="title-brass">My</span>
//           <span className="title-copper"> Cart</span>
//         </h1>

//         {cartItems.length === 0 ? (
//           <div className="empty-cart">
//             <div className="empty-cart-icon">🛒</div>
//             <h2>Your cart is empty</h2>
//             <p>Add some handcrafted brass & copper utensils from our collection</p>
//             <a href="/products" className="shop-now-btn">Browse Products</a>
//           </div>
//         ) : (
//           <div className="cart-layout">

//             {/* ── Item list ── */}
//             <div className="cart-items-section">
//               {cartItems.map(item => (
//                 <div
//                   key={item.id}
//                   className={`cart-item ${item.category?.toLowerCase() || 'brass'}`}
//                 >
//                   <div className="item-image">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'cover',
//                           borderRadius: '50%'
//                         }}
//                       />
//                     ) : (
//                       item.category === 'Copper' ? '🏺' : '🪔'
//                     )}
//                   </div>

//                   <div className="item-details">
//                     <h3 className="item-name">{item.name}</h3>
//                     <p className="item-description">{item.description}</p>

//                     <div className="item-pricing">
//                       <span className="current-price">
//                         ₹{item.price.toLocaleString()}
//                       </span>
//                       <span className="original-price">
//                         ₹{(item.originalPrice ?? item.price + 300).toLocaleString()}
//                       </span>
//                     </div>

//                     <div className="item-actions">
//                       <div className="quantity-control">
//                         <button
//                           className="qty-btn"
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                         >
//                           −
//                         </button>

//                         <span className="quantity">{item.quantity}</span>

//                         <button
//                           className="qty-btn"
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                         >
//                           +
//                         </button>
//                       </div>

//                       <button
//                         className="remove-btn"
//                         onClick={() => removeItem(item.id)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── Order summary ── */}
//             <div className="order-summary">
//               <h2>Order Summary</h2>

//               <div className="summary-content">

//                 <div className="summary-row">
//                   <span>
//                     Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)
//                   </span>
//                   <span>₹{calculateOriginalSubtotal().toLocaleString()}</span>
//                 </div>

//                 <div className="summary-row discount-row">
//                   <span>Discount on MRP</span>
//                   <span>− ₹{totalDiscount().toLocaleString()}</span>
//                 </div>

//                 {discountApplied && (
//                   <div className="summary-row extra-discount">
//                     <span>Extra 10% (SONGIR10)</span>
//                     <span>− ₹{extraDiscount.toFixed(0)}</span>
//                   </div>
//                 )}

//                 <div className="summary-row total-row">
//                   <span>Total</span>
//                   <span>₹{finalTotal.toFixed(0)}</span>
//                 </div>

//                 {/* ✅ Checkout Button Linked */}
//                 <button
//                   className="checkout-btn"
//                   onClick={handleCheckout}
//                 >
//                   Proceed to Quote
//                 </button>

//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;











import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

// ─────────────────────────────────────────────────────────────
//  Cart.js
//  Props from App.js:
//    cartItems      – array of cart items
//    updateQuantity – (id, newQty) => void
//    removeItem     – (id) => void
// ─────────────────────────────────────────────────────────────

/* ✅ FIX: Backend image URL helper (same as CartSidebar) */
const BASE_URL = "http://localhost:5000";
function getImageUrl(img) {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
}

const Cart = ({ cartItems = [], updateQuantity, removeItem }) => {

  const navigate = useNavigate();

  const [voucherCode, setVoucherCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState('');

  /* ── Price helpers ── */
  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateOriginalSubtotal = () =>
    cartItems.reduce(
      (acc, item) => acc + (item.originalPrice ?? item.price + 300) * item.quantity,
      0
    );

  const totalDiscount = () => calculateOriginalSubtotal() - calculateSubtotal();
  const extraDiscount = discountApplied ? calculateSubtotal() * 0.1 : 0;
  const finalTotal = calculateSubtotal() - extraDiscount;

  /* ── Voucher ── */
  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'SONGIR19') {
      if (!discountApplied) {
        setDiscountApplied(true);
        setVoucherMessage('✓ Voucher applied: 10% extra discount');
      } else {
        setVoucherMessage('Voucher already applied');
      }
    } else {
      setVoucherMessage('✗ Invalid voucher code');
    }
  };

  /* ── Checkout Handler ── */
  const handleCheckout = () => {
    navigate('/quote');
  };

  return (
    <div className="cart-container">
      <div className="cart-wrapper">

        <h1 className="cart-title">
          <span className="title-brass">My</span>
          <span className="title-copper"> Cart</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some handcrafted brass & copper utensils from our collection</p>
            <a href="/products" className="shop-now-btn">Browse Products</a>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ── Item list ── */}
            <div className="cart-items-section">
              {cartItems.map(item => {

                /* ✅ FIX: Resolve image URL via helper */
                const imageUrl = getImageUrl(item.image);

                return (
                  <div
                    key={item.id}
                    className={`cart-item ${item.category?.toLowerCase() || 'brass'}`}
                  >
                    <div className="item-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span
                        style={{
                          display: imageUrl ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          fontSize: '2rem'
                        }}
                      >
                        {item.category === 'Copper' ? '🏺' : '🪔'}
                      </span>
                    </div>

                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>

                      <div className="item-pricing">
                        <span className="current-price">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="original-price">
                          ₹{(item.originalPrice ?? item.price + 300).toLocaleString()}
                        </span>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-control">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </button>

                          <span className="quantity">{item.quantity}</span>

                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order summary ── */}
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-content">

                <div className="summary-row">
                  <span>
                    Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)
                  </span>
                  <span>₹{calculateOriginalSubtotal().toLocaleString()}</span>
                </div>

                <div className="summary-row discount-row">
                  <span>Discount on MRP</span>
                  <span>− ₹{totalDiscount().toLocaleString()}</span>
                </div>

                {discountApplied && (
                  <div className="summary-row extra-discount">
                    <span>Extra 10% (SONGIR10)</span>
                    <span>− ₹{extraDiscount.toFixed(0)}</span>
                  </div>
                )}

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Quote
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;