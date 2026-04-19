// import React from 'react';
// import styled, { keyframes } from 'styled-components';
// import { X, ShoppingCart, Heart, CheckCircle, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

// /* ===== ANIMATIONS ===== */
// const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
// const scaleIn = keyframes`from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}`;

// /* ===== STYLED COMPONENTS ===== */
// const QVOverlay = styled.div`
//   position:fixed;inset:0;z-index:3000;display:${({$o})=>$o?'flex':'none'};
//   align-items:center;justify-content:center;padding:1rem;
//   animation:${fadeIn} 0.18s ease;
// `;

// const QVBg = styled.div`
//   position:absolute;inset:0;background:rgba(10,3,0,0.8);backdrop-filter:blur(6px);
// `;

// const QVBox = styled.div`
//   position:relative;z-index:1;background:#fff;border-radius:18px;
//   box-shadow:0 32px 80px rgba(10,4,0,0.4);
//   display:grid;grid-template-columns:1fr 1fr;width:100%;max-width:820px;
//   overflow:hidden;animation:${scaleIn} 0.24s cubic-bezier(0.4,0,0.2,1);
//   @media(max-width:600px){grid-template-columns:1fr;max-height:90vh;overflow-y:auto}
// `;

// const QVImgSide = styled.div`
//   position:relative;background:${({$bg})=>$bg||'#f5ede0'};min-height:340px;
//   display:flex;align-items:center;justify-content:center;
//   @media(max-width:600px){min-height:220px}
// `;

// const QVImage = styled.img`
//   width:100%;height:100%;object-fit:cover;position:absolute;inset:0;
// `;

// const QVDiscBadge = styled.div`
//   position:absolute;top:12px;left:12px;background:linear-gradient(135deg,#E05A1A,#c04010);
//   color:#fff;font-size:0.65rem;font-weight:800;padding:3px 10px;border-radius:7px;
// `;

// const QVClose = styled.button`
//   position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;
//   background:rgba(255,255,255,0.92);border:none;cursor:pointer;
//   display:flex;align-items:center;justify-content:center;color:#3E2713;
//   box-shadow:0 2px 10px rgba(0,0,0,0.2);transition:all 0.2s;z-index:2;
//   &:hover{background:#fff;transform:scale(1.08)}
// `;

// const QVDetails = styled.div`
//   padding:1.5rem;display:flex;flex-direction:column;gap:0.7rem;overflow-y:auto;
// `;

// const QVCatBadge = styled.div`
//   display:inline-flex;align-items:center;gap:0.3rem;background:rgba(201,148,61,0.09);
//   border:1px solid rgba(184,118,46,0.2);color:#9f5e1a;font-size:0.65rem;font-weight:700;
//   padding:3px 9px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;width:fit-content;
// `;

// const QVName = styled.h2`
//   font-family:'Georgia',serif;font-size:1.18rem;font-weight:700;
//   color:#1a0905;margin:0;line-height:1.35;
// `;

// const QVPriceRow = styled.div`
//   display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;
// `;

// const QVPrice = styled.span`
//   font-size:1.5rem;font-weight:800;color:#9f5e1a;font-family:'Georgia',serif;
// `;

// const QVOld = styled.span`
//   font-size:0.9rem;color:#bda98a;text-decoration:line-through;
// `;

// const QVSave = styled.span`
//   background:#fff3e0;color:#e65100;font-size:0.65rem;font-weight:800;
//   padding:2px 8px;border-radius:8px;border:1px solid rgba(230,81,0,0.18);
// `;

// const QVShopRow = styled.div`
//   display:flex;align-items:center;gap:0.4rem;color:#9e7a5a;font-size:0.76rem;
//   svg{color:#C9943D;flex-shrink:0}
//   span{font-weight:600;color:#6b3d12}
// `;

// const QVStockBadge = styled.div`
//   display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;font-weight:700;
//   padding:3px 10px;border-radius:10px;
//   ${({$in})=>$in
//     ? 'background:#e8f5e9;color:#2E7D32;border:1px solid rgba(46,125,50,0.2)'
//     : 'background:#fce4ec;color:#c62828;border:1px solid rgba(198,40,40,0.2)'}
//   width:fit-content;
// `;

