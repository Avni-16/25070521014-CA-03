import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '60px 24px 100px' }}>
      <div className="section-title-wrap">
        <span className="section-subtitle">CONCIERGE & CARE</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          ATELIER SUPPORT
        </h1>
        <p className="section-description">
          Our client advisors are on hand to assist with bespoke orders, styling queries, and order fulfillment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'flex-start' }}>
        {/* Contact Form */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '36px', borderRadius: '2px' }}>
          <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '24px' }}>
            SEND AN INQUIRY
          </h3>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--status-success)', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Message Received</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Thank you for contacting Socktales. An atelier advisor will reply to your email within 24 hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm" style={{ marginTop: '20px' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Angad Mankar"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="client@socktales.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-select"
                >
                  <option value="General Inquiry">General Atelier Inquiry</option>
                  <option value="Order Tracking">Order Tracking & Dispatch</option>
                  <option value="Returns & Exchanges">Returns & Exchanges</option>
                  <option value="Bespoke Gifting">Corporate & Bespoke Gifting</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea"
                  placeholder="How may our advisors assist your inquiry?"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Transmit Message <Send size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Concierge Information & FAQs */}
        <div>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '36px', borderRadius: '2px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '24px' }}>
              DIRECT CONTACT
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>concierge@socktales.com</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <MapPin size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>Socktales Atelier, 42 Editorial Boulevard, Mumbai, India</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <Clock size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>Monday – Saturday: 10:00 – 19:00 IST</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '36px', borderRadius: '2px' }}>
            <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '20px' }}>
              FREQUENTLY ASKED
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>How do Socktales socks fit?</strong>
                <p style={{ color: 'var(--text-secondary)' }}>Our pairs fit true to European sizing standards with high-retention ribbed cuffs that do not sag or cut circulation.</p>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>How do I care for my pairs?</strong>
                <p style={{ color: 'var(--text-secondary)' }}>Machine wash cold on gentle cycle inside out. Air dry flat to preserve yarn elasticity and colors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
