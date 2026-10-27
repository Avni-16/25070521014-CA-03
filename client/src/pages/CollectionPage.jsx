import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

const collectionMetadata = {
  'movie-inspired': {
    title: 'Movie & Pop Culture Collection',
    tagline: 'CINEMATIC SOCKS • SILVER SCREEN & POP WEAVES',
    description: 'Our signature line transforming legendary cinema and beloved entertainment—from Marvel and Hogwarts to Stranger Things and Ghostbusters—into bespoke luxury socks.',
    banner: '/images/socks/collection-movie.svg'
  },
  'marvel-avengers': {
    title: 'Marvel / Avengers Collection',
    tagline: 'EARTH’S MIGHTIEST FOOTWEAR • MARVEL HEROES',
    description: 'Assemble your daily stride with luxury socks honoring Iron Man, Spider-Man, Captain America, Thor, and the Hulk. Pure combed cotton from ₹399.',
    banner: '/images/socks/collection-marvel.svg'
  },
  'harry-potter': {
    title: 'Harry Potter Hogwarts Collection',
    tagline: 'HOUSE CRESTS & WIZARDING WEAVES',
    description: 'Gryffindor scarlet, Slytherin emerald, Ravenclaw sapphire, Hufflepuff canary, and Lumos spell jacquards fit for the Great Hall.',
    banner: '/images/socks/collection-potter.svg'
  },
  'stranger-things': {
    title: 'Stranger Things Collection',
    tagline: 'HAWKINS 1983 • THE HELLFIRE CLUB & THE UPSIDE DOWN',
    description: 'Retro 80s skater tube stripes, the horned Hellfire Club dice, and spore-red dark dimension patterns woven in luxury combed cotton.',
    banner: '/images/socks/collection-stranger.svg'
  },
  'ghostbusters': {
    title: 'Ghostbusters Collection',
    tagline: 'NO-GHOST LOGO • ECTOPLASM NEON DRIPS',
    description: 'Luminescent radioactive green Slimer slime and khaki jumpsuit utility ribs featuring the classic red crossed ghost emblem.',
    banner: '/images/socks/collection-ghostbusters.svg'
  },
  'disney-characters': {
    title: 'Disney Characters Collection',
    tagline: 'TIMELESS NOSTALGIA • MICKEY, STITCH & FRIENDS',
    description: 'Whimsical luxury socks featuring Mickey Mouse polka, Minnie rose bows, Donald nautical stripes, Stitch 626, and Winnie the Pooh honeycombs.',
    banner: '/images/socks/collection-disney.svg'
  },
  'dark-stories': {
    title: 'Dark Stories Collection',
    tagline: 'NOCTURNE • GOTHIC ROMANCE SOCKS',
    description: 'Enigmatic silhouettes, deep velvet blacks, and intricate Victorian baroque lace jacquards crafted for twilight reveries.',
    banner: '/images/socks/collection-dark.svg'
  },
  'formal': {
    title: 'Formal & Occasion Socks',
    tagline: 'BOARDROOM LISLE • MERCERIZED ELEGANCE',
    description: 'Fine gauge double-mercerized Scottish Lisle cotton and cashmere-blend ribs designed for morning dress, bespoke oxfords, and gala soirées.',
    banner: '/images/socks/collection-formal.svg'
  },
  'everyday-casual': {
    title: 'Everyday & Casual Socks',
    tagline: 'CLOUD TERRY • VIBRANT LEISURE',
    description: 'Breathable organic combed cotton offering responsive arch support, cushioned terry soles, and playful modern colourblocks.',
    banner: '/images/socks/collection-casual.svg'
  }
};

export default function CollectionPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const meta = collectionMetadata[slug] || {
    title: `${slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CURATED'} SOCKS`,
    tagline: 'SOCKTALES EXCLUSIVE • ALL PRICES IN ₹ INR',
    description: 'Handcrafted luxury socks exclusively.',
    banner: '/images/socks/collection-movie.svg'
  };

  useEffect(() => {
    async function loadCollectionProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({ collection: slug, limit: 30 });
        if (res.data) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn('Failed to load collection products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollectionProducts();
  }, [slug]);

  return (
    <div>
      {/* Thematic Collection Hero Banner */}
      <section
        style={{
          position: 'relative',
          height: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: `linear-gradient(rgba(16, 16, 15, 0.75), rgba(16, 16, 15, 0.95)), url('${meta.banner}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--border-dark)'
        }}
      >
        <div className="container-narrow" style={{ padding: '0 20px' }}>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={14} /> Back to Complete Catalogue
          </Link>
          <span className="section-subtitle">{meta.tagline}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', color: 'var(--text-primary)', marginBottom: '14px' }}>
            {meta.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '600px', margin: '0 auto' }}>
            {meta.description}
          </p>
        </div>
      </section>

      {/* Collection Products Grid */}
      <div className="container" style={{ padding: '60px 24px 100px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            ✦ Loading {meta.title} pieces...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              No sock pieces currently in this collection category.
            </p>
            <Link to="/shop" className="btn btn-secondary">
              Browse All Socks
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