// const QVDivider = styled.div`
//   height:1px;background:rgba(184,118,46,0.1);
// `;

// const QVWishRow = styled.div`
//   display:flex;align-items:center;justify-content:space-between;
// `;

// const QVWishBtn = styled.button`
//   background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:0.35rem;
//   color:${({$active})=>$active?'#E05A1A':'#bda98a'};font-size:0.76rem;font-weight:600;
//   font-family:inherit;transition:all 0.2s;padding:0.25rem 0;
//   svg{transition:all 0.2s;fill:${({$active})=>$active?'#E05A1A':'none'}}
//   &:hover{color:#E05A1A;svg{fill:#E05A1A}}
// `;

// const QVActions = styled.div`
//   display:flex;flex-direction:column;gap:0.55rem;margin-top:auto;
// `;

// const QVAddCart = styled.button`
//   background:linear-gradient(135deg,#C9943D,#9f5e1a);border:none;color:#fff;
//   padding:0.7rem 1.2rem;border-radius:10px;font-size:0.88rem;font-weight:700;
//   cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.45rem;
//   font-family:inherit;transition:all 0.25s;box-shadow:0 4px 14px rgba(201,148,61,0.35);
//   &:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,148,61,0.45)}
//   &:disabled{opacity:0.55;cursor:not-allowed;transform:none}
// `;

// const QVViewFull = styled.button`
//   background:transparent;border:1.5px solid rgba(184,118,46,0.35);color:#9f5e1a;
//   padding:0.62rem 1.2rem;border-radius:10px;font-size:0.84rem;font-weight:600;
//   cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.4rem;
//   font-family:inherit;transition:all 0.25s;
//   &:hover{background:rgba(184,118,46,0.06);border-color:rgba(184,118,46,0.6);color:#7a4a0a}
// `;

// /* ===== COMPONENT ===== */
// const QuickViewModal = ({
//   product,
//   isOpen,
//   onClose,
//   onAddToCart,
//   onViewFullDetails,
//   onToggleWishlist,
//   isWishlisted
// }) => {
//   if (!product) return null;

//   const handleAddToCart = () => {
//     onAddToCart(product);
//     onClose();
//   };

//   return (
//     <QVOverlay $o={isOpen}>
//       <QVBg onClick={onClose} />
//       <QVBox>
//         <QVImgSide $bg={product.bg || '#f5ede0'}>
//           <QVImage src={product.image} alt={product.name} />
//           {product.discount && <QVDiscBadge>{product.discount}</QVDiscBadge>}
//           <QVClose onClick={onClose}><X size={15}/></QVClose>
//         </QVImgSide>
//         <QVDetails>
//           <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.4rem'}}>
//             <QVCatBadge>
//               {product.subCategory ? <><Sparkles size={10}/> {product.subCategory}</> : product.category}
//             </QVCatBadge>
//             <QVStockBadge $in={product.inStock}>
//               {product.inStock ? <><CheckCircle size={10}/> In Stock</> : '⚠ Out of Stock'}
//             </QVStockBadge>
//           </div>

//           <QVName>{product.name}</QVName>

//           <QVPriceRow>
//             <QVPrice>₹{product.price?.toLocaleString('en-IN')}</QVPrice>
//             {product.oldPrice && <QVOld>₹{product.oldPrice.toLocaleString('en-IN')}</QVOld>}
//             {product.discount && <QVSave>{product.discount}</QVSave>}
//           </QVPriceRow>

//           {product.shop && (
//             <QVShopRow>
//               <ShoppingBag size={13}/>
//               Sold by <span>{product.shop}</span>
//             </QVShopRow>
//           )}

//           <QVDivider/>

//           <QVWishRow>
//             <QVWishBtn $active={isWishlisted} onClick={() => onToggleWishlist(product)}>
//               <Heart size={14}/> {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
//             </QVWishBtn>
//             <span style={{fontSize:'0.67rem',color:'#bda98a'}}>Click to {isWishlisted ? 'remove' : 'save'}</span>
//           </QVWishRow>

