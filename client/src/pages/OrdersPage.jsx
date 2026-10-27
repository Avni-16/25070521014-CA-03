import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const res = await api.getMyOrders();
        if (res.data && res.data.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.warn('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2>Authentication Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>Please sign in to view your order history and live tracking details.</p>
        <Link to="/login" state={{ from: '/orders' }} className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return { bg: 'rgba(94, 152, 118, 0.15)', text: 'var(--status-success)', border: 'var(--status-success)' };
    if (s === 'shipped') return { bg: 'rgba(198, 167, 122, 0.15)', text: 'var(--accent-gold)', border: 'var(--accent-gold)' };
    if (s === 'processing') return { bg: 'rgba(217, 160, 91, 0.15)', text: 'var(--status-warning)', border: 'var(--status-warning)' };
    return { bg: 'rgba(245, 240, 232, 0.1)', text: 'var(--text-secondary)', border: 'var(--border-dark)' };
  };

  return (
    <div className="container" style={{ padding: '40px 24px 100px' }}>
      <div style={{ marginBottom: '36px' }}>
        <span className="section-subtitle">CLIENT ARCHIVE</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--text-primary)' }}>
          YOUR ORDER HISTORY
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Track past acquisitions, shipping itineraries, and atelier receipts.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 12px' }} />
          <p>Retrieving your order records from database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
          <Package size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>No orders placed yet.</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
            When you complete an order, its tracking and itemized invoice will appear here.
          </p>
          <Link to="/shop" className="btn btn-secondary">Explore the Catalogue</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => {
            const badgeStyle = getStatusBadge(order.status);
            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-dark)',
                  borderRadius: '2px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-dark)', paddingBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                      ORDER NUMBER
                    </span>
                    <strong style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>{order.orderNumber}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                      DATE PLACED
                    </span>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                      TOTAL AMOUNT
                    </span>
                    <span style={{ fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      ₹{order.pricing?.total}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        padding: '6px 14px',
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
                        borderRadius: '2px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '54px', height: '68px', objectFit: 'cover', borderRadius: '2px' }} />
                      <div>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Size: {item.size} • Qty: {item.quantity} • ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-dark)', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={14} style={{ color: 'var(--accent-gold)' }} />
                    Tracking: <strong style={{ color: 'var(--text-secondary)' }}>{order.trackingNumber || 'Pending Courier Assignment'}</strong>
                  </div>

                  <Link to={`/orders/${order._id || order.orderNumber}`} className="btn btn-secondary btn-sm">
                    View Complete Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
