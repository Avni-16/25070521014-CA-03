import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.defaultAddress?.street || '',
    city: user?.defaultAddress?.city || '',
    state: user?.defaultAddress?.state || '',
    postalCode: user?.defaultAddress?.postalCode || '',
    country: 'India',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    nameOnCard: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.items.length === 0) {
      setErrorMsg('Your bag is empty. Please select products first.');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      setErrorMsg('Please complete all required shipping address fields.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s+/g, '').length < 15) {
        setErrorMsg('Please provide a valid 16-digit card number.');
        return;
      }
    }

    setLoading(true);
    try {
      const orderPayload = {
        shippingAddress,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? { last4: cardDetails.cardNumber.slice(-4) } : {}
      };

      const res = await api.checkout(orderPayload);
      if (res.data && res.data.order) {
        await clearCart();
        navigate(`/orders/${res.data.order._id || res.data.order.orderNumber}`, {
          state: { orderPlaced: true, order: res.data.order }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  const shippingFee = cart.isFreeShipping ? 0 : 99;
  const grandTotal = cart.subtotal + shippingFee;

  return (
    <div className="container" style={{ padding: '40px 24px 100px' }}>
      <div style={{ marginBottom: '36px' }}>
        <span className="section-subtitle">SECURE ATELIER CHECKOUT</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', color: 'var(--text-primary)' }}>
          ORDER FULFILLMENT
        </h1>
      </div>

      {!isAuthenticated && (
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Please sign in or create an account to finalize your order.</span>
          <Link to="/login" state={{ from: '/checkout' }} className="btn btn-secondary btn-sm">
            Sign In Now
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
          {/* Left Column: Shipping & Payment Details */}
          <div style={{ flex: 1 }}>
            {/* Step 1: Shipping Address */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '28px', borderRadius: '2px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', color: '#10100F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>1</span>
                <h3 style={{ fontSize: '1.05rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                  SHIPPING ADDRESS
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Angad Mankar"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Mumbai"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State / Region *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Maharashtra"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="400001"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '28px', borderRadius: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', color: '#10100F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>2</span>
                <h3 style={{ fontSize: '1.05rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                  PAYMENT METHOD
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {/* Cash on Delivery option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    backgroundColor: paymentMethod === 'cod' ? 'var(--accent-gold-dim)' : 'var(--bg-input)',
                    border: paymentMethod === 'cod' ? '1px solid var(--accent-gold)' : '1px solid var(--border-dark)',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <Banknote size={20} style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Pay directly upon delivery at your doorstep with cash or mobile UPI.</span>
                  </div>
                </label>

                {/* Card Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    backgroundColor: paymentMethod === 'card' ? 'var(--accent-gold-dim)' : 'var(--bg-input)',
                    border: paymentMethod === 'card' ? '1px solid var(--accent-gold)' : '1px solid var(--border-dark)',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <CreditCard size={20} style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Credit / Debit Card</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Secure simulated card gateway with 256-bit AES encryption.</span>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div style={{ padding: '16px', backgroundColor: '#131211', border: '1px solid var(--border-dark)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={cardDetails.nameOnCard}
                      onChange={handleCardChange}
                      className="form-input"
                      placeholder="Angad Mankar"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      className="form-input"
                      placeholder="4532 •••• •••• 8892"
                      maxLength={19}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={cardDetails.cardExpiry}
                        onChange={handleCardChange}
                        className="form-input"
                        placeholder="12/28"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">CVC / CVV</label>
                      <input
                        type="password"
                        name="cardCvc"
                        value={cardDetails.cardCvc}
                        onChange={handleCardChange}
                        className="form-input"
                        placeholder="•••"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
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
            <h3 style={{ fontSize: '1.05rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '18px' }}>
              BAG SNAPSHOT ({cart.totalItems} ITEMS)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.items.map((item) => (
                <div key={item.itemId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} • Size: {item.size}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{cart.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{cart.isFreeShipping ? 'FREE' : '₹99'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-dark)', paddingTop: '12px', marginTop: '4px', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--accent-gold)' }}>₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.items.length === 0}
              className="btn btn-gold"
              style={{ width: '100%', marginTop: '24px' }}
            >
              {loading ? 'Processing Transaction...' : `CONFIRM & PLACE ORDER (₹${grandTotal})`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '16px' }}>
              <Lock size={13} style={{ color: 'var(--accent-gold)' }} />
              Stock is reserved atomically via MongoDB transaction
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
