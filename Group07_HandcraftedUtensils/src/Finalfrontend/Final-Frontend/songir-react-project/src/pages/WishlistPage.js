// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import {
//   Heart, ShoppingCart, X, Share2, Trash2,
//   ShoppingBag, ArrowLeft, ChevronDown, ChevronUp,
//   CheckCircle, Star, Package, Sparkles, MoreVertical
// } from 'lucide-react';

// /* ─────────────────────────────────────────────
//    THEME TOKENS
// ───────────────────────────────────────────── */
// const C = {
//   copper:     '#B87333',
//   copperDark: '#8B5A2B',
//   copperLight:'#D4956A',
//   brass:      '#C9A44C',
//   cream:      '#FDF8F0',
//   cream2:     '#FFF6E5',
//   dark:       '#2A1408',
//   text:       '#3E2723',
//   muted:      '#8D6E63',
//   border:     '#EDE0D0',
//   white:      '#FFFFFF',
//   success:    '#2E7D32',
//   danger:     '#C62828',
//   soldout:    '#9E9E9E',
// };

// /* ─────────────────────────────────────────────
//    ANIMATIONS
// ───────────────────────────────────────────── */
// const fadeUp = keyframes`
//   from { opacity:0; transform:translateY(16px); }
//   to   { opacity:1; transform:translateY(0); }
// `;
// const pop = keyframes`
//   0%   { transform:scale(1); }
//   35%  { transform:scale(1.35); }
//   65%  { transform:scale(0.9); }
//   100% { transform:scale(1); }
// `;
// const slideDown = keyframes`
//   from { opacity:0; transform:translateY(-8px); }
//   to   { opacity:1; transform:translateY(0); }
// `;
// const toastSlide = keyframes`
//   from { opacity:0; transform:translateX(100px); }
//   to   { opacity:1; transform:translateX(0); }
// `;
// const shimmer = keyframes`
//   0%   { background-position: -400px 0; }
//   100% { background-position: 400px 0; }
// `;

// /* ─────────────────────────────────────────────
//    GLOBAL FONT
// ───────────────────────────────────────────── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
// `;

// /* ─────────────────────────────────────────────
//    PAGE SHELL
// ───────────────────────────────────────────── */
// const Page = styled.div`
//   min-height: 100vh;
//   background: ${C.cream};
//   font-family: 'DM Sans', sans-serif;
//   padding-top: 80px;
//   color: ${C.text};
// `;

// /* ─────────────────────────────────────────────
//    TOP HEADER BAR
// ───────────────────────────────────────────── */
// const HeaderBar = styled.div`
//   background: ${C.white};
//   border-bottom: 1.5px solid ${C.border};
//   padding: 0 2rem;
//   position: sticky;
//   top: 80px;
//   z-index: 100;
//   box-shadow: 0 2px 12px rgba(62,39,35,0.06);
// `;
// const HeaderInner = styled.div`
//   max-width: 1200px;
//   margin: auto;
//   height: 60px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 1rem;
// `;
// const BackBtn = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 0.45rem;
//   background: none;
//   border: none;
//   color: ${C.muted};
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.85rem;
//   font-weight: 500;
//   cursor: pointer;
//   padding: 0.4rem 0;
//   transition: color 0.2s;
//   &:hover { color: ${C.copper}; }
// `;
// const HeaderTitle = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.65rem;
//   h2 {
//     font-family: 'Cormorant Garamond', serif;
//     font-size: 1.35rem;
//     font-weight: 700;
//     color: ${C.dark};
//     margin: 0;
//     letter-spacing: -0.3px;
//   }
// `;
// const CountPill = styled.span`
//   background: ${C.copper};
//   color: #fff;
//   font-size: 0.72rem;
//   font-weight: 700;
//   padding: 2px 9px;
//   border-radius: 50px;
//   letter-spacing: 0.2px;
// `;
// const HeaderActions = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.6rem;
// `;
// const IconBtn = styled.button`
//   width: 36px;
//   height: 36px;
//   border-radius: 8px;
//   border: 1.5px solid ${C.border};
//   background: ${C.white};
//   color: ${C.muted};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   transition: all 0.2s;
//   &:hover {
//     border-color: ${C.copper};
//     color: ${C.copper};
//     background: rgba(184,115,51,0.05);
//   }
// `;
// const ClearBtn = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 0.4rem;
//   background: none;
//   border: 1.5px solid ${C.border};
//   border-radius: 8px;
//   color: ${C.danger};
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.78rem;
//   font-weight: 600;
//   padding: 0.4rem 0.9rem;
//   cursor: pointer;
//   transition: all 0.2s;
//   &:hover {
//     background: rgba(198,40,40,0.05);
//     border-color: ${C.danger};
//   }
// `;

// /* ─────────────────────────────────────────────
//    MAIN CONTENT
// ───────────────────────────────────────────── */
// const Main = styled.div`
//   max-width: 1200px;
//   margin: auto;
//   padding: 2rem;
//   @media(max-width:640px) { padding: 1rem; }
// `;

// /* ─────────────────────────────────────────────
//    CARDS GRID  (thinKitchen style — 4 per row)
// ───────────────────────────────────────────── */
// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 1.25rem;
//   @media(max-width:1100px) { grid-template-columns: repeat(3,1fr); }
//   @media(max-width:768px)  { grid-template-columns: repeat(2,1fr); }
//   @media(max-width:480px)  { grid-template-columns: 1fr; }
// `;

