const cartService = require('../services/cartService');
const { sendJson, sendError } = require('../utils/response');

class CartController {
  async get(req, res) {
    try {
      const userId = req.user ? req.user._id : 'guest_cart';
      if (!req.user) {
        return sendJson(res, 200, { items: [], subtotal: 0, totalItems: 0 }, 'Guest cart.');
      }
      const cart = await cartService.getCart(userId);
      return sendJson(res, 200, cart, 'Cart retrieved.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async addItem(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Please sign in to add items to your cart.');
    }
    const { productId, size, color, quantity } = req.body;
    if (!productId) {
      return sendError(res, 400, 'Product ID is required.');
    }

    try {
      const cart = await cartService.addItem(req.user._id, { productId, size, color, quantity });
      return sendJson(res, 200, cart, 'Item added to cart.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async updateItem(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Please sign in.');
    }
    const { quantity } = req.body;
    if (quantity === undefined) {
      return sendError(res, 400, 'Quantity is required.');
    }

    try {
      const cart = await cartService.updateItemQuantity(req.user._id, req.params.id, quantity);
      return sendJson(res, 200, cart, 'Cart updated.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async removeItem(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Please sign in.');
    }

    try {
      const cart = await cartService.removeItem(req.user._id, req.params.id);
      return sendJson(res, 200, cart, 'Item removed from cart.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async clear(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Please sign in.');
    }

    try {
      await cartService.clearCart(req.user._id);
      return sendJson(res, 200, { items: [], subtotal: 0, totalItems: 0 }, 'Cart cleared.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }
}

module.exports = new CartController();
