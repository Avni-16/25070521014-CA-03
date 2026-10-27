import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters state initialized from URL
  const selectedCollection = searchParams.get('collection') || 'all';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const maxPrice = searchParams.get('maxPrice') || '';

  const collections = [
    { label: 'All Collections', value: 'all' },
    { label: 'Movie-Inspired (All)', value: 'Movie-Inspired' },
    { label: 'Marvel / Avengers', value: 'marvel-avengers' },
    { label: 'Harry Potter', value: 'harry-potter' },
    { label: 'Stranger Things', value: 'stranger-things' },
    { label: 'Ghostbusters', value: 'ghostbusters' },
    { label: 'Disney Characters', value: 'disney-characters' },
    { label: 'Dark Stories', value: 'Dark Stories' },
    { label: 'Formal', value: 'Formal' },
    { label: 'Everyday & Casual', value: 'Everyday & Casual' }
  ];

  const quickPills = [
    { label: 'All Socks', val: 'all' },
    { label: 'Marvel / Avengers', val: 'marvel-avengers' },
    { label: 'Harry Potter', val: 'harry-potter' },
    { label: 'Stranger Things', val: 'stranger-things' },
    { label: 'Ghostbusters', val: 'ghostbusters' },
    { label: 'Disney', val: 'disney-characters' },
    { label: 'Dark Stories', val: 'Dark Stories' },
    { label: 'Formal', val: 'Formal' },
    { label: 'Casual', val: 'Everyday & Casual' }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Black', 'Green', 'Navy', 'Gold', 'Charcoal', 'Taupe'];

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === 'all' || val === false) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    async function fetchCatalogue() {
      setLoading(true);
      try {
        const query = {
          collection: selectedCollection !== 'all' ? selectedCollection : undefined,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          inStock: inStockOnly ? 'true' : undefined,
          search: searchQuery || undefined,
          sort: sortBy,
          maxPrice: maxPrice || undefined
        };

        const res = await api.getProducts(query);
        if (res.data) {
          setProducts(res.data.products);
          setTotalCount(res.data.pagination.total);
        }
      } catch (err) {
        console.warn('Failed to load catalogue:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogue();
  }, [searchParams]);

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="section-subtitle">100% SOCKS ARCHIVE • ALL VALUES IN ₹ INR</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          SOCKTALES CATALOGUE
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Cinematic sagas, superheroes, magical houses, and luxury formal socks from ₹299.
        </p>
      </div>

      {/* Quick Category Franchise Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {quickPills.map((p) => {
          const isActive = selectedCollection === p.val || (p.val === 'all' && selectedCollection === 'all');
          return (
            <button
              key={p.val}
              onClick={() => updateParam('collection', p.val)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: isActive ? '1px solid var(--accent-gold)' : '1px solid var(--border-dark)',
                backgroundColor: isActive ? 'var(--accent-gold)' : 'var(--bg-card)',
                color: isActive ? '#10100F' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Sort */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          borderRadius: '2px',
          marginBottom: '32px'
        }}
      >
        {/* Left: Filter Toggle for Mobile & Current Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <SlidersHorizontal size={14} /> Filter Attributes
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--accent-gold)' }}>{products.length}</strong> of {totalCount} sock styles
          </span>
        </div>

        {/* Right: Search Input & Sorting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search 'Matrix', 'Iron Man', 'Gryffindor'..."
              value={searchQuery}
              onChange={(e) => updateParam('search', e.target.value)}
              className="form-input"
              style={{ height: '38px', fontSize: '0.82rem', paddingLeft: '32px' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
          </div>

          <select
            value={sortBy}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="form-select"
            style={{ height: '38px', width: 'auto', fontSize: '0.82rem', padding: '0 12px' }}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High (₹)</option>
            <option value="price_desc">Price: High to Low (₹)</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Main Shop Layout: Sidebar Filters + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: filterDrawerOpen ? '260px 1fr' : '1fr', gap: '32px' }}>
        {/* Filter Sidebar */}
        {filterDrawerOpen && (
          <aside
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-dark)',
              padding: '24px',
              borderRadius: '2px',
              height: 'fit-content'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>FILTERS</h3>
              <button
                onClick={clearAllFilters}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Reset All
              </button>
            </div>

            {/* Collection Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                COLLECTION &amp; FRANCHISE
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {collections.map((col) => (
                  <label key={col.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer', color: selectedCollection === col.value ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedCollection === col.value}
                      onChange={() => updateParam('collection', col.value)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                SIZE FIT
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateParam('size', selectedSize === sz ? '' : sz)}
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: selectedSize === sz ? 'var(--accent-gold)' : 'var(--bg-input)',
                      color: selectedSize === sz ? '#10100F' : 'var(--text-primary)',
                      border: '1px solid var(--border-dark)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam('inStock', e.target.checked)}
                />
                In Stock Only
              </label>
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 12px' }} />
              <p>Loading Socktales archive...</p>
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                backgroundColor: 'var(--bg-card)',
                border: '1px dashed var(--border-dark)',
                borderRadius: '2px'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                No sock designs found matching your criteria.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Try adjusting your search query, franchise, or size filters.
              </p>
              <button onClick={clearAllFilters} className="btn btn-secondary">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: filterDrawerOpen ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)' }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
