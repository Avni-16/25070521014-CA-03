import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, Feather, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Editorial Header */}
      <section
        style={{
          padding: '100px 0 60px',
          backgroundColor: '#0C0C0B',
          borderBottom: '1px solid var(--border-dark)',
          textAlign: 'center'
        }}
      >
        <div className="container-narrow">
          <span className="section-subtitle">THE ATELIER CHRONICLE</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--text-primary)', marginBottom: '16px' }}>
            WHERE CINEMA MEETS COUTURE
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '640px', margin: '0 auto' }}>
            Socktales was conceived to challenge mundane hosiery by treating the ankle as a canvas for cinematic storytelling.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <div className="container" style={{ padding: '80px 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <span className="section-subtitle">OUR GENESIS</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '20px' }}>
              BEYOND THE SILVER SCREEN
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '18px' }}>
              Cinema is not merely entertainment; it is memory, emotion, and visual architecture. At Socktales, we do not print cheap caricatures. Instead, our designers translate the soul of iconic cinematography into sophisticated woven motifs.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8 }}>
              Whether it is the code-rain sequence in The Matrix, the cosmic distortion of Interstellar, or the crisp formal pinstripe of The Godfather, each pair carries a subtle dialogue known only to fellow connoisseurs of cinema.
            </p>
          </div>

          <div style={{ position: 'relative', height: '420px', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--border-dark)' }}>
            <img
              src="/images/socks/hero-socks-banner.svg"
              alt="Atelier Craftsmanship"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="section-title-wrap">
          <span className="section-subtitle">THE THREE PILLARS</span>
          <h2 className="section-title">THE ATELIER STANDARD</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '36px', borderRadius: '2px' }}>
            <Film size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Authentic Homage</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Deep narrative research into color palettes, lighting keys, and symbolisms of cinema history.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '36px', borderRadius: '2px' }}>
            <Feather size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Long-Staple Cotton</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Finest Aegean and Supima cotton double-mercerized for luxurious luster and silk-like glide.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '36px', borderRadius: '2px' }}>
            <ShieldCheck size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Hand-Linked Toes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Traditional seamless seam construction that eliminates bulbous friction ridges across your toes.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Link to="/shop" className="btn btn-primary">
            EXPLORE THE COMPLETE ARCHIVE <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
