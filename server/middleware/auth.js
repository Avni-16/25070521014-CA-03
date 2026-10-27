const { getDb } = require('../config/db');
const { parseCookies } = require('../utils/cookie');
const { hashToken } = require('../utils/crypto');
const { sendError } = require('../utils/response');
const env = require('../config/env');
const { ObjectId } = require('mongodb');

async function authenticate(req, res, next) {
  req.user = null;
  req.session = null;

  try {
    const cookies = parseCookies(req);
    let token = cookies[env.COOKIE_NAME];

    // Also support Authorization: Bearer <token> for testing/flexibility
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const tokenHash = hashToken(token);
    const db = getDb();
    const session = await db.collection('sessions').findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return next();
    }

    const userId = typeof session.userId === 'string' ? new ObjectId(session.userId) : session.userId;
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { passwordHash: 0 } }
    );

    if (user) {
      req.user = user;
      req.session = session;
    }
  } catch (err) {
    console.error('[AuthMiddleware] Error:', err.message);
  }

  return next();
}

function requireAuth(req, res, next) {
  authenticate(req, res, () => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required. Please sign in.');
    }
    return next();
  });
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return sendError(res, 403, 'Access denied. Administrator privileges required.');
    }
    return next();
  });
}

module.exports = {
  authenticate,
  requireAuth,
  requireAdmin
};
