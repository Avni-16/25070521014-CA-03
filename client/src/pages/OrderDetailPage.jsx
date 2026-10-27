import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const isJustPlaced = location.state?.orderPlaced;

  useEffect(() => {
    async function fetchOrder() {
      if (order && order._id === id) return;
      setLoading(true);
      try {
        const res = await api.getOrder(id);
        if (res.data && res.data.order) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.warn('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-muted)' }}>
        ✦ Retrieving atelier order manifest...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2>Order Record Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>Could not find an order corresponding to the requested tracking ID.</p>
        <Link to="/orders" className="btn btn-secondary">View Order History</Link>
      </div>
    );
  }

  return (
    <div className="container-narrow" style={{ padding: '40px 20px 100px' }}>
      {/* Success Banner if Just Placed */}
      {isJustPlaced && (
        <div
          style={{
            backgroundColor: 'rgba(94, 152, 118, 0.12)',
            border: '1px solid var(--status-success)',
            borderRadius: '2px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '36px'
          }}
        >
          <CheckCircle2 size={40} style={{ color: 'var(--status-success)', margin: '0 auto 12px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            THANK YOU FOR YOUR PATRONAGE
          </h2>
          <p style={{ color: '#C8E6D3', fontSize: '0.92rem' }}>
            Your order has been recorded in our permanent atelier ledger and dispatched to fulfillment.
          </p>
        </div>
      )}

      {/* Header & Print Option */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          <ArrowLeft size={14} /> Back to My Orders
        </Link>
        <button
          onClick={() => window.print()}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* Main Order Manifest Card */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '2px', padding: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dark)', paddingBottom: '24px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              OFFICIAL ATELIER ORDER NUMBER
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--accent-gold)', marginTop: '4px' }}>
              {order.orderNumber}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              STATUS: {order.status}
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Tracking Ref: <strong style={{ color: 'var(--text-primary)' }}>{order.trackingNumber}</strong>
            </p>
          </div>
        </div>

        {/* Two-Column Details: Shipping Address & Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px', borderBottom: '1px solid var(--border-dark)', paddingBottom: '24px' }}>
          <div>
            <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '10px' }}>
              SHIPPING RECIPIENT
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{order.shippingAddress?.fullName}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '10px' }}>
              PAYMENT & BILLING
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {order.payment?.method === 'cod' ? 'Cash on Delivery (Doorstep Settlement)' : 'Encrypted Credit / Debit Card'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '4px' }}>
              Payment Status: <strong style={{ color: order.payment?.status === 'completed' ? 'var(--status-success)' : 'var(--accent-gold)' }}>{order.payment?.status?.toUpperCase()}</strong><br />
              Transaction Ref: {order.payment?.transactionId}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '16px' }}>
          PURCHASED PIECES ({order.items?.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-dark)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Size: {item.size} • Color: {item.color} • Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  ₹{item.price * item.quantity}
                </span>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>₹{item.price} ea</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals Breakdown */}
        <div style={{ maxWidth: '320px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{order.pricing?.subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Complimentary Priority Shipping</span>
            <span>{order.pricing?.shippingFee === 0 ? 'FREE' : `₹${order.pricing?.shippingFee}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-dark)', paddingTop: '12px', marginTop: '4px', fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700 }}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--accent-gold)' }}>₹{order.pricing?.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
