import React from 'react';
import { Heart, Eye } from 'lucide-react';

const ProductCard = ({
  product,
  index,
  onViewProduct,
  wishlist,
  onToggleWishlist
}) => {
  return (
    <div
      className="card"
      onClick={() => onViewProduct(product)}
      style={{
        cursor: 'pointer',
        animation: `fadeInUp 0.5s ease-out ${index * 0.03}s both`,
        position: 'relative'
      }}
    >
      <div style={{
        height: '240px',
        background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.15) 0%, rgba(201, 164, 76, 0.08) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '7rem',
        borderBottom: '1px solid rgba(201, 164, 76, 0.2)',
        position: 'relative'
      }}>
        {product.image}
        
        {product.discount && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'linear-gradient(135deg, #DC143C, #C41E3A)',
            color: '#FFF6E5',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(220, 20, 60, 0.4)'
          }}>
            {product.discount}% OFF
          </div>
        )}

        {!product.inStock && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#FFF6E5',
            fontWeight: 700
          }}>
            Out of Stock
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: wishlist?.includes(product.id)
              ? 'rgba(220, 20, 60, 0.2)'
              : 'rgba(62, 39, 35, 0.8)',
            border: wishlist?.includes(product.id)
              ? '2px solid rgba(220, 20, 60, 0.5)'
              : '2px solid rgba(201, 164, 76, 0.4)',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart 
            size={22} 
            fill={wishlist?.includes(product.id) ? '#DC143C' : 'none'}
            color={wishlist?.includes(product.id) ? '#DC143C' : '#C9A44C'}
          />
        </button>
      </div>

      <div style={{ padding: '1.8rem' }}>
        <span style={{
          background: 'rgba(201, 164, 76, 0.15)',
          color: '#C9A44C',
          padding: '0.4rem 1rem',
          borderRadius: '15px',
          fontSize: '0.8rem',
          fontWeight: 700,
          border: '1px solid rgba(201, 164, 76, 0.3)',
          letterSpacing: '0.5px'
        }}>
          {product.category}
        </span>

        <h4 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#FFF6E5',
          margin: '1.2rem 0 0.5rem',
          letterSpacing: '-0.3px',
          fontFamily: 'Playfair Display, serif'
        }}>
          {product.name}
        </h4>

        {product.artisan && (
          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 246, 229, 0.7)',
            marginBottom: '1rem'
          }}>
            by {product.artisan}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.2rem'
        }}>
          <p style={{
            fontSize: '2rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #C9A44C, #B87333)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            ₹{product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price}
          </p>
          {product.discount && (
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 246, 229, 0.5)',
              textDecoration: 'line-through',
              margin: 0
            }}>
              ₹{product.price}
            </p>
          )}
        </div>

        <button
          className="btn-primary"
          style={{
            width: '100%',
            opacity: product.inStock ? 1 : 0.5,
            cursor: product.inStock ? 'pointer' : 'not-allowed'
          }}
          disabled={!product.inStock}
          onClick={(e) => {
            e.stopPropagation();
            if (product.inStock) {
              onViewProduct(product);
            }
          }}
        >
          <Eye size={20} />
          {product.inStock ? 'View Details' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;