//           <QVActions>
//             <QVAddCart onClick={handleAddToCart} disabled={!product.inStock}>
//               <ShoppingCart size={16}/>
//               {product.inStock ? 'Add to Cart' : 'Out of Stock'}
//             </QVAddCart>
//             <QVViewFull onClick={() => onViewFullDetails(product)}>
//               View Full Details <ArrowRight size={14}/>
//             </QVViewFull>
//           </QVActions>
//         </QVDetails>
//       </QVBox>
//     </QVOverlay>
//   );
// };

// export default QuickViewModal;















import React from 'react';
import styled, { keyframes } from 'styled-components';
import { X, ShoppingCart, Heart, CheckCircle, Sparkles, ShoppingBag, ArrowRight, FileText, GitCompare } from 'lucide-react';

/* ===== ANIMATIONS ===== */
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}`;

/* ===== STYLED COMPONENTS ===== */
const QVOverlay = styled.div`
  position:fixed;inset:0;z-index:3000;display:${({$o})=>$o?'flex':'none'};
  align-items:center;justify-content:center;padding:1rem;
  animation:${fadeIn} 0.18s ease;
`;

const QVBg = styled.div`
  position:absolute;inset:0;background:rgba(10,3,0,0.8);backdrop-filter:blur(6px);
`;

const QVBox = styled.div`
  position:relative;z-index:1;background:#fff;border-radius:18px;
  box-shadow:0 32px 80px rgba(10,4,0,0.4);
  display:grid;grid-template-columns:1fr 1fr;width:100%;max-width:860px;
  max-height:90vh;overflow:hidden;
  animation:${scaleIn} 0.24s cubic-bezier(0.4,0,0.2,1);
  @media(max-width:600px){grid-template-columns:1fr;max-height:92vh;overflow-y:auto}
`;

const QVImgSide = styled.div`
  position:relative;background:${({$bg})=>$bg||'#f5ede0'};min-height:420px;
  display:flex;align-items:center;justify-content:center;
  @media(max-width:600px){min-height:240px}
`;

const QVImage = styled.img`
  width:100%;height:100%;object-fit:cover;position:absolute;inset:0;
