const { sendError } = require('../utils/response');

// In-memory sliding window rate limiter
const ipRequests = new Map();

function rateLimiter(limit = 30, windowMs = 60 * 1000) {
  return function(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    const timestamps = ipRequests.get(ip).filter(time => now - time < windowMs);
    timestamps.push(now);
    ipRequests.set(ip, timestamps);

    if (timestamps.length > limit) {
      return sendError(res, 429, 'Too many requests. Please try again after a minute.');
    }
    return next();
  };
}

module.exports = {
  rateLimiter
};
