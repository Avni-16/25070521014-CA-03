import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const threshold = 999;
  const progress = Math.min(100, Math.round((cart.subtotal / threshold) * 100));
  const diff = Math.max(0, threshold - cart.subtotal);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={closeCart} />

      <aside className="drawer-panel">
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
              YOUR SHOPPING BAG ({cart.totalItems})
            </h3>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '14px 24px', backgroundColor: '#141312', borderBottom: '1px solid var(--border-dark)' }}>
          <p style={{ fontSize: '0.78rem', color: cart.isFreeShipping ? 'var(--status-success)' : 'var(--text-secondary)', marginBottom: '8px' }}>
            {cart.isFreeShipping ? (
              <span>✦ Congratulations! You have unlocked <strong>Free Worldwide Shipping</strong>.</span>
            ) : (
              <span>Add <strong>₹{Math.ceil(diff)}</strong> more to receive <strong>Complimentary Worldwide Shipping</strong></span>
            )}
          </p>
          <div style={{ height: '4px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: cart.isFreeShipping ? 'var(--status-success)' : 'var(--accent-gold)',
                transition: 'width 300ms ease'
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Your bag is currently empty.</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { closeCart(); navigate('/shop'); }}
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.itemId}
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '18px',
                  borderBottom: '1px solid var(--border-dark)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '2px',
                    backgroundColor: '#1E1B18'
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px', textTransform: 'none' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Size: <strong style={{ color: 'var(--text-secondary)' }}>{item.size}</strong> • Color: <strong style={{ color: 'var(--text-secondary)' }}>{item.color}</strong>
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: 600 }}>
                      ₹{item.price}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-dark)',
                        borderRadius: '2px',
                        backgroundColor: 'var(--bg-input)'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          padding: '4px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', padding: '0 8px', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          padding: '4px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-dark)',
              backgroundColor: '#121110'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{cart.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>{cart.isFreeShipping ? 'FREE' : '₹99'}</span>
            </div>

            <button
              className="btn btn-gold"
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={handleCheckoutClick}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => { closeCart(); navigate('/cart'); }}
            >
              View Full Bag
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
