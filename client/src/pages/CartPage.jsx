import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();

  const threshold = 999;
  const diff = Math.max(0, threshold - cart.subtotal);
  const discount = promoApplied ? Math.round(cart.subtotal * 0.1 * 100) / 100 : 0;
  const shipping = cart.isFreeShipping ? 0 : 99;
  const total = Math.max(0, cart.subtotal - discount + shipping);

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SOCKTALES10' || promoCode.trim().toUpperCase() === 'FLAME') {
      setPromoApplied(true);
    } else {
      alert('Invalid promotional code. Try SOCKTALES10.');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <ShoppingBag size={56} style={{ color: 'var(--text-muted)', margin: '0 auto 20px', opacity: 0.4 }} />
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
          YOUR SHOPPING BAG IS EMPTY
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 32px' }}>
          Your bespoke sock curation awaits. Explore our signature Movie-Inspired, Dark Stories, and Formal series.
        </p>
        <Link to="/shop" className="btn btn-primary">
          EXPLORE THE CATALOGUE <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 100px' }}>
      <div style={{ marginBottom: '36px' }}>
        <span className="section-subtitle">CURRENT CURATION</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--text-primary)' }}>
          SHOPPING BAG ({cart.totalItems} ITEMS)
        </h1>
      </div>

      {/* Free Shipping Alert Box */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '16px 24px', borderRadius: '2px', marginBottom: '32px' }}>
        <p style={{ fontSize: '0.86rem', color: cart.isFreeShipping ? 'var(--status-success)' : 'var(--text-primary)' }}>
          {cart.isFreeShipping ? (
            <span>✦ <strong>Free Worldwide Shipping</strong> is applied to your order!</span>
          ) : (
            <span>Add <strong>₹{Math.ceil(diff)}</strong> more to receive complimentary priority shipping.</span>
          )}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
        {/* Left: Cart Items Table */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.items.map((item) => (
              <div
                key={item.itemId}
                style={{
                  display: 'flex',
                  gap: '20px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-dark)',
                  borderRadius: '2px',
                  padding: '20px'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100px', height: '125px', objectFit: 'cover', borderRadius: '2px', backgroundColor: '#1E1B18' }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link to={`/product/${item.slug}`}>
                        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', textTransform: 'uppercase' }}>
                          {item.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Size: <strong style={{ color: 'var(--text-secondary)' }}>{item.size}</strong> • Color: <strong style={{ color: 'var(--text-secondary)' }}>{item.color}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-dark)',
                        borderRadius: '2px'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.85rem', padding: '0 8px', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                        ₹{item.price * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          (₹{item.price} each)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Link to="/shop" className="btn btn-secondary btn-sm">
              ← Continue Shopping
            </Link>
            <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ color: 'var(--status-error)' }}>
              Clear Bag
            </button>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-dark)',
            borderRadius: '2px',
            padding: '28px',
            position: 'sticky',
            top: '100px'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '20px' }}>
            ORDER SUMMARY
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{cart.subtotal}</span>
          </div>

          {promoApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.88rem', color: 'var(--status-success)' }}>
              <span>Promo Code (10% OFF)</span>
              <span>-₹{discount.toFixed(0)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Estimated Shipping</span>
            <span>{cart.isFreeShipping ? 'FREE' : '₹99'}</span>
          </div>

          {/* Promo Form */}
          <form onSubmit={applyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Promo Code (SOCKTALES10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="form-input"
              style={{ height: '40px', fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              Apply
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>TOTAL</span>
            <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-gold"
            style={{ width: '100%', marginBottom: '12px' }}
          >
            PROCEED TO CHECKOUT <ArrowRight size={16} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-gold)' }} />
              Encrypted 256-bit checkout with Cash on Delivery support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