// /* ─────────────────────────────────────────────
//    PRODUCT CARD
// ───────────────────────────────────────────── */
// const Card = styled.div`
//   background: ${C.white};
//   border: 1.5px solid ${C.border};
//   border-radius: 14px;
//   overflow: hidden;
//   position: relative;
//   transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
//   animation: ${fadeUp} 0.42s ease both;
//   animation-delay: ${({$i})=>$i*0.06}s;
//   cursor: pointer;
//   &:hover {
//     border-color: ${C.copper};
//     box-shadow: 0 8px 32px rgba(184,115,51,0.14);
//     transform: translateY(-4px);
//   }
//   &.removing {
//     opacity: 0;
//     transform: scale(0.92);
//     pointer-events: none;
//   }
// `;

// /* Image area */
// const ImgWrap = styled.div`
//   position: relative;
//   width: 100%;
//   padding-top: 100%;   /* square */
//   background: ${C.cream2};
//   overflow: hidden;
// `;
// const ProductImg = styled.img`
//   position: absolute;
//   inset: 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   transition: transform 0.4s ease;
//   ${Card}:hover & { transform: scale(1.06); }
// `;
// const ImgPlaceholder = styled.div`
//   position: absolute;
//   inset: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 3rem;
//   color: ${C.copper};
//   opacity: 0.35;
//   background: linear-gradient(135deg, ${C.cream2}, #FFE0B2);
// `;

// /* Remove X button (top-right, shows on hover) */
// const RemoveBtn = styled.button`
//   position: absolute;
//   top: 8px;
//   right: 8px;
//   width: 28px;
//   height: 28px;
//   border-radius: 50%;
//   border: none;
//   background: rgba(255,255,255,0.92);
//   box-shadow: 0 2px 8px rgba(0,0,0,0.14);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   z-index: 2;
//   opacity: 0;
//   transition: all 0.2s;
//   color: ${C.danger};
//   ${Card}:hover & { opacity: 1; }
//   &:hover {
//     background: ${C.danger};
//     color: #fff;
//     transform: scale(1.12);
//   }
// `;

// /* Sold out overlay */
// const SoldOverlay = styled.div`
//   position: absolute;
//   inset: 0;
//   background: rgba(255,255,255,0.55);
//   backdrop-filter: blur(2px);
//   z-index: 1;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   span {
//     background: ${C.soldout};
//     color: #fff;
//     font-size: 0.72rem;
//     font-weight: 700;
//     padding: 5px 14px;
//     border-radius: 50px;
//     letter-spacing: 1px;
//     text-transform: uppercase;
//   }
// `;

// /* Card body */
// const CardBody = styled.div`
//   padding: 0.9rem;
// `;

// /* Product name with truncate/expand */
// const NameWrap = styled.div``;
// const ProductName = styled.p`
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.84rem;
//   font-weight: 600;
//   color: ${C.dark};
//   margin: 0 0 0.1rem;
//   line-height: 1.45;
//   display: ${({$expanded})=>$expanded?'block':'-webkit-box'};
//   -webkit-line-clamp: ${({$expanded})=>$expanded?'unset':'2'};
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;
// const ExpandToggle = styled.button`
//   background: none;
//   border: none;
//   padding: 0;
//   font-size: 0.72rem;
//   font-weight: 600;
//   color: ${C.copper};
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 2px;
//   margin-top: 2px;
//   font-family: 'DM Sans', sans-serif;
//   &:hover { text-decoration: underline; }
// `;

// /* Rating */
// const RatingRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   margin: 0.45rem 0 0.5rem;
//   .stars { display:flex; gap:1px; }
//   span { font-size: 0.72rem; color: ${C.muted}; font-weight: 500; }
// `;

// /* Price */
// const PriceRow = styled.div`
//   display: flex;
//   align-items: baseline;
//   gap: 0.5rem;
//   margin-bottom: 0.75rem;
//   flex-wrap: wrap;
// `;
// const Price = styled.span`
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: ${C.copper};
//   line-height: 1;
// `;
// const OldPrice = styled.span`
//   font-size: 0.8rem;
//   color: ${C.soldout};
//   text-decoration: line-through;
// `;
// const SaveBadge = styled.span`
//   font-size: 0.68rem;
//   font-weight: 700;
//   background: rgba(184,115,51,0.1);
//   color: ${C.copper};
//   padding: 1px 7px;
//   border-radius: 50px;
//   border: 1px solid rgba(184,115,51,0.2);
// `;

// /* Cart button */
// const CartBtn = styled.button`
//   width: 100%;
//   border: none;
//   border-radius: 8px;
//   padding: 0.68rem;
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.8rem;
//   font-weight: 700;
//   letter-spacing: 0.5px;
//   text-transform: uppercase;
//   cursor: pointer;
//   transition: all 0.22s;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.4rem;

//   ${({$status})=>{
//     switch($status){
//       case 'added':
//         return `
//           background: ${C.success};
//           color: #fff;
//           &:hover { background: #1B5E20; }
//         `;
//       case 'soldout':
//         return `
//           background: #F5F5F5;
//           color: ${C.soldout};
//           cursor: not-allowed;
//           pointer-events: none;
//         `;
//       default:
//         return `
//           background: linear-gradient(135deg, ${C.copper}, ${C.copperDark});
//           color: #fff;
//           box-shadow: 0 3px 12px rgba(184,115,51,0.28);
//           &:hover {
//             transform: translateY(-1px);
//             box-shadow: 0 6px 18px rgba(184,115,51,0.38);
//           }
//           &:active { transform: translateY(0); }
//         `;
//     }
//   }}
// `;

