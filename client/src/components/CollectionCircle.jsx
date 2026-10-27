import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CollectionCircle({ title, slug, image, subtitle }) {
  return (
    <Link
      to={`/collections/${slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '14px',
        group: 'true'
      }}
    >
      {/* Circular Image Container */}
      <div
        style={{
          width: 'clamp(110px, 14vw, 160px)',
          height: 'clamp(110px, 14vw, 160px)',
          borderRadius: '50%',
          padding: '4px',
          border: '1px solid var(--accent-gold-border)',
          backgroundColor: '#161413',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all var(--transition-normal)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-gold)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(198, 167, 122, 0.35)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-gold-border)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />
      </div>

      {/* Title & Arrow */}
      <div>
        <h4
          style={{
            fontSize: '0.82rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {title} <ArrowRight size={13} style={{ color: 'var(--accent-gold)' }} />
        </h4>
        {subtitle && (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}
