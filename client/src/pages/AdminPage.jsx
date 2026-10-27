import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, ShieldAlert, Package, ShoppingCart, DollarSign, Users, RefreshCw, CheckCircle, X } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    movieReference: '',
    collection: 'Movie-Inspired',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    imageUrl: '',
    sizes: 'S, M, L, XL',
    colors: 'Black, Gold'
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts({ limit: 100 }),
        api.getAdminOrders({ limit: 100 })
      ]);
      if (statsRes.data) setStats(statsRes.data.stats);
      if (prodRes.data) setProducts(prodRes.data.products);
      if (ordRes.data) setOrders(ordRes.data.orders);
    } catch (err) {
      console.warn('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAll();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
        <ShieldAlert size={48} style={{ color: 'var(--status-error)', margin: '0 auto 16px' }} />
        <h2>Restricted Administrative Domain</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
          This interface is reserved for authorized atelier curators and administrators.
        </p>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      movieReference: '',
      collection: 'Movie-Inspired',
      price: '',
      originalPrice: '',
      stock: '50',
      description: '',
      imageUrl: '/images/socks/interstellar-event-horizon.svg',
      sizes: 'S, M, L, XL',
      colors: 'Black, Gold'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      movieReference: prod.movieReference || '',
      collection: prod.collection,
      price: prod.price.toString(),
      originalPrice: prod.originalPrice ? prod.originalPrice.toString() : '',
      stock: prod.stock.toString(),
      description: prod.description || '',
      imageUrl: prod.images?.[0] || '',
      sizes: (prod.sizes || []).join(', '),
      colors: (prod.colors || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        movieReference: formData.movieReference,
        collection: formData.collection,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        description: formData.description,
        images: [formData.imageUrl || '/images/socks/interstellar-event-horizon.svg'],
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean)
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
      } else {
        await api.createProduct(payload);
      }
      setModalOpen(false);
      await loadAll();
    } catch (err) {
      alert(err.message || 'Operation failed.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you certain you wish to delete "${name}" from the active catalogue?`)) {
      try {
        await api.deleteProduct(id);
        await loadAll();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleStockQuickUpdate = async (id, newStock) => {
    const val = parseInt(newStock, 10);
    if (isNaN(val) || val < 0) return;
    try {
      await api.updateStock(id, val);
      await loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 100px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-subtitle">CONTROL CONSOLE</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-primary)' }}>
            SOCKTALES ATELIER ADMIN
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={loadAll} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button onClick={handleOpenCreateModal} className="btn btn-gold btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add New Design
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '24px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Gross Revenue</span>
              <DollarSign size={20} />
            </div>
            <p style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>₹{stats.totalRevenue.toFixed(2)}</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '24px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Orders</span>
              <ShoppingCart size={20} />
            </div>
            <p style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>{stats.totalOrders}</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '24px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Catalogue Styles</span>
              <Package size={20} />
            </div>
            <p style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>{stats.totalProducts}</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '24px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registered Patrons</span>
              <Users size={20} />
            </div>
            <p style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>{stats.totalUsers}</p>
          </div>
        </div>
      )}

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-dark)', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'products' ? '2px solid var(--accent-gold)' : '2px solid transparent',
            color: activeTab === 'products' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.86rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Product Management ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '2px solid var(--accent-gold)' : '2px solid transparent',
            color: activeTab === 'orders' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.86rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '2px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-dark)', color: 'var(--text-muted)', fontSize: '0.74rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Product</th>
                <th style={{ padding: '16px 16px' }}>Collection</th>
                <th style={{ padding: '16px 16px' }}>Price</th>
                <th style={{ padding: '16px 16px' }}>Inventory Stock</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                  <td style={{ padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img src={prod.images?.[0]} alt={prod.name} style={{ width: '44px', height: '56px', objectFit: 'cover', borderRadius: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{prod.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>{prod.movieReference || 'Signature Tailoring'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>{prod.collection}</td>
                  <td style={{ padding: '16px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>₹{prod.price}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <input
                      type="number"
                      defaultValue={prod.stock}
                      onBlur={(e) => handleStockQuickUpdate(prod._id, e.target.value)}
                      style={{
                        width: '70px',
                        padding: '4px 8px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-dark)',
                        borderRadius: '2px',
                        color: prod.stock <= 5 ? 'var(--status-warning)' : 'var(--text-primary)',
                        fontWeight: 600
                      }}
                    />
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', marginRight: '14px' }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id, prod.name)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--status-error)', cursor: 'pointer' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '2px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-dark)', color: 'var(--text-muted)', fontSize: '0.74rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Order Ref</th>
                <th style={{ padding: '16px 16px' }}>Customer</th>
                <th style={{ padding: '16px 16px' }}>Items</th>
                <th style={{ padding: '16px 16px' }}>Total</th>
                <th style={{ padding: '16px 16px' }}>Payment</th>
                <th style={{ padding: '16px 20px' }}>Status Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <strong style={{ color: 'var(--accent-gold)' }}>{ord.orderNumber}</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ color: 'var(--text-primary)', display: 'block' }}>{ord.customerName}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ord.customerEmail}</span>
                  </td>
                  <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                    {ord.items?.length} pairs
                  </td>
                  <td style={{ padding: '16px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    ₹{ord.pricing?.total}
                  </td>
                  <td style={{ padding: '16px 16px' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                      {ord.payment?.method?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                      className="form-select"
                      style={{ height: '34px', fontSize: '0.78rem', width: 'auto' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Product Add / Edit */}
      {modalOpen && (
        <div className="drawer-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-dark)',
              borderRadius: '2px',
              padding: '36px',
              maxWidth: '560px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-elevated)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
                {editingProduct ? 'EDIT DESIGN PIECE' : 'NEW SOCKS CREATION'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Design Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Blade Runner Neon Ribbed"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cinematic Homage / Movie Reference</label>
                <input
                  type="text"
                  value={formData.movieReference}
                  onChange={(e) => setFormData({ ...formData, movieReference: e.target.value })}
                  className="form-input"
                  placeholder="Blade Runner (1982)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Collection *</label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="form-select"
                  >
                    <option value="Movie-Inspired">Movie-Inspired</option>
                    <option value="Dark Stories">Dark Stories</option>
                    <option value="Formal">Formal</option>
                    <option value="Everyday & Casual">Everyday & Casual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹ INR) *</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (₹ INR)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="form-input"
                    placeholder="Optional strike-through"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Weave Story</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe craftsmanship and film inspiration..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold">
                  {editingProduct ? 'Save Modifications' : 'Create Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
