const authService = require('../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');
const { sendJson, sendError } = require('../utils/response');
const { setSessionCookie, clearSessionCookie, parseCookies } = require('../utils/cookie');
const env = require('../config/env');

class AuthController {
  async register(req, res) {
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      return sendError(res, 400, 'Validation failed.', errors);
    }

    try {
      const result = await authService.register(req.body);
      setSessionCookie(res, result.token);
      return sendJson(res, 201, {
        user: result.user,
        token: result.token
      }, 'Account created successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async login(req, res) {
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      return sendError(res, 400, 'Validation failed.', errors);
    }

    try {
      const result = await authService.login(req.body);
      setSessionCookie(res, result.token);
      return sendJson(res, 200, {
        user: result.user,
        token: result.token
      }, 'Logged in successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async logout(req, res) {
    try {
      const cookies = parseCookies(req);
      const token = cookies[env.COOKIE_NAME];
      if (token) {
        await authService.logout(token);
      }
      clearSessionCookie(res);
      return sendJson(res, 200, null, 'Logged out successfully.');
    } catch (err) {
      clearSessionCookie(res);
      return sendError(res, 500, 'Error during logout.');
    }
  }

  async me(req, res) {
    if (!req.user) {
      return sendJson(res, 200, { user: null }, 'No active session.');
    }
    return sendJson(res, 200, { user: req.user }, 'Current session retrieved.');
  }
}

module.exports = new AuthController();