// /* ─────────────────────────────────────────────
//    EMPTY STATE
// ───────────────────────────────────────────── */
// const Empty = styled.div`
//   text-align: center;
//   padding: 80px 24px 60px;
//   animation: ${fadeUp} 0.5s ease;
// `;
// const EmptyHeart = styled.div`
//   width: 88px;
//   height: 88px;
//   border-radius: 50%;
//   background: linear-gradient(135deg, ${C.cream2}, #FFE0B2);
//   border: 2px solid ${C.border};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 1.5rem;
//   svg { color: ${C.copper}; opacity: 0.6; }
// `;
// const EmptyTitle = styled.h3`
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 1.75rem;
//   font-weight: 700;
//   color: ${C.dark};
//   margin: 0 0 0.6rem;
// `;
// const EmptyText = styled.p`
//   color: ${C.muted};
//   font-size: 0.92rem;
//   margin: 0 auto 2rem;
//   max-width: 320px;
//   line-height: 1.65;
// `;
// const ShopBtn = styled.button`
//   background: linear-gradient(135deg, ${C.copper}, ${C.copperDark});
//   color: #fff;
//   border: none;
//   padding: 0.85rem 2.2rem;
//   border-radius: 50px;
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.92rem;
//   font-weight: 700;
//   cursor: pointer;
//   transition: all 0.25s;
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   box-shadow: 0 4px 16px rgba(184,115,51,0.32);
//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 24px rgba(184,115,51,0.42);
//   }
// `;

// /* ─────────────────────────────────────────────
//    UNDO BANNER
// ───────────────────────────────────────────── */
// const UndoBar = styled.div`
//   background: ${C.dark};
//   border-radius: 10px;
//   padding: 12px 18px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 1rem;
//   margin-bottom: 1.25rem;
//   animation: ${slideDown} 0.3s ease;
//   span { color: rgba(255,255,255,0.82); font-size: 0.84rem; }
// `;
// const UndoBtn = styled.button`
//   background: rgba(184,115,51,0.25);
//   border: 1px solid rgba(184,115,51,0.45);
//   color: ${C.brass};
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.78rem;
//   font-weight: 700;
//   padding: 5px 14px;
//   border-radius: 6px;
//   cursor: pointer;
//   transition: all 0.2s;
//   white-space: nowrap;
//   &:hover { background: rgba(184,115,51,0.4); }
// `;

// /* ─────────────────────────────────────────────
//    TOAST
// ───────────────────────────────────────────── */
// const ToastStack = styled.div`
//   position: fixed;
//   top: 96px;
//   right: 20px;
//   z-index: 9999;
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
//   pointer-events: none;
// `;
// const Toast = styled.div`
//   background: ${({$t})=>$t==='success'?C.success:$t==='danger'?C.danger:C.copper};
//   color: #fff;
//   padding: 11px 18px;
//   border-radius: 10px;
//   font-size: 0.82rem;
//   font-weight: 600;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   box-shadow: 0 6px 20px rgba(0,0,0,0.18);
//   animation: ${toastSlide} 0.32s cubic-bezier(0.4,0,0.2,1);
//   max-width: 280px;
//   backdrop-filter: blur(8px);
// `;

// /* ─────────────────────────────────────────────
//    SHARE MODAL
// ───────────────────────────────────────────── */
// const ModalBackdrop = styled.div`
//   position: fixed;
//   inset: 0;
//   background: rgba(20,8,0,0.45);
//   backdrop-filter: blur(4px);
//   z-index: 2000;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 1rem;
//   animation: ${fadeUp} 0.2s ease;
// `;
// const ModalBox = styled.div`
//   background: ${C.white};
//   border-radius: 18px;
//   padding: 2rem;
//   max-width: 380px;
//   width: 100%;
//   box-shadow: 0 24px 64px rgba(20,8,0,0.25);
//   animation: ${fadeUp} 0.25s ease;
//   h3 {
//     font-family: 'Cormorant Garamond', serif;
//     font-size: 1.35rem;
//     font-weight: 700;
//     color: ${C.dark};
//     margin: 0 0 0.4rem;
//   }
//   p { color: ${C.muted}; font-size: 0.84rem; margin: 0 0 1.25rem; }
// `;
// const ShareLinkBox = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   background: ${C.cream2};
//   border: 1.5px solid ${C.border};
//   border-radius: 9px;
//   padding: 0.65rem 1rem;
//   margin-bottom: 1rem;
//   input {
//     flex: 1;
//     border: none;
//     background: transparent;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.8rem;
//     color: ${C.text};
//     outline: none;
//   }
//   button {
//     background: ${C.copper};
//     color: #fff;
//     border: none;
//     border-radius: 6px;
//     padding: 5px 14px;
//     font-size: 0.78rem;
//     font-weight: 700;
//     cursor: pointer;
//     font-family: 'DM Sans', sans-serif;
//     white-space: nowrap;
//     &:hover { background: ${C.copperDark}; }
//   }
// `;
// const ModalCloseBtn = styled.button`
//   width: 100%;
//   background: none;
//   border: 1.5px solid ${C.border};
//   border-radius: 9px;
//   padding: 0.65rem;
//   color: ${C.muted};
//   font-family: 'DM Sans', sans-serif;
//   font-size: 0.84rem;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.2s;
//   &:hover { border-color: ${C.copper}; color: ${C.copper}; }
// `;

