import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: '#0C0C0B', borderTop: '1px solid var(--border-dark)', marginTop: '80px' }}>
      {/* Editorial Trust Badges */}
      <div style={{ borderBottom: '1px solid var(--border-dark)', padding: '36px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
            <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.14em', color: 'var(--text-primary)' }}>Cinematic Heritage</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Original designs inspired by iconic motion pictures</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Truck size={24} style={{ color: 'var(--accent-gold)' }} />
            <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.14em', color: 'var(--text-primary)' }}>Complimentary Shipping</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On all qualified orders exceeding ₹999</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={24} style={{ color: 'var(--accent-gold)' }} />
            <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.14em', color: 'var(--text-primary)' }}>Atelier Guarantee</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>30-day effortless returns on unworn pieces</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-gold)' }} />
            <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.14em', color: 'var(--text-primary)' }}>Secure Checkout</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Encrypted native processing & Cash on Delivery</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {/* Brand Intro */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', letterSpacing: '0.16em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              SOCKTALES
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              An editorial atelier celebrating cinema &amp; pop culture through luxury socks. Crafted with combed organic cotton, fine Scottish Lisle, and precision hand-linked finishes.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Root Submission ID: <strong style={{ color: 'var(--accent-gold)' }}>25070521014</strong>
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', color: 'var(--accent-gold)', marginBottom: '18px' }}>
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/collections/movie-inspired" style={{ color: 'var(--accent-gold)' }}>Movie &amp; Pop Culture</Link></li>
              <li><Link to="/collections/marvel-avengers">Marvel / Avengers</Link></li>
              <li><Link to="/collections/harry-potter">Harry Potter Hogwarts</Link></li>
              <li><Link to="/collections/stranger-things">Stranger Things</Link></li>
              <li><Link to="/collections/ghostbusters">Ghostbusters</Link></li>
              <li><Link to="/collections/disney-characters">Disney Characters</Link></li>
              <li><Link to="/collections/dark-stories">Dark Stories &amp; Gothic</Link></li>
              <li><Link to="/collections/formal">Formal &amp; Boardroom</Link></li>
              <li><Link to="/shop">Complete Archive (₹ INR)</Link></li>
            </ul>
          </div>

          {/* Client Service */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', color: 'var(--accent-gold)', marginBottom: '18px' }}>
              Client Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/contact">Help & FAQs</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/about">Our Atelier Story</Link></li>
              <li><Link to="/contact">Returns & Exchanges</Link></li>
              <li><Link to="/contact">Size & Fit Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', color: 'var(--accent-gold)', marginBottom: '18px' }}>
              The Gazette
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Receive exclusive cinematic collection releases and private preview access.
            </p>
            {subscribed ? (
              <div style={{ color: 'var(--status-success)', fontSize: '0.82rem' }}>
                ✦ Thank you for subscribing to The Gazette.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex' }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-dark)',
                    borderRight: 'none',
                    padding: '0 14px',
                    height: '42px',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    flex: 1,
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    border: 'none',
                    padding: '0 16px',
                    color: '#10100F',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Submit Newsletter"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-dark)', marginTop: '48px', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} SOCKTALES HAUTE FOOTWEAR. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
