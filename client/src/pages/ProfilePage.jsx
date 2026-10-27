import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, MapPin, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, checkAuth, isAuthenticated } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState({
    street: user?.defaultAddress?.street || '',
    city: user?.defaultAddress?.city || '',
    state: user?.defaultAddress?.state || '',
    postalCode: user?.defaultAddress?.postalCode || '',
    country: user?.defaultAddress?.country || 'India'
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2>Sign In Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0' }}>Please log in to manage your atelier account details.</p>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.updateProfile({ name, phone, address });
      await checkAuth();
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow" style={{ padding: '40px 20px 100px' }}>
      <div style={{ marginBottom: '36px' }}>
        <span className="section-subtitle">CLIENT DOSSIER</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', color: 'var(--text-primary)' }}>
          ACCOUNT SETTINGS
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Manage your personal details and primary shipping destination.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '32px', borderRadius: '2px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '20px' }}>
            PERSONAL INFORMATION
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Immutable)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="form-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '32px', borderRadius: '2px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.05rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '20px' }}>
            DEFAULT SHIPPING DESTINATION
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Street Address</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="form-input"
                placeholder="Apartment, suite, unit, building, etc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">State / Region</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '220px' }}>
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
