const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Enforce HttpOnly cookie transmission
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError') {
      err.message = 'Unable to connect to Socktales server. Please verify backend is running on port 5000.';
    }
    throw err;
  }
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me', { method: 'GET' }),

  // Products
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    return request(`/products${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`, { method: 'GET' }),
  createProduct: (body) => request('/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  updateStock: (id, stock) => request(`/products/${id}/stock`, { method: 'PATCH', body: { stock } }),

  // Categories
  getCategories: () => request('/categories', { method: 'GET' }),
  createCategory: (body) => request('/categories', { method: 'POST', body }),
  updateCategory: (id, body) => request(`/categories/${id}`, { method: 'PUT', body }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => request('/cart', { method: 'GET' }),
  addToCart: (body) => request('/cart/items', { method: 'POST', body }),
  updateCartItem: (itemId, quantity) => request(`/cart/items/${itemId}`, { method: 'PUT', body: { quantity } }),
  removeCartItem: (itemId) => request(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),

  // Orders & Checkout
  checkout: (body) => request('/orders', { method: 'POST', body }),
  getMyOrders: () => request('/orders', { method: 'GET' }),
  getOrder: (id) => request(`/orders/${id}`, { method: 'GET' }),

  // Admin
  getAdminOrders: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const qs = searchParams.toString();
    return request(`/admin/orders${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  updateOrderStatus: (orderId, status, trackingNumber) =>
    request(`/admin/orders/${orderId}/status`, { method: 'PATCH', body: { status, trackingNumber } }),
  getAdminStats: () => request('/admin/stats', { method: 'GET' }),

  // Profile
  getProfile: () => request('/users/profile', { method: 'GET' }),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body })
};
