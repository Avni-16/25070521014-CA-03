const test = require('node:test');
const assert = require('node:assert');
const { connectDb, closeDb, getDb } = require('../config/db');
const productService = require('../services/productService');
const cartService = require('../services/cartService');
const orderService = require('../services/orderService');
const { ObjectId } = require('mongodb');

test('Cart and Order Checkout with Stock Verification Suite', async (t) => {
  await connectDb();
  const db = getDb();

  const testUserId = new ObjectId();
  await db.collection('users').insertOne({
    _id: testUserId,
    name: 'Order Tester',
    email: `ordertest_${Date.now()}@socktales.test`,
    role: 'customer'
  });

  // Create temporary test product with 5 stock
  const product = await productService.createProduct({
    name: 'Dune Arrakis Sand Dune Knit',
    collection: 'Movie-Inspired',
    movieReference: 'Dune (2021)',
    price: 30,
    stock: 5,
    sizes: ['M', 'L'],
    colors: ['Desert Sand']
  });

  await t.test('Add item to customer cart and verify hydrated pricing', async () => {
    const cart = await cartService.addItem(testUserId, {
      productId: product._id,
      size: 'M',
      color: 'Desert Sand',
      quantity: 2
    });

    assert.strictEqual(cart.items.length, 1);
    assert.strictEqual(cart.items[0].quantity, 2);
    assert.strictEqual(cart.subtotal, 60); // 30 * 2
  });

  await t.test('Prevent ordering more than available inventory', async () => {
    // Attempt adding 10 when only 5 in stock
    const cart = await cartService.addItem(testUserId, {
      productId: product._id,
      size: 'M',
      color: 'Desert Sand',
      quantity: 10
    });

    assert.strictEqual(cart.items[0].quantity, 5, 'Cart must cap quantity at maximum available stock');
  });

  await t.test('Complete checkout: creates order, decrements stock atomically, and clears cart', async () => {
    const currentCart = await cartService.getCart(testUserId);
    const itemId = currentCart.items[0].itemId;
    await cartService.updateItemQuantity(testUserId, itemId, 2);

    const order = await orderService.createOrder(testUserId, {
      shippingAddress: {
        fullName: 'Order Tester',
        street: '88 Cinema Way',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        phone: '+91 99999 88888'
      },
      paymentMethod: 'cod'
    });

    assert.ok(order.orderNumber.startsWith('ST-'), 'Order number format check');
    assert.strictEqual(order.pricing.subtotal, 60);
    assert.strictEqual(order.items.length, 1);

    // Verify product stock in DB was decremented: 5 - 2 = 3
    const refreshedProduct = await productService.getProductByIdOrSlug(product._id);
    assert.strictEqual(refreshedProduct.stock, 3, 'Stock must be reduced from 5 to 3');

    // Verify cart was emptied
    const refreshedCart = await cartService.getCart(testUserId);
    assert.strictEqual(refreshedCart.items.length, 0, 'Cart must be cleared after successful order');
  });

  // Clean up
  await db.collection('products').deleteOne({ _id: product._id });
  await db.collection('users').deleteOne({ _id: testUserId });
  await db.collection('carts').deleteOne({ userId: testUserId });
  await db.collection('orders').deleteMany({ customerId: testUserId });

  await closeDb();
});