// /* ─────────────────────────────────────────────
//    WISHLIST STORAGE HELPERS (no login required)
// ───────────────────────────────────────────── */
// const WL_KEY = 'songirWishlist';

// function getWishlist() {
//   try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); }
//   catch { return []; }
// }
// function saveWishlist(items) {
//   localStorage.setItem(WL_KEY, JSON.stringify(items));
//   window.dispatchEvent(new CustomEvent('wishlistUpdated'));
// }
// function removeFromWishlist(id) {
//   const updated = getWishlist().filter(i => i.id !== id);
//   saveWishlist(updated);
//   return updated;
// }
// function restoreToWishlist(item) {
//   const current = getWishlist();
//   if (!current.find(i => i.id === item.id)) {
//     saveWishlist([item, ...current]);
//   }
// }

// /* ─────────────────────────────────────────────
//    COMPONENT
// ───────────────────────────────────────────── */
// export default function WishlistPage({ addToCart }) {
//   const navigate = useNavigate();

//   const [items,       setItems]       = useState([]);
//   const [removingId,  setRemovingId]  = useState(null);
//   const [lastRemoved, setLastRemoved] = useState(null);
//   const [undoTimeout, setUndoTimeout] = useState(null);
//   const [addedIds,    setAddedIds]    = useState({});   // { id: true } = added to cart
//   const [expanded,    setExpanded]    = useState({});   // { id: true } = name expanded
//   const [toasts,      setToasts]      = useState([]);
//   const [showShare,   setShowShare]   = useState(false);
//   const [confirmClear,setConfirmClear]= useState(false);

//   /* Load */
//   const load = useCallback(() => setItems(getWishlist()), []);
//   useEffect(() => {
//     load();
//     window.addEventListener('wishlistUpdated', load);
//     return () => window.removeEventListener('wishlistUpdated', load);
//   }, [load]);

//   /* Toast */
//   const toast = (msg, type = 'success') => {
//     const id = Date.now() + Math.random();
//     setToasts(p => [...p, { id, msg, type }]);
//     setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
//   };

//   /* Remove with animation + undo */
//   const handleRemove = (item) => {
//     setRemovingId(item.id);
//     setTimeout(() => {
//       const updated = removeFromWishlist(item.id);
//       setItems(updated);
//       setRemovingId(null);
//       setLastRemoved(item);
//       if (undoTimeout) clearTimeout(undoTimeout);
//       const t = setTimeout(() => setLastRemoved(null), 6000);
//       setUndoTimeout(t);
//     }, 280);
//   };

//   /* Undo remove */
//   const handleUndo = () => {
//     if (!lastRemoved) return;
//     restoreToWishlist(lastRemoved);
//     load();
//     setLastRemoved(null);
//     if (undoTimeout) clearTimeout(undoTimeout);
//     toast('Item restored to wishlist ❤️');
//   };

//   /* Add to cart */
//   const handleAddToCart = (e, product) => {
//     e.stopPropagation();
//     if (product.soldOut) return;
//     if (addToCart) addToCart(product);
//     setAddedIds(p => ({ ...p, [product.id]: true }));
//     toast('Added to cart 🛒');
//     // Reset "Added" label after 2.5s
//     setTimeout(() => setAddedIds(p => { const n={...p}; delete n[product.id]; return n; }), 2500);
//   };

//   /* Toggle name expand */
//   const toggleExpand = (e, id) => {
//     e.stopPropagation();
//     setExpanded(p => ({ ...p, [id]: !p[id] }));
//   };

//   /* Clear all */
//   const handleClearAll = () => {
//     if (!confirmClear) { setConfirmClear(true); setTimeout(()=>setConfirmClear(false), 3000); return; }
//     saveWishlist([]);
//     setItems([]);
//     setConfirmClear(false);
//     toast('Wishlist cleared', 'danger');
//   };

//   /* Copy share link */
//   const copyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     toast('Link copied to clipboard!');
//   };

//   /* Stars renderer */
//   const renderStars = (rating = 4.5) => {
//     return [1,2,3,4,5].map(s => (
//       <Star
//         key={s}
//         size={10}
//         fill={s <= Math.round(rating) ? '#F9A825' : 'none'}
//         color={s <= Math.round(rating) ? '#F9A825' : '#DDD'}
//       />
//     ));
//   };

//   /* Savings % */
//   const savePct = (price, oldPrice) =>
//     oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

//   /* Name needs truncation check (rough char estimate) */
//   const needsTruncation = (name = '') => name.length > 42;

//   return (
//     <>
//       <GlobalStyle />

//       {/* TOASTS */}
//       <ToastStack>
//         {toasts.map(t => (
//           <Toast key={t.id} $t={t.type}>{t.msg}</Toast>
//         ))}
//       </ToastStack>

//       {/* SHARE MODAL */}
//       {showShare && (
//         <ModalBackdrop onClick={() => setShowShare(false)}>
//           <ModalBox onClick={e => e.stopPropagation()}>
//             <h3>Share Wishlist</h3>
//             <p>Send this link to share your collection with someone</p>
//             <ShareLinkBox>
//               <input readOnly value={window.location.href} />
//               <button onClick={copyLink}>Copy</button>
//             </ShareLinkBox>
//             <ModalCloseBtn onClick={() => setShowShare(false)}>Close</ModalCloseBtn>
//           </ModalBox>
//         </ModalBackdrop>
//       )}

//       <Page>
//         {/* ── HEADER ── */}
//         <HeaderBar>
//           <HeaderInner>
//             <BackBtn onClick={() => navigate(-1)}>
//               <ArrowLeft size={15} /> Back
//             </BackBtn>