`;

const QVDiscBadge = styled.div`
  position:absolute;top:12px;left:12px;background:linear-gradient(135deg,#E05A1A,#c04010);
  color:#fff;font-size:0.65rem;font-weight:800;padding:3px 10px;border-radius:7px;
`;

const QVClose = styled.button`
  position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;
  background:rgba(255,255,255,0.92);border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;color:#3E2713;
  box-shadow:0 2px 10px rgba(0,0,0,0.2);transition:all 0.2s;z-index:2;
  &:hover{background:#fff;transform:scale(1.08)}
`;

const QVDetails = styled.div`
  padding:1.5rem;display:flex;flex-direction:column;gap:0.65rem;
  overflow-y:auto;max-height:90vh;
`;

const QVCatBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.3rem;background:rgba(201,148,61,0.09);
  border:1px solid rgba(184,118,46,0.2);color:#9f5e1a;font-size:0.65rem;font-weight:700;
  padding:3px 9px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;width:fit-content;
`;

const QVName = styled.h2`
  font-family:'Georgia',serif;font-size:1.25rem;font-weight:700;
  color:#1a0905;margin:0;line-height:1.35;
`;

const QVPriceRow = styled.div`
  display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;
`;

const QVPrice = styled.span`
  font-size:1.5rem;font-weight:800;color:#9f5e1a;font-family:'Georgia',serif;
`;

const QVOld = styled.span`
  font-size:0.9rem;color:#bda98a;text-decoration:line-through;
`;

const QVSave = styled.span`
  background:#fff3e0;color:#e65100;font-size:0.65rem;font-weight:800;
  padding:2px 8px;border-radius:8px;border:1px solid rgba(230,81,0,0.18);
`;

const QVShopRow = styled.div`
  display:flex;align-items:center;gap:0.4rem;color:#9e7a5a;font-size:0.76rem;
  svg{color:#C9943D;flex-shrink:0}
  span{font-weight:600;color:#6b3d12}
`;

const QVStockBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;font-weight:700;
  padding:3px 10px;border-radius:10px;
  ${({$in})=>$in
    ? 'background:#e8f5e9;color:#2E7D32;border:1px solid rgba(46,125,50,0.2)'
    : 'background:#fce4ec;color:#c62828;border:1px solid rgba(198,40,40,0.2)'}
  width:fit-content;
`;

const QVDivider = styled.div`
  height:1px;background:rgba(184,118,46,0.1);
`;

const QVWishRow = styled.div`
  display:flex;align-items:center;justify-content:space-between;
`;

const QVWishBtn = styled.button`
  background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:0.35rem;
  color:${({$active})=>$active?'#E05A1A':'#bda98a'};font-size:0.76rem;font-weight:600;
  font-family:inherit;transition:all 0.2s;padding:0.25rem 0;
  svg{transition:all 0.2s;fill:${({$active})=>$active?'#E05A1A':'none'}}
  &:hover{color:#E05A1A;svg{fill:#E05A1A}}
`;

const QVActions = styled.div`
  display:flex;flex-direction:column;gap:0.5rem;margin-top:0.3rem;
`;

/* Primary gold button */
const QVBtnPrimary = styled.button`
  background:linear-gradient(135deg,#C9943D,#9f5e1a);border:none;color:#fff;
  padding:0.72rem 1.2rem;border-radius:10px;font-size:0.88rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.45rem;
  font-family:inherit;transition:all 0.25s;box-shadow:0 4px 14px rgba(201,148,61,0.35);
  &:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,148,61,0.45)}
  &:disabled{opacity:0.55;cursor:not-allowed;transform:none}
`;

/* Secondary filled (lighter gold) */
const QVBtnSecondary = styled.button`
  background:linear-gradient(135deg,#d4a04a,#b07828);border:none;color:#fff;
  padding:0.68rem 1.2rem;border-radius:10px;font-size:0.86rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.45rem;
  font-family:inherit;transition:all 0.25s;box-shadow:0 3px 10px rgba(180,120,40,0.3);
  &:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(180,120,40,0.4)}
`;

/* Tertiary filled (dark amber) */
const QVBtnTertiary = styled.button`
  background:linear-gradient(135deg,#b86820,#8f4e10);border:none;color:#fff;
  padding:0.68rem 1.2rem;border-radius:10px;font-size:0.86rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.45rem;
  font-family:inherit;transition:all 0.25s;box-shadow:0 3px 10px rgba(140,78,20,0.3);
  &:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(140,78,20,0.4)}
`;

/* Outline button */
const QVBtnOutline = styled.button`
  background:transparent;border:1.5px solid rgba(184,118,46,0.35);color:#9f5e1a;
  padding:0.62rem 1.2rem;border-radius:10px;font-size:0.84rem;font-weight:600;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.4rem;
  font-family:inherit;transition:all 0.25s;
  &:hover{background:rgba(184,118,46,0.06);border-color:rgba(184,118,46,0.6);color:#7a4a0a}
`;

/* ===== COMPONENT ===== */
const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onViewFullDetails,
  onToggleWishlist,
  onGetQuote,
  isWishlisted
}) => {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  const discount = product.discount ||
    (product.oldPrice && product.price
      ? `${Math.round((1 - product.price / product.oldPrice) * 100)}% OFF`
      : null);

  return (
    <QVOverlay $o={isOpen}>
      <QVBg onClick={onClose} />
      <QVBox>

        {/* ── Image Side ── */}
        <QVImgSide $bg={product.bg || '#f5ede0'}>
          <QVImage src={product.image} alt={product.name} />
          {discount && <QVDiscBadge>{discount}</QVDiscBadge>}
          <QVClose onClick={onClose}><X size={15}/></QVClose>
        </QVImgSide>

        {/* ── Details Side ── */}
        <QVDetails>

          {/* Top row: category + stock */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.4rem'}}>
            <QVCatBadge>
              {product.subCategory ? <><Sparkles size={10}/> {product.subCategory}</> : product.category}
            </QVCatBadge>
            <QVStockBadge $in={product.inStock}>
              {product.inStock ? <><CheckCircle size={10}/> In Stock</> : '⚠ Out of Stock'}
            </QVStockBadge>
          </div>

          {/* Name */}
          <QVName>{product.name}</QVName>

          {/* Rating */}
          {product.rating > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
              <span style={{color:'#f59e0b',fontSize:'0.85rem'}}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}</span>
              <span style={{color:'#9e7a5a',fontSize:'0.75rem'}}>{product.rating} ({product.reviews || 0} reviews)</span>
            </div>
          )}

          {/* Meta grid */}
          {(product.material || product.weight || product.shopName || product.shop) && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
              {product.material && (
                <div style={{background:'#fdf8f0',borderRadius:'8px',padding:'0.4rem 0.6rem'}}>
                  <div style={{fontSize:'0.62rem',color:'#bda98a',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>MATERIAL</div>
                  <div style={{fontSize:'0.8rem',color:'#3E2713',fontWeight:600}}>{product.material}</div>
                </div>
              )}
              {product.weight && (
                <div style={{background:'#fdf8f0',borderRadius:'8px',padding:'0.4rem 0.6rem'}}>
                  <div style={{fontSize:'0.62rem',color:'#bda98a',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>WEIGHT</div>
                  <div style={{fontSize:'0.8rem',color:'#3E2713',fontWeight:600}}>{product.weight}</div>
                </div>
              )}
              {(product.shopName || product.shop) && (
                <div style={{background:'#fdf8f0',borderRadius:'8px',padding:'0.4rem 0.6rem'}}>
                  <div style={{fontSize:'0.62rem',color:'#bda98a',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>SHOP</div>
                  <div style={{fontSize:'0.8rem',color:'#3E2713',fontWeight:600}}>{product.shopName || product.shop}</div>
                </div>
              )}
              <div style={{background:'#fdf8f0',borderRadius:'8px',padding:'0.4rem 0.6rem'}}>
                <div style={{fontSize:'0.62rem',color:'#bda98a',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>AVAILABILITY</div>
                <div style={{fontSize:'0.8rem',color: product.inStock ? '#2E7D32' : '#c62828',fontWeight:600}}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          <QVPriceRow>
            <QVPrice>₹{product.price?.toLocaleString('en-IN')}</QVPrice>
            {product.oldPrice && <QVOld>₹{product.oldPrice.toLocaleString('en-IN')}</QVOld>}
            {discount && <QVSave>{discount}</QVSave>}
          </QVPriceRow>

          {/* Description */}
          {product.description && (
            <p style={{fontSize:'0.78rem',color:'#7a5a3a',margin:0,lineHeight:1.5}}>
              {product.description}
            </p>
          )}

          <QVDivider/>

          {/* Wishlist row */}
          <QVWishRow>
            <QVWishBtn $active={isWishlisted} onClick={() => onToggleWishlist(product)}>
              <Heart size={14}/> {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </QVWishBtn>
            <span style={{fontSize:'0.67rem',color:'#bda98a'}}>Click to {isWishlisted ? 'remove' : 'save'}</span>
          </QVWishRow>

          {/* ── All Action Buttons ── */}
          <QVActions>
            <QVBtnPrimary onClick={handleAddToCart} disabled={!product.inStock}>
              <ShoppingCart size={16}/>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </QVBtnPrimary>

            <QVBtnSecondary onClick={() => onToggleWishlist(product)}>
              <Heart size={15} fill={isWishlisted ? '#fff' : 'none'}/>
              {isWishlisted ? '❤ Remove from Wishlist' : '♡ Add To Wishlist'}
            </QVBtnSecondary>

            {onGetQuote && (
              <QVBtnTertiary onClick={() => { onGetQuote(product); onClose(); }}>
                <FileText size={15}/>
                Get a Custom Quote
              </QVBtnTertiary>
            )}

            <QVBtnOutline onClick={() => onViewFullDetails(product)}>
              <span>🔍</span> View Full Details <ArrowRight size={14}/>
            </QVBtnOutline>
          </QVActions>

        </QVDetails>
      </QVBox>
    </QVOverlay>
  );
};

export default QuickViewModal;