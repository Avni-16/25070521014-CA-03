const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

class CartService {
  async getCart(userId) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;

    let cart = await db.collection('carts').findOne({ userId: uid });
    if (!cart) {
      cart = {
        userId: uid,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection('carts').insertOne(cart);
      return { items: [], subtotal: 0, totalItems: 0 };
    }

    // Hydrate items with fresh product data & calculate subtotal
    let subtotal = 0;
    let totalItems = 0;
    const hydratedItems = [];

    for (const item of cart.items) {
      const pid = typeof item.productId === 'string' ? new ObjectId(item.productId) : item.productId;
      const product = await db.collection('products').findOne({ _id: pid });

      if (product && product.active !== false) {
        // Enforce actual db price (never trust stale prices)
        const currentPrice = Number(product.price);
        const itemTotal = currentPrice * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;

        hydratedItems.push({
          itemId: item.itemId || `${item.productId}_${item.size}_${item.color}`,
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images && product.images[0] ? product.images[0] : '/images/placeholder-sock.jpg',
          price: currentPrice,
          originalPrice: product.originalPrice,
          size: item.size || 'M',
          color: item.color || 'Standard',
          quantity: item.quantity,
          availableStock: product.stock,
          isOutOfStock: product.stock <= 0
        });
      }
    }

    return {
      items: hydratedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      totalItems,
      freeShippingThreshold: 999,
      isFreeShipping: subtotal >= 999
    };
  }

  async addItem(userId, { productId, size = 'M', color = 'Standard', quantity = 1 }) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const pid = typeof productId === 'string' ? new ObjectId(productId) : productId;

    const product = await db.collection('products').findOne({ _id: pid, active: { $ne: false } });
    if (!product) {
      const err = new Error('Product not found or inactive.');
      err.statusCode = 404;
      throw err;
    }

    if (product.stock <= 0) {
      const err = new Error('This item is currently out of stock.');
      err.statusCode = 400;
      throw err;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const itemId = `${pid.toString()}_${size}_${color}`;

    let cart = await db.collection('carts').findOne({ userId: uid });
    if (!cart) {
      cart = { userId: uid, items: [], createdAt: new Date() };
    }

    const existingIndex = cart.items.findIndex(it =>
      (it.itemId && it.itemId === itemId) ||
      (it.productId.toString() === pid.toString() && it.size === size && it.color === color)
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (newQty > product.stock) {
        cart.items[existingIndex].quantity = product.stock;
      } else {
        cart.items[existingIndex].quantity = newQty;
      }
    } else {
      cart.items.push({
        itemId,
        productId: pid,
        size,
        color,
        quantity: Math.min(qty, product.stock),
        addedAt: new Date()
      });
    }

    await db.collection('carts').updateOne(
      { userId: uid },
      { $set: { items: cart.items, updatedAt: new Date() } },
      { upsert: true }
    );

    return this.getCart(userId);
  }

  async updateItemQuantity(userId, itemId, quantity) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const qty = parseInt(quantity, 10);

    const cart = await db.collection('carts').findOne({ userId: uid });
    if (!cart) {
      const err = new Error('Cart not found.');
      err.statusCode = 404;
      throw err;
    }

    if (qty <= 0) {
      return this.removeItem(userId, itemId);
    }

    const item = cart.items.find(it => it.itemId === itemId || it.productId.toString() === itemId);
    if (!item) {
      const err = new Error('Item not found in cart.');
      err.statusCode = 404;
      throw err;
    }

    const pid = typeof item.productId === 'string' ? new ObjectId(item.productId) : item.productId;
    const product = await db.collection('products').findOne({ _id: pid });
    if (product && qty > product.stock) {
      item.quantity = product.stock;
    } else {
      item.quantity = qty;
    }

    await db.collection('carts').updateOne(
      { userId: uid },
      { $set: { items: cart.items, updatedAt: new Date() } }
    );

    return this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;

    await db.collection('carts').updateOne(
      { userId: uid },
      {
        $pull: {
          items: {
            $or: [
              { itemId },
              { productId: ObjectId.isValid(itemId) ? new ObjectId(itemId) : null }
            ]
          }
        },
        $set: { updatedAt: new Date() }
      }
    );

    return this.getCart(userId);
  }

  async clearCart(userId, session = null) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const options = session ? { session } : {};

    await db.collection('carts').updateOne(
      { userId: uid },
      { $set: { items: [], updatedAt: new Date() } },
      options
    );
  }
}

module.exports = new CartService();