//             <HeaderTitle>
//               <Heart size={18} color={C.copper} fill={C.copper} />
//               <h2>My Wishlist</h2>
//               {items.length > 0 && <CountPill>{items.length}</CountPill>}
//             </HeaderTitle>

//             <HeaderActions>
//               {items.length > 0 && (
//                 <>
//                   <IconBtn onClick={() => setShowShare(true)} title="Share wishlist">
//                     <Share2 size={15} />
//                   </IconBtn>
//                   <ClearBtn onClick={handleClearAll}>
//                     <Trash2 size={13} />
//                     {confirmClear ? 'Confirm?' : 'Clear All'}
//                   </ClearBtn>
//                 </>
//               )}
//               <ShopBtn onClick={() => navigate('/ProductsPage')} style={{padding:'0.42rem 1rem',fontSize:'0.78rem',borderRadius:'8px',boxShadow:'none'}}>
//                 <Sparkles size={13} />
//                 Explore
//               </ShopBtn>
//             </HeaderActions>
//           </HeaderInner>
//         </HeaderBar>

//         <Main>
//           {/* UNDO BANNER */}
//           {lastRemoved && (
//             <UndoBar>
//               <span>🗑️ "<strong style={{color:'#fff'}}>{lastRemoved.name}</strong>" removed</span>
//               <UndoBtn onClick={handleUndo}>Undo</UndoBtn>
//             </UndoBar>
//           )}

//           {items.length === 0 ? (
//             /* ── EMPTY STATE ── */
//             <Empty>
//               <EmptyHeart><Heart size={36} /></EmptyHeart>
//               <EmptyTitle>Your wishlist is empty</EmptyTitle>
//               <EmptyText>
//                 Save items you love by tapping the heart icon on any product.
//               </EmptyText>
//               <ShopBtn onClick={() => navigate('/ProductsPage')}>
//                 <ShoppingBag size={16} />
//                 Browse Products
//               </ShopBtn>
//             </Empty>
//           ) : (
//             /* ── GRID ── */
//             <Grid>
//               {items.map((product, i) => {
//                 const isSoldOut = product.soldOut === true || product.inStock === false;
//                 const isAdded   = !!addedIds[product.id];
//                 const isExpanded= !!expanded[product.id];
//                 const saving    = savePct(product.price, product.oldPrice || product.originalPrice);
//                 const needsExp  = needsTruncation(product.name);
//                 const isRemoving= removingId === product.id;

//                 return (
//                   <Card
//                     key={product.id}
//                     $i={i}
//                     className={isRemoving ? 'removing' : ''}
//                     onClick={() => navigate(`/products/${product.id}`)}
//                     style={isRemoving ? { transition: 'opacity 0.28s, transform 0.28s' } : {}}
//                   >
//                     {/* ── IMAGE ── */}
//                     <ImgWrap>
//                       {product.image ? (
//                         <ProductImg
//                           src={product.image}
//                           alt={product.name}
//                           onError={e => { e.target.style.display='none'; }}
//                         />
//                       ) : (
//                         <ImgPlaceholder>🏺</ImgPlaceholder>
//                       )}

//                       {isSoldOut && (
//                         <SoldOverlay><span>Sold Out</span></SoldOverlay>
//                       )}

//                       <RemoveBtn
//                         onClick={e => { e.stopPropagation(); handleRemove(product); }}
//                         title="Remove from wishlist"
//                       >
//                         <X size={13} />
//                       </RemoveBtn>
//                     </ImgWrap>

//                     {/* ── BODY ── */}
//                     <CardBody onClick={e => e.stopPropagation()}>

//                       {/* Name */}
//                       <NameWrap>
//                         <ProductName $expanded={isExpanded}>
//                           {product.name || 'Handcrafted Item'}
//                         </ProductName>
//                         {needsExp && (
//                           <ExpandToggle onClick={e => toggleExpand(e, product.id)}>
//                             {isExpanded
//                               ? <><ChevronUp size={11}/> Less</>
//                               : <><ChevronDown size={11}/> More</>
//                             }
//                           </ExpandToggle>
//                         )}
//                       </NameWrap>

//                       {/* Rating */}
//                       {product.rating && (
//                         <RatingRow>
//                           <div className="stars">{renderStars(product.rating)}</div>
//                           <span>{product.rating} ({product.reviews || 0})</span>
//                         </RatingRow>
//                       )}

//                       {/* Price */}
//                       <PriceRow>
//                         <Price>₹{(product.price || 0).toLocaleString()}</Price>
//                         {(product.oldPrice || product.originalPrice) && (
//                           <OldPrice>₹{(product.oldPrice || product.originalPrice).toLocaleString()}</OldPrice>
//                         )}
//                         {saving && <SaveBadge>{saving}% off</SaveBadge>}
//                       </PriceRow>

//                       {/* Cart Button */}
//                       <CartBtn
//                         $status={isSoldOut ? 'soldout' : isAdded ? 'added' : 'default'}
//                         onClick={e => handleAddToCart(e, product)}
//                       >
//                         {isSoldOut ? (
//                           'Sold Out'
//                         ) : isAdded ? (
//                           <><CheckCircle size={13}/> Added to Cart</>
//                         ) : (
//                           <><ShoppingCart size={13}/> Add to Cart</>
//                         )}
//                       </CartBtn>
//                     </CardBody>
//                   </Card>
//                 );
//               })}
//             </Grid>
//           )}
//         </Main>
//       </Page>
//     </>
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
  Heart, ShoppingCart, X, Share2, Trash2,
  ShoppingBag, ArrowLeft, ChevronDown, ChevronUp,
  CheckCircle, Star, Sparkles
} from 'lucide-react';

