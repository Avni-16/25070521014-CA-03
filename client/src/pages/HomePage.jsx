import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film, Sparkles, ChevronRight, Check } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import CollectionCircle from '../components/CollectionCircle';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [activeFranchise, setActiveFranchise] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, featuredRes, latestRes] = await Promise.all([
          api.getProducts({ limit: 40 }),
          api.getProducts({ featured: true, limit: 8 }),
          api.getProducts({ limit: 4, sort: 'newest' })
        ]);
        if (prodRes.data) setAllProducts(prodRes.data.products);
        if (featuredRes.data) setFeaturedProducts(featuredRes.data.products);
        if (latestRes.data) setNewReleases(latestRes.data.products);
      } catch (err) {
        console.warn('Could not fetch homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const circularCollections = [
    {
      title: 'Marvel Avengers',
      slug: 'marvel-avengers',
      subtitle: 'Earth’s Mightiest Socks',
      image: '/images/socks/collection-marvel.svg'
    },
    {
      title: 'Harry Potter',
      slug: 'harry-potter',
      subtitle: 'Hogwarts House Crests',
      image: '/images/socks/collection-potter.svg'
    },
    {
      title: 'Stranger Things',
      slug: 'stranger-things',
      subtitle: 'Hellfire & Upside Down',
      image: '/images/socks/collection-stranger.svg'
    },
    {
      title: 'Ghostbusters',
      slug: 'ghostbusters',
      subtitle: 'Slimer & No-Ghost Rib',
      image: '/images/socks/collection-ghostbusters.svg'
    },
    {
      title: 'Disney Characters',
      slug: 'disney-characters',
      subtitle: 'Mickey, Stitch & Pooh',
      image: '/images/socks/collection-disney.svg'
    },
    {
      title: 'Dark Stories',
      slug: 'dark-stories',
      subtitle: 'Gothic Nocturne Weaves',
      image: '/images/socks/collection-dark.svg'
    }
  ];

  const franchiseTabs = [
    { label: 'All Pop Culture', value: 'all' },
    { label: 'Marvel / Avengers', value: 'Marvel / Avengers' },
    { label: 'Harry Potter', value: 'Harry Potter' },
    { label: 'Stranger Things', value: 'Stranger Things' },
    { label: 'Ghostbusters', value: 'Ghostbusters' },
    { label: 'Disney Characters', value: 'Disney Characters' }
  ];

  // Filter products for the dedicated Pop Culture section
  const moviePopCultureProducts = allProducts.filter((p) => {
    if (activeFranchise === 'all') {
      return (
        p.collection === 'Movie-Inspired' ||
        ['Marvel / Avengers', 'Harry Potter', 'Stranger Things', 'Ghostbusters', 'Disney Characters'].includes(p.franchise)
      );
    }
    return p.franchise === activeFranchise;
  });

  return (
    <div>
      {/* 1. EDITORIAL HERO BANNER (SOCKS ONLY, INR PRICING) */}
      <section
        style={{
          position: 'relative',
          height: 'clamp(520px, 68vh, 760px)',
          backgroundColor: '#121110',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: 'clamp(40px, 8vh, 80px)',
          overflow: 'hidden'
        }}
      >
        {/* Background Image: Luxury Sock Atelier Banner */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to top, rgba(16, 16, 15, 0.95) 0%, rgba(16, 16, 15, 0.5) 50%, rgba(16, 16, 15, 0.25) 100%), url('/images/socks/hero-socks-banner.svg')`,
            backgroundPosition: 'center 40%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            filter: 'contrast(1.05)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: '660px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                marginBottom: '12px',
                fontWeight: 600
              }}
            >
              100% SOCKS ATELIER • ALL PRICES IN ₹ INR
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-primary)',
                fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
                lineHeight: 1.05,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              CINEMATIC <br />
              <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#E8DFC8' }}>FOOTWEAR REVERIE</span>
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '520px'
              }}
            >
              Legendary pop culture &amp; movie sagas woven into handcrafted luxury socks. Avengers, Hogwarts, Stranger Things, Ghostbusters, Disney, and dystopian cinema from ₹299.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary">
                SHOP ALL SOCKS <ArrowRight size={16} />
              </Link>
              <Link to="/collections/movie-inspired" className="btn btn-secondary">
                EXPLORE MOVIE SERIES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY COLLECTION CIRCULAR SECTION (SOCKS ONLY) */}
      <section className="section" style={{ borderBottom: '1px solid var(--border-dark)', backgroundColor: '#0E0D0C' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">SIGNATURE UNIVERSES</span>
            <h2 className="section-title">SHOP SOCKS BY COLLECTION</h2>
            <p className="section-description">
              Explore our curated cinematic and pop-culture pillars, woven from organic combed cotton and hand-linked toes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
              gap: '24px',
              justifyContent: 'center',
              marginTop: '40px'
            }}
          >
            {circularCollections.map((col) => (
              <CollectionCircle
                key={col.slug}
                title={col.title}
                slug={col.slug}
                image={col.image}
                subtitle={col.subtitle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. DEDICATED MOVIES & POP CULTURE INSPIRED SOCKS SECTION (MANDATORY REQUIREMENT 3) */}
      <section className="section" style={{ backgroundColor: '#141311', borderBottom: '1px solid var(--border-dark)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">POP CULTURE MASTERPIECES</span>
            <h2 className="section-title">MOVIES &amp; POP CULTURE INSPIRED SOCKS</h2>
            <p className="section-description">
              Official character-inspired weaves: Marvel Avengers, Harry Potter, Stranger Things, Ghostbusters, and Disney Characters.
            </p>
          </div>

          {/* Interactive Franchise Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '40px'
            }}
          >
            {franchiseTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFranchise(tab.value)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeFranchise === tab.value ? 'var(--accent-gold)' : 'var(--bg-card)',
                  color: activeFranchise === tab.value ? '#10100F' : 'var(--text-secondary)',
                  border: activeFranchise === tab.value ? '1px solid var(--accent-gold)' : '1px solid var(--border-dark)',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pop Culture Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              ✦ Loading pop culture sock collection...
            </div>
          ) : (
            <div className="product-grid">
              {moviePopCultureProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              to={activeFranchise === 'all' ? '/collections/movie-inspired' : `/shop?search=${encodeURIComponent(activeFranchise)}`}
              className="btn btn-secondary"
            >
              VIEW ALL {activeFranchise === 'all' ? 'MOVIE & POP CULTURE' : activeFranchise.toUpperCase()} SOCKS ({moviePopCultureProducts.length} PAIRS) <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">CURATED LUXURY IN ₹ INR</span>
            <h2 className="section-title">TODAY'S HIGHLIGHTED PAIRS</h2>
            <p className="section-description">
              From Iron Man and Hogwarts to Matrix and Kingsman—all priced in Indian Rupees (₹).
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              ✦ Preparing curated atelier sock pieces...
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/shop" className="btn btn-secondary">
              VIEW COMPLETE CATALOGUE (30 STYLES IN ₹ INR) <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL STORYTELLING BANNER (SOCKS CRAFTSMANSHIP ONLY) */}
      <section
        style={{
          position: 'relative',
          padding: '120px 0',
          backgroundImage: `linear-gradient(rgba(16, 16, 15, 0.9), rgba(16, 16, 15, 0.9)), url('/images/socks/hero-socks-banner.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTop: '1px solid var(--border-dark)',
          borderBottom: '1px solid var(--border-dark)',
          textAlign: 'center'
        }}
      >
        <div className="container-narrow">
          <span className="section-subtitle">STRICTLY SOCKS • UNCOMPROMISING CRAFTSMANSHIP</span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.08em',
              marginBottom: '18px'
            }}
          >
            HAUTE FOOTWEAR MEETS POP CULTURE
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: 1.8
            }}
          >
            Socktales was born from a singular obsession: elevating socks into timeless cinematic art. No apparel, no distractions—only masterfully engineered crew, ankle, knee-high, and formal socks crafted from organic combed Egyptian cotton, double-mercerized Scottish Lisle, and hand-linked toes.
          </p>
          <Link to="/shop" className="btn btn-primary">
            DISCOVER THE SOCKS ARCHIVE
          </Link>
        </div>
      </section>

      {/* 6. FRESH RELEASES ROW */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-subtitle">JUST UNWRAPPED</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>LATEST CREATIONS IN ₹ INR</h2>
            </div>
            <Link to="/shop?sort=newest" style={{ color: 'var(--accent-gold)', fontSize: '0.84rem', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              View All Releases <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {newReleases.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
