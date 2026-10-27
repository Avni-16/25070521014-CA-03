import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '120px 24px 140px' }}>
      <Film size={64} style={{ color: 'var(--accent-gold)', margin: '0 auto 24px', opacity: 0.6 }} />
      <span className="section-subtitle">SCENE 404 • CUT</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-primary)', marginBottom: '16px' }}>
        THE REQUESTED FRAME DOES NOT EXIST
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 36px', fontSize: '1rem', lineHeight: 1.7 }}>
        The screenplay appears to have skipped this sequence. Return to our signature collections or explore the complete archive.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          Return to Atelier Home
        </Link>
        <Link to="/shop" className="btn btn-secondary">
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
