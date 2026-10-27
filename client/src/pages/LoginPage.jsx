import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, phone });
      } else {
        await login(email, password);
      }
      navigate(redirectPath);
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setIsRegister(false);
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormError('');
  };

  return (
    <div className="container-narrow" style={{ padding: '60px 20px 100px' }}>
      <div
        style={{
          maxWidth: '460px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          borderRadius: '2px',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-elevated)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="section-subtitle">
            {isRegister ? 'JOIN THE ATELIER' : 'CLIENT ACCESS'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>
            {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            {isRegister
              ? 'Enjoy seamless checkout, order histories and private releases.'
              : 'Sign in to access your orders and saved shipping addresses.'}
          </p>
        </div>

        {formError && (
          <div className="alert alert-error">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Angad Mankar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="client@socktales.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-dark)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => { setIsRegister(false); setFormError(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Socktales?{' '}
              <button
                onClick={() => { setIsRegister(true); setFormError(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', fontWeight: 600, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Demo Credentials Box for College Submission & Evaluators */}
        <div
          style={{
            marginTop: '28px',
            padding: '16px',
            backgroundColor: '#121110',
            border: '1px dashed var(--accent-gold-border)',
            borderRadius: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Evaluation Quick Access
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Click below to populate pre-seeded credentials:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillCredentials('admin@socktales.com', 'Admin@12345')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', flex: 1 }}
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('customer@socktales.com', 'Customer@12345')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', flex: 1 }}
            >
              Fill Customer Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
