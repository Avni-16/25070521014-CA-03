import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Check, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(slug);
        if (res.data && res.data.product) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedSize(prod.sizes?.[0] || 'M');
          setSelectedColor(prod.colors?.[0] || 'Standard');
          setSelectedImage(0);

          // Fetch related
          const relRes = await api.getProducts({ collection: prod.collection, limit: 4 });
          if (relRes.data) {
            setRelated(relRes.data.products.filter(p => p._id !== prod._id).slice(0, 4));
          }
        }
      } catch (err) {
        console.warn('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleAdd = async () => {
    if (!product || product.stock <= 0) return;
    await addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-muted)' }}>
        ✦ Loading atelier masterpiece...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>The requested design is no longer available in our active archive.</p>
        <Link to="/shop" className="btn btn-secondary">Return to Catalogue</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/images/placeholder-sock.jpg'];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container" style={{ padding: '30px 24px 100px' }}>
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop</Link>
        <span>/</span>
        <Link to={`/collections/${product.collection.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: 'var(--text-secondary)' }}>{product.collection}</Link>
        <span>/</span>
        <span style={{ color: 'var(--accent-gold)' }}>{product.name}</span>
      </nav>

      {/* Main Two-Column Product Presentation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'flex-start' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div
            style={{
              width: '100%',
              paddingTop: '125%',
              position: 'relative',
              backgroundColor: '#1E1B18',
              borderRadius: '2px',
              overflow: 'hidden',
              border: '1px solid var(--border-dark)',
              marginBottom: '16px'
            }}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '74px',
                    height: '90px',
                    padding: 0,
                    border: selectedImage === idx ? '2px solid var(--accent-gold)' : '1px solid var(--border-dark)',
                    backgroundColor: '#1E1B18',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div>
          {product.movieReference && (
            <div style={{ marginBottom: '12px' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                ✦ CINEMATIC HOMAGE: {product.movieReference}
              </span>
            </div>
          )}

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.15 }}>
            {product.name}
          </h1>

          {/* Ratings & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', color: 'var(--accent-gold)', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {product.rating} ({product.reviewsCount} customer reviews)
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
              ₹{product.price}
            </span>
            {hasDiscount && (
              <>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice}
                </span>
                <span className="badge badge-discount">{product.discountBadge || 'SAVE NOW'}</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '28px' }}>
            {product.description}
          </p>

          {/* Size Selection */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="form-label">SELECT SIZE: <strong style={{ color: 'var(--text-primary)' }}>{selectedSize}</strong></span>
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', cursor: 'pointer' }}>True to Size Fit Guide</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.sizes?.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    minWidth: '50px',
                    height: '46px',
                    padding: '0 16px',
                    backgroundColor: selectedSize === sz ? 'var(--text-primary)' : 'var(--bg-input)',
                    color: selectedSize === sz ? 'var(--bg-main)' : 'var(--text-primary)',
                    border: '1px solid var(--border-dark)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    borderRadius: '2px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
                COLORWAY: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor}</strong>
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedColor === col ? 'var(--accent-gold-dim)' : 'var(--bg-input)',
                      color: selectedColor === col ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      border: selectedColor === col ? '1px solid var(--accent-gold)' : '1px solid var(--border-dark)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      borderRadius: '2px'
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: product.stock > 0 ? 'var(--status-success)' : 'var(--status-error)' }} />
            {product.stock > 10 ? (
              <span style={{ color: 'var(--status-success)' }}>In Stock — Dispatched within 24 Hours</span>
            ) : product.stock > 0 ? (
              <span style={{ color: 'var(--status-warning)' }}>Only {product.stock} pairs left in inventory</span>
            ) : (
              <span style={{ color: 'var(--status-error)' }}>Currently Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '36px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-dark)',
                borderRadius: '2px',
                height: '48px'
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0 14px', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ padding: '0 8px', fontWeight: 600 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0 14px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="btn btn-primary"
              style={{
                flex: 1,
                backgroundColor: added ? 'var(--status-success)' : 'var(--text-primary)',
                color: added ? '#fff' : '#10100F'
              }}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Shopping Bag
                </>
              ) : product.stock <= 0 ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Bag (₹{product.price * quantity})
                </>
              )}
            </button>
          </div>

          {/* Accordion Tabs */}
          <div style={{ borderTop: '1px solid var(--border-dark)' }}>
            <div style={{ borderBottom: '1px solid var(--border-dark)' }}>
              <button
                onClick={() => setActiveTab(activeTab === 'details' ? '' : 'details')}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                <span>Composition & Materials</span>
                {activeTab === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {activeTab === 'details' && (
                <div style={{ paddingBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <p><strong>Yarn Composition:</strong> {product.material}</p>
                  <p style={{ marginTop: '8px' }}>Double-cylinder high needle count weave. Seamless hand-linked toe reduces irritation. Reinforced high-friction zones across the Achilles and heel pad.</p>
                </div>
              )}
            </div>

            <div style={{ borderBottom: '1px solid var(--border-dark)' }}>
              <button
                onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                <span>Shipping & Atelier Guarantee</span>
                {activeTab === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {activeTab === 'shipping' && (
                <div style={{ paddingBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <p>• Complimentary express worldwide shipping on orders exceeding ₹999.</p>
                  <p>• Standard delivery within 3–5 business days.</p>
                  <p>• 30-day effortless returns on all unopened and unworn presentation packs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {related.length > 0 && (
        <div style={{ marginTop: '100px' }}>
          <div className="section-title-wrap">
            <span className="section-subtitle">COMPLEMENTARY DESIGNS</span>
            <h2 className="section-title">YOU MAY ALSO DESIRE</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
