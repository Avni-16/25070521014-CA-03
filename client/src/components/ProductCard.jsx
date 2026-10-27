import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Standard', 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const imageSrc = product.images && product.images[0] ? product.images[0] : '/images/placeholder-sock.jpg';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-dark)',
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color var(--transition-normal), transform var(--transition-normal)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} style={{ display: 'block', overflow: 'hidden', position: 'relative' }}>
        {/* Product Image Container */}
        <div
          style={{
            width: '100%',
            paddingTop: '130%', // Portrait fashion aspect ratio
            position: 'relative',
            backgroundColor: '#1E1B18',
            overflow: 'hidden'
          }}
        >
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform var(--transition-slow)'
            }}
          />

          {/* Badges Overlay */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
            {hasDiscount && (
              <span className="badge badge-discount">
                {product.discountBadge || `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
              </span>
            )}
            {product.movieReference && (
              <span className="badge badge-dark" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>
                {product.movieReference}
              </span>
            )}
          </div>

          {/* Stock Notice Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 2 }}>
              <span className="badge" style={{ backgroundColor: 'rgba(217, 160, 91, 0.9)', color: '#10100F' }}>
                Only {product.stock} Left
              </span>
            </div>
          )}
          {product.stock <= 0 && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(16, 16, 15, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
              <span className="badge" style={{ backgroundColor: 'var(--status-error)', color: '#fff', padding: '8px 16px', fontSize: '0.8rem' }}>
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Details Area */}
        <div style={{ padding: '16px 14px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {product.collection}
          </p>

          <h3
            style={{
              fontSize: '0.98rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '8px',
              minHeight: '2.4em',
              lineHeight: 1.3
            }}
          >
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: 'auto' }}>
            <span style={{ fontSize: '1.05rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
              ₹{product.price}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Full-width Quick Add Button */}
      <div style={{ padding: '0 12px 12px' }}>
        <button
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          className="btn"
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: added ? 'var(--status-success)' : 'transparent',
            color: added ? '#fff' : 'var(--text-primary)',
            border: added ? '1px solid var(--status-success)' : '1px solid var(--border-dark)',
            fontSize: '0.76rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            if (!added && product.stock > 0) {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.color = 'var(--accent-gold)';
              e.currentTarget.style.backgroundColor = 'var(--accent-gold-dim)';
            }
          }}
          onMouseLeave={(e) => {
            if (!added && product.stock > 0) {
              e.currentTarget.style.borderColor = 'var(--border-dark)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {added ? (
            <>
              <Check size={16} /> Added to Bag
            </>
          ) : product.stock <= 0 ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag size={14} /> Quick Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
