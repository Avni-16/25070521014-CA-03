const { getDb } = require('../config/db');
const { sendJson, sendError } = require('../utils/response');
const { ObjectId } = require('mongodb');

class UserController {
  async getProfile(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }
    return sendJson(res, 200, { user: req.user }, 'Profile retrieved.');
  }

  async updateProfile(req, res) {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    const { name, phone, address } = req.body;
    const db = getDb();

    const updates = { updatedAt: new Date() };
    if (name && typeof name === 'string') updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    try {
      const updateOp = { $set: updates };
      if (address && typeof address === 'object') {
        updateOp.$set.defaultAddress = address;
      }

      const updatedUser = await db.collection('users').findOneAndUpdate(
        { _id: req.user._id },
        updateOp,
        { projection: { passwordHash: 0 }, returnDocument: 'after' }
      );

      return sendJson(res, 200, { user: updatedUser }, 'Profile updated successfully.');
    } catch (err) {
      return sendError(res, 500, 'Error updating profile.');
    }
  }

  async getAdminStats(req, res) {
    try {
      const db = getDb();
      const totalUsers = await db.collection('users').countDocuments({});
      const totalProducts = await db.collection('products').countDocuments({});
      const totalOrders = await db.collection('orders').countDocuments({});

      const revenueAgg = await db.collection('orders').aggregate([
        { $match: { 'payment.status': { $in: ['completed', 'pending_cod'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
      ]).toArray();

      const totalRevenue = revenueAgg[0] ? Math.round(revenueAgg[0].totalRevenue * 100) / 100 : 0;

      const recentOrders = await db.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      const lowStockProducts = await db.collection('products')
        .find({ stock: { $lte: 10 } })
        .limit(6)
        .toArray();

      return sendJson(res, 200, {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue
        },
        recentOrders,
        lowStockProducts
      }, 'Admin dashboard metrics retrieved.');
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }
}

module.exports = new UserController();
