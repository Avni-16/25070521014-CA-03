const { getDb, withTransaction } = require('../config/db');
const cartService = require('./cartService');
const { ObjectId } = require('mongodb');

class OrderService {
  async createOrder(userId, { shippingAddress, paymentMethod, paymentDetails = {} }) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;

    // Fetch user
    const user = await db.collection('users').findOne({ _id: uid });
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    // Retrieve user's current cart
    const cart = await cartService.getCart(uid);
    if (!cart.items || cart.items.length === 0) {
      const err = new Error('Your cart is empty. Please add items before checking out.');
      err.statusCode = 400;
      throw err;
    }

    // Server-side authoritative validation and price recalculation
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of cart.items) {
      const pid = typeof item.productId === 'string' ? new ObjectId(item.productId) : item.productId;
      const product = await db.collection('products').findOne({ _id: pid });

      if (!product || product.active === false) {
        const err = new Error(`Item "${item.name}" is no longer available.`);
        err.statusCode = 400;
        throw err;
      }

      if (product.stock < item.quantity) {
        const err = new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`);
        err.statusCode = 400;
        throw err;
      }

      const verifiedPrice = Number(product.price);
      subtotal += verifiedPrice * item.quantity;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images && product.images[0] ? product.images[0] : '/images/placeholder-sock.jpg',
        price: verifiedPrice,
        size: item.size || 'M',
        color: item.color || 'Standard',
        quantity: item.quantity
      });
    }

    const shippingFee = subtotal >= 999 ? 0 : 99;
    const total = Math.round((subtotal + shippingFee) * 100) / 100;
    const orderNumber = `ST-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const orderDoc = {
      orderNumber,
      customerId: uid,
      customerEmail: user.email,
      customerName: shippingAddress.fullName || user.name,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
        phone: shippingAddress.phone
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending_cod' : 'completed',
        transactionId: paymentMethod === 'cod' ? `COD-${orderNumber}` : `PAY-${Date.now()}`,
        paidAt: paymentMethod === 'cod' ? null : new Date()
      },
      pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        shippingFee,
        total
      },
      items: verifiedItems,
      status: paymentMethod === 'cod' ? 'Pending' : 'Processing',
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Execute with atomic MongoDB transaction to prevent race conditions & overselling
    await withTransaction(async (session) => {
      const sessionOptions = session ? { session } : {};

      // 1. Decrement inventory atomically
      for (const it of verifiedItems) {
        const updateResult = await db.collection('products').updateOne(
          { _id: it.productId, stock: { $gte: it.quantity } },
          { $inc: { stock: -it.quantity } },
          sessionOptions
        );

        if (updateResult.modifiedCount === 0) {
          const err = new Error(`Stock conflict occurred for "${it.name}". Please review your cart.`);
          err.statusCode = 409;
          throw err;
        }
      }

      // 2. Insert order
      const insertResult = await db.collection('orders').insertOne(orderDoc, sessionOptions);
      orderDoc._id = insertResult.insertedId;

      // 3. Clear cart
      await cartService.clearCart(uid, session);
    });

    return orderDoc;
  }

  async getOrderById(orderId, userId, isAdmin = false) {
    const db = getDb();
    let query;

    if (ObjectId.isValid(orderId) && orderId.length === 24) {
      query = { $or: [{ _id: new ObjectId(orderId) }, { orderNumber: orderId }] };
    } else {
      query = { orderNumber: orderId };
    }

    const order = await db.collection('orders').findOne(query);
    if (!order) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }

    // Enforce authorization
    if (!isAdmin && order.customerId.toString() !== userId.toString()) {
      const err = new Error('You are not authorized to view this order.');
      err.statusCode = 403;
      throw err;
    }

    return order;
  }

  async getUserOrders(userId) {
    const db = getDb();
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;

    return await db.collection('orders')
      .find({ customerId: uid })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getAllOrders(query = {}) {
    const db = getDb();
    const filter = {};

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        { orderNumber: { $regex: query.search, $options: 'i' } },
        { customerEmail: { $regex: query.search, $options: 'i' } },
        { customerName: { $regex: query.search, $options: 'i' } }
      ];
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const total = await db.collection('orders').countDocuments(filter);
    const orders = await db.collection('orders')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateOrderStatus(orderId, newStatus, trackingNumber = null) {
    const db = getDb();
    if (!ObjectId.isValid(orderId)) {
      const err = new Error('Invalid order ID format.');
      err.statusCode = 400;
      throw err;
    }

    const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(newStatus)) {
      const err = new Error(`Status must be one of: ${allowed.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const updateFields = {
      status: newStatus,
      updatedAt: new Date()
    };
    if (trackingNumber) {
      updateFields.trackingNumber = trackingNumber;
    }

    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }

    return result;
  }
}

module.exports = new OrderService();
