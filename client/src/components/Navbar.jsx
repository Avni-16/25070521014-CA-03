import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ShieldAlert, LogOut, Package, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>✦ FREE EXPRESS WORLDWIDE SHIPPING ON ORDERS OVER ₹999</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>DISCOVER THE MOVIE-INSPIRED SIGNATURE COLLECTION</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>100% REVERED COMBED MERCERIZED WEAVES ✦</span>
        </div>
      </div>

      {/* Main Editorial Header */}
      <header
        style={{
          height: '80px',
          backgroundColor: 'rgba(16, 16, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-dark)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {/* Left Navigation Links (Desktop) */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '28px',
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500
            }}
            className="desktop-nav-left"
          >
            <Link to="/" style={{ color: 'var(--text-primary)' }}>Home</Link>
            <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop All</Link>
            <Link to="/collections/movie-inspired" style={{ color: 'var(--accent-gold)' }}>Movie Series</Link>
            <Link to="/about" style={{ color: 'var(--text-secondary)' }}>Atelier</Link>
            <Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Care</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Centered Brand Identity */}
          <Link
            to="/"
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                letterSpacing: '0.22em',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1
              }}
            >
              SOCKTALES
            </span>
            <span
              style={{
                fontSize: '0.55rem',
                letterSpacing: '0.35em',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                marginTop: '4px'
              }}
            >
              MILANO • HAUTE FOOTWEAR
            </span>
          </Link>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '6px'
              }}
              aria-label="Search Collection"
            >
              <Search size={20} />
            </button>

            {/* User Account Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isAuthenticated ? 'var(--accent-gold)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                aria-label="Customer Account"
              >
                <User size={20} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    width: '230px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-dark)',
                    boxShadow: 'var(--shadow-elevated)',
                    borderRadius: '2px',
                    padding: '12px 0',
                    zIndex: 200
                  }}
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div style={{ padding: '8px 18px', borderBottom: '1px solid var(--border-dark)' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{user.name}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 18px',
                            fontSize: '0.8rem',
                            color: 'var(--accent-gold)'
                          }}
                        >
                          <ShieldAlert size={16} /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 18px',
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Package size={16} /> My Orders
                      </Link>

                      <Link
                        to="/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 18px',
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <UserCheck size={16} /> Account Profile
                      </Link>

                      <button
                        onClick={logout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 18px',
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--status-error)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ padding: '8px 18px', borderBottom: '1px solid var(--border-dark)' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Welcome to Socktales</p>
                      </div>
                      <Link
                        to="/login"
                        style={{
                          display: 'block',
                          padding: '10px 18px',
                          fontSize: '0.8rem',
                          color: 'var(--accent-gold)'
                        }}
                      >
                        Sign In / Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cart.totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#10100F',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Down Search Overlay */}
      {searchOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-dark)',
            padding: '18px 0',
            position: 'sticky',
            top: '80px',
            zIndex: 99
          }}
        >
          <div className="container">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Search cinematic socks by movie, collection, color or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-gold">
                Search
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSearchOpen(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-dark)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All Products</Link>
          <Link to="/collections/movie-inspired" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent-gold)' }}>Movie-Inspired Signature</Link>
          <Link to="/collections/dark-stories" onClick={() => setMobileMenuOpen(false)}>Dark Stories</Link>
          <Link to="/collections/formal" onClick={() => setMobileMenuOpen(false)}>Formal Wear</Link>
          <Link to="/collections/everyday-casual" onClick={() => setMobileMenuOpen(false)}>Everyday & Casual</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Socktales</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Help & Contact</Link>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav-left { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