const C = {
  copper:     '#B87333',
  copperDark: '#8B5A2B',
  copperLight:'#D4956A',
  brass:      '#C9A44C',
  cream:      '#FDF8F0',
  cream2:     '#FFF6E5',
  dark:       '#2A1408',
  text:       '#3E2723',
  muted:      '#8D6E63',
  border:     '#EDE0D0',
  white:      '#FFFFFF',
  success:    '#2E7D32',
  danger:     '#C62828',
  soldout:    '#9E9E9E',
};

const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const slideDown = keyframes`from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}`;
const toastSlide = keyframes`from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
`;

const Page = styled.div`min-height:100vh;background:${C.cream};font-family:'DM Sans',sans-serif;padding-top:80px;color:${C.text};`;
const HeaderBar = styled.div`background:${C.white};border-bottom:1.5px solid ${C.border};padding:0 2rem;position:sticky;top:80px;z-index:100;box-shadow:0 2px 12px rgba(62,39,35,0.06);`;
const HeaderInner = styled.div`max-width:1200px;margin:auto;height:60px;display:flex;align-items:center;justify-content:space-between;gap:1rem;`;
const BackBtn = styled.button`display:flex;align-items:center;gap:0.45rem;background:none;border:none;color:${C.muted};font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;padding:0.4rem 0;transition:color 0.2s;&:hover{color:${C.copper}}`;
const HeaderTitle = styled.div`display:flex;align-items:center;gap:0.65rem;h2{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:700;color:${C.dark};margin:0;letter-spacing:-0.3px;}`;
const CountPill = styled.span`background:${C.copper};color:#fff;font-size:0.72rem;font-weight:700;padding:2px 9px;border-radius:50px;`;
const HeaderActions = styled.div`display:flex;align-items:center;gap:0.6rem;`;
const ClearBtn = styled.button`display:flex;align-items:center;gap:0.4rem;background:none;border:1.5px solid ${C.border};border-radius:8px;color:${C.danger};font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:600;padding:0.4rem 0.9rem;cursor:pointer;transition:all 0.2s;&:hover{background:rgba(198,40,40,0.05);border-color:${C.danger}}`;
const Main = styled.div`max-width:1200px;margin:auto;padding:2rem;@media(max-width:640px){padding:1rem}`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;@media(max-width:1100px){grid-template-columns:repeat(3,1fr)}@media(max-width:768px){grid-template-columns:repeat(2,1fr)}@media(max-width:480px){grid-template-columns:1fr}`;
const Card = styled.div`background:${C.white};border:1.5px solid ${C.border};border-radius:14px;overflow:hidden;position:relative;transition:all 0.28s cubic-bezier(0.4,0,0.2,1);animation:${fadeUp} 0.42s ease both;animation-delay:${({$i})=>$i*0.06}s;cursor:pointer;&:hover{border-color:${C.copper};box-shadow:0 8px 32px rgba(184,115,51,0.14);transform:translateY(-4px)}&.removing{opacity:0;transform:scale(0.92);pointer-events:none}`;
const ImgWrap = styled.div`position:relative;width:100%;padding-top:100%;background:${C.cream2};overflow:hidden;`;
const ProductImg = styled.img`position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;${Card}:hover &{transform:scale(1.06)}`;
const ImgPlaceholder = styled.div`position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;color:${C.copper};opacity:0.35;background:linear-gradient(135deg,${C.cream2},#FFE0B2);`;
const RemoveBtn = styled.button`position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(255,255,255,0.92);box-shadow:0 2px 8px rgba(0,0,0,0.14);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2;opacity:0;transition:all 0.2s;color:${C.danger};${Card}:hover &{opacity:1}&:hover{background:${C.danger};color:#fff;transform:scale(1.12)}`;
const SoldOverlay = styled.div`position:absolute;inset:0;background:rgba(255,255,255,0.55);backdrop-filter:blur(2px);z-index:1;display:flex;align-items:center;justify-content:center;span{background:${C.soldout};color:#fff;font-size:0.72rem;font-weight:700;padding:5px 14px;border-radius:50px;letter-spacing:1px;text-transform:uppercase}`;
const CardBody = styled.div`padding:0.9rem;`;
const ProductName = styled.p`font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:600;color:${C.dark};margin:0 0 0.1rem;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;`;
const RatingRow = styled.div`display:flex;align-items:center;gap:4px;margin:0.45rem 0 0.5rem;.stars{display:flex;gap:1px}span{font-size:0.72rem;color:${C.muted};font-weight:500}`;
const PriceRow = styled.div`display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap;`;
const Price = styled.span`font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:700;color:${C.copper};line-height:1;`;
const OldPrice = styled.span`font-size:0.8rem;color:${C.soldout};text-decoration:line-through;`;
const SaveBadge = styled.span`font-size:0.68rem;font-weight:700;background:rgba(184,115,51,0.1);color:${C.copper};padding:1px 7px;border-radius:50px;border:1px solid rgba(184,115,51,0.2);`;
const CartBtn = styled.button`width:100%;border:none;border-radius:8px;padding:0.68rem;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;cursor:pointer;transition:all 0.22s;display:flex;align-items:center;justify-content:center;gap:0.4rem;${({$status})=>{switch($status){case 'added':return`background:${C.success};color:#fff;`;case 'soldout':return`background:#F5F5F5;color:${C.soldout};cursor:not-allowed;pointer-events:none`;default:return`background:linear-gradient(135deg,${C.copper},${C.copperDark});color:#fff;box-shadow:0 3px 12px rgba(184,115,51,0.28);&:hover{transform:translateY(-1px)}`}}}`;
const Empty = styled.div`text-align:center;padding:80px 24px 60px;animation:${fadeUp} 0.5s ease;`;
const EmptyHeart = styled.div`width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,${C.cream2},#FFE0B2);border:2px solid ${C.border};display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;svg{color:${C.copper};opacity:0.6}`;
const EmptyTitle = styled.h3`font-family:'Cormorant Garamond',serif;font-size:1.75rem;font-weight:700;color:${C.dark};margin:0 0 0.6rem;`;
const EmptyText = styled.p`color:${C.muted};font-size:0.92rem;margin:0 auto 2rem;max-width:320px;line-height:1.65;`;
const ShopBtn = styled.button`background:linear-gradient(135deg,${C.copper},${C.copperDark});color:#fff;border:none;padding:0.85rem 2.2rem;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:0.92rem;font-weight:700;cursor:pointer;transition:all 0.25s;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 16px rgba(184,115,51,0.32);&:hover{transform:translateY(-2px)}`;
const UndoBar = styled.div`background:${C.dark};border-radius:10px;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;animation:${slideDown} 0.3s ease;span{color:rgba(255,255,255,0.82);font-size:0.84rem}`;
const UndoBtn = styled.button`background:rgba(184,115,51,0.25);border:1px solid rgba(184,115,51,0.45);color:${C.brass};font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:700;padding:5px 14px;border-radius:6px;cursor:pointer;&:hover{background:rgba(184,115,51,0.4)}`;
const ToastStack = styled.div`position:fixed;top:96px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;`;
const Toast = styled.div`background:${({$t})=>$t==='success'?C.success:$t==='danger'?C.danger:C.copper};color:#fff;padding:11px 18px;border-radius:10px;font-size:0.82rem;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 6px 20px rgba(0,0,0,0.18);animation:${toastSlide} 0.32s ease;max-width:280px;`;

/* ─────────────────────────────────────────────
   STORAGE HELPERS
   ✅ WL_KEY matches wishlistUtils.js = 'songir_wishlist'
   ✅ getWishlistItems() filters out raw ID strings
      — only returns full product objects with 'name'
───────────────────────────────────────────── */
const WL_KEY = 'songir_wishlist';
const BASE_URL = "http://localhost:5000";

function getImageUrl(img) {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${BASE_URL}/${img}`;
}

// ✅ CRITICAL FIX: filter out raw string IDs like "69a9b48a..."
// Only keep entries that are full objects with a name property
function getWishlistItems() {
  try {
    const all = JSON.parse(localStorage.getItem(WL_KEY) || '[]');
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

// Remove one item by ID — keeps raw ID entries untouched
function removeWishlistItem(id) {
  try {
    const all = JSON.parse(localStorage.getItem(WL_KEY) || '[]');
    const updated = all.filter(item => {
      if (typeof item === 'string' || typeof item === 'number') return true; // keep raw ids
      return String(item._id || item.id) !== String(id);
    });
    localStorage.setItem(WL_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    // return only display-able items
    return updated.filter(item => item !== null && typeof item === 'object' && item.name);
  } catch {
    return [];
  }
}

// Restore a removed item
function restoreWishlistItem(item) {
  try {
    const all = JSON.parse(localStorage.getItem(WL_KEY) || '[]');
    const id = String(item._id || item.id);
    const exists = all.find(i =>
      typeof i === 'object' && String(i._id || i.id) === id
    );
    if (!exists) {
      localStorage.setItem(WL_KEY, JSON.stringify([item, ...all]));
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    }
  } catch {}
}

// Clear all full-object entries (keep raw ids)
function clearWishlistObjects() {
  try {
    const all = JSON.parse(localStorage.getItem(WL_KEY) || '[]');
    const rawOnly = all.filter(item => typeof item === 'string' || typeof item === 'number');
    localStorage.setItem(WL_KEY, JSON.stringify(rawOnly));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  } catch {}
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function WishlistPage({ addToCart }) {
  const navigate = useNavigate();

  const [items,        setItems]        = useState([]);
  const [removingId,   setRemovingId]   = useState(null);
  const [lastRemoved,  setLastRemoved]  = useState(null);
  const [undoTimeout,  setUndoTimeout]  = useState(null);
  const [addedIds,     setAddedIds]     = useState({});
  const [toasts,       setToasts]       = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = useCallback(() => {
    setItems(getWishlistItems());
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('wishlistUpdated', load);
    return () => window.removeEventListener('wishlistUpdated', load);
  }, [load]);

  const showToast = (msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
  };

  const handleRemove = (product) => {
    const pid = String(product._id || product.id);
    setRemovingId(pid);
    setTimeout(() => {
      const updated = removeWishlistItem(pid);
      setItems(updated);
      setRemovingId(null);
      setLastRemoved(product);
      if (undoTimeout) clearTimeout(undoTimeout);
      const t = setTimeout(() => setLastRemoved(null), 6000);
      setUndoTimeout(t);
    }, 280);
  };

  const handleUndo = () => {
    if (!lastRemoved) return;
    restoreWishlistItem(lastRemoved);
    load();
    setLastRemoved(null);
    if (undoTimeout) clearTimeout(undoTimeout);
    showToast('Item restored ❤️');
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const isSoldOut = product.soldOut === true || product.inStock === false;
    if (isSoldOut) return;
    if (addToCart) {
      addToCart({
        ...product,
        id: product._id || product.id,
        originalPrice: product.oldPrice || product.originalPrice || product.price + 300,
      });
    }
    const pid = String(product._id || product.id);
    setAddedIds(p => ({ ...p, [pid]: true }));
    showToast('Added to cart 🛒');
    setTimeout(() => setAddedIds(p => { const n = {...p}; delete n[pid]; return n; }), 2500);
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearWishlistObjects();
    setItems([]);
    setConfirmClear(false);
    showToast('Wishlist cleared', 'danger');
  };

  const renderStars = (rating = 4.5) =>
    [1,2,3,4,5].map(s => (
      <Star key={s} size={10}
        fill={s <= Math.round(rating) ? '#F9A825' : 'none'}
        color={s <= Math.round(rating) ? '#F9A825' : '#DDD'}
      />
    ));

  const savePct = (price, oldPrice) =>
    oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return (
    <>
      <GlobalStyle />

      <ToastStack>
        {toasts.map(t => <Toast key={t.id} $t={t.type}>{t.msg}</Toast>)}
      </ToastStack>

      <Page>
        <HeaderBar>
          <HeaderInner>
            <BackBtn onClick={() => navigate(-1)}>
              <ArrowLeft size={15} /> Back
            </BackBtn>

            <HeaderTitle>
              <Heart size={18} color={C.copper} fill={C.copper} />
              <h2>My Wishlist</h2>
              {items.length > 0 && <CountPill>{items.length}</CountPill>}
            </HeaderTitle>

            <HeaderActions>
              {items.length > 0 && (
                <ClearBtn onClick={handleClearAll}>
                  <Trash2 size={13} />
                  {confirmClear ? 'Confirm?' : 'Clear All'}
                </ClearBtn>
              )}
              <ShopBtn
                onClick={() => navigate('/ProductsPage')}
                style={{padding:'0.42rem 1rem',fontSize:'0.78rem',borderRadius:'8px',boxShadow:'none'}}
              >
                <Sparkles size={13} /> Explore
              </ShopBtn>
            </HeaderActions>
          </HeaderInner>
        </HeaderBar>

        <Main>
          {lastRemoved && (
            <UndoBar>
              <span>🗑️ "<strong style={{color:'#fff'}}>{lastRemoved.name}</strong>" removed</span>
              <UndoBtn onClick={handleUndo}>Undo</UndoBtn>
            </UndoBar>
          )}

          {items.length === 0 ? (
            <Empty>
              <EmptyHeart><Heart size={36} /></EmptyHeart>
              <EmptyTitle>Your wishlist is empty</EmptyTitle>
              <EmptyText>
                Tap the ❤️ heart icon on any product to save it here.
              </EmptyText>
              <ShopBtn onClick={() => navigate('/ProductsPage')}>
                <ShoppingBag size={16} /> Browse Products
              </ShopBtn>
            </Empty>
          ) : (
            <Grid>
              {items.map((product, i) => {
                const pid       = String(product._id || product.id);
                const imageUrl  = getImageUrl(product.image);
                const isSoldOut = product.soldOut === true || product.inStock === false;
                const isAdded   = !!addedIds[pid];
                const isRemoving= removingId === pid;
                const oldPrice  = product.oldPrice || product.originalPrice || null;
                const saving    = savePct(product.price, oldPrice);

                return (
                  <Card
                    key={pid}
                    $i={i}
                    className={isRemoving ? 'removing' : ''}
                    onClick={() => navigate('/ProductDetail', { state: { product } })}
                  >
                    <ImgWrap>
                      {imageUrl
                        ? <ProductImg src={imageUrl} alt={product.name}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        : <ImgPlaceholder>🏺</ImgPlaceholder>
                      }
                      {isSoldOut && <SoldOverlay><span>Sold Out</span></SoldOverlay>}
                      <RemoveBtn
                        onClick={e => { e.stopPropagation(); handleRemove(product); }}
                        title="Remove from wishlist"
                      >
                        <X size={13} />
                      </RemoveBtn>
                    </ImgWrap>

                    <CardBody onClick={e => e.stopPropagation()}>
                      <ProductName>{product.name}</ProductName>

                      {product.rating && (
                        <RatingRow>
                          <div className="stars">{renderStars(product.rating)}</div>
                          <span>{product.rating} ({product.reviews || 0})</span>
                        </RatingRow>
                      )}

                      <PriceRow>
                        <Price>₹{(product.price || 0).toLocaleString()}</Price>
                        {oldPrice && <OldPrice>₹{oldPrice.toLocaleString()}</OldPrice>}
                        {saving && <SaveBadge>{saving}% off</SaveBadge>}
                      </PriceRow>

                      <CartBtn
                        $status={isSoldOut ? 'soldout' : isAdded ? 'added' : 'default'}
                        onClick={e => handleAddToCart(e, product)}
                      >
                        {isSoldOut
                          ? 'Sold Out'
                          : isAdded
                            ? <><CheckCircle size={13}/> Added to Cart</>
                            : <><ShoppingCart size={13}/> Add to Cart</>
                        }
                      </CartBtn>
                    </CardBody>
                  </Card>
                );
              })}
            </Grid>
          )}
        </Main>
      </Page>
    </>
  );
}