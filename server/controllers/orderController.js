const orderService = require('../services/orderService');
const { validateCheckoutInput } = require('../utils/validators');
const { sendJson, sendError } = require('../utils/response');

class OrderController {
  async checkout(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Please sign in to complete checkout.');
    }

    const { isValid, errors } = validateCheckoutInput(req.body);
    if (!isValid) {
      return sendError(res, 400, 'Invalid checkout details.', errors);
    }

    try {
      const order = await orderService.createOrder(req.user._id, req.body);
      return sendJson(res, 201, { order }, 'Order placed successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async getMyOrders(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    try {
      const orders = await orderService.getUserOrders(req.user._id);
      return sendJson(res, 200, { orders }, 'User order history retrieved.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async getOne(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    try {
      const isAdmin = req.user.role === 'admin';
      const order = await orderService.getOrderById(req.params.id, req.user._id, isAdmin);
      return sendJson(res, 200, { order }, 'Order details retrieved.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  // Admin endpoints
  async listAll(req, res) {
    try {
      const data = await orderService.getAllOrders(req.query);
      return sendJson(res, 200, data, 'All customer orders retrieved.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async updateStatus(req, res) {
    const { status, trackingNumber } = req.body;
    if (!status) {
      return sendError(res, 400, 'Status is required.');
    }

    try {
      const order = await orderService.updateOrderStatus(req.params.id, status, trackingNumber);
      return sendJson(res, 200, { order }, 'Order status updated.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }
}

module.exports = new OrderController();
