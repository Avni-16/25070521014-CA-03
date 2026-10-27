import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    totalItems: 0,
    isFreeShipping: false
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      // Local guest cart
      const saved = localStorage.getItem('socktales_guest_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCart(parsed);
        } catch (e) {}
      } else {
        setCart({ items: [], subtotal: 0, totalItems: 0, isFreeShipping: false });
      }
      return;
    }

    try {
      setLoading(true);
      const res = await api.getCart();
      if (res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const saveGuestCart = (items) => {
    const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const updated = {
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      totalItems,
      isFreeShipping: subtotal >= 999
    };
    setCart(updated);
    localStorage.setItem('socktales_guest_cart', JSON.stringify(updated));
  };

  const addToCart = async (product, size = 'M', color = 'Standard', quantity = 1) => {
    const qty = parseInt(quantity, 10) || 1;

    if (!user) {
      // Guest cart flow
      const currentItems = [...cart.items];
      const itemId = `${product._id}_${size}_${color}`;
      const existing = currentItems.find(it => it.itemId === itemId);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, product.stock || 99);
      } else {
        currentItems.push({
          itemId,
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || '/images/placeholder-sock.jpg',
          price: product.price,
          originalPrice: product.originalPrice,
          size,
          color,
          quantity: Math.min(qty, product.stock || 99),
          availableStock: product.stock
        });
      }
      saveGuestCart(currentItems);
      setIsCartOpen(true);
      return;
    }

    try {
      setLoading(true);
      const res = await api.addToCart({
        productId: product._id,
        size,
        color,
        quantity: qty
      });
      if (res.data) {
        setCart(res.data);
      }
      setIsCartOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to add item to bag.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const qty = parseInt(quantity, 10);

    if (!user) {
      let currentItems = [...cart.items];
      if (qty <= 0) {
        currentItems = currentItems.filter(it => it.itemId !== itemId);
      } else {
        const item = currentItems.find(it => it.itemId === itemId);
        if (item) item.quantity = qty;
      }
      saveGuestCart(currentItems);
      return;
    }

    try {
      setLoading(true);
      const res = await api.updateCartItem(itemId, qty);
      if (res.data) setCart(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      const currentItems = cart.items.filter(it => it.itemId !== itemId);
      saveGuestCart(currentItems);
      return;
    }

    try {
      setLoading(true);
      const res = await api.removeCartItem(itemId);
      if (res.data) setCart(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem('socktales_guest_cart');
      setCart({ items: [], subtotal: 0, totalItems: 0, isFreeShipping: false });
      return;
    }

    try {
      setLoading(true);
      await api.clearCart();
      setCart({ items: [], subtotal: 0, totalItems: 0, isFreeShipping: false });
    } catch (err) {
      console.warn('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
