const { URL } = require('url');
const { sendError } = require('../utils/response');

class Router {
  constructor() {
    this.routes = [];
  }

  add(method, path, ...handlers) {
    const paramNames = [];
    const regexPath = path
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    this.routes.push({
      method: method.toUpperCase(),
      path,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
      handlers
    });
  }

  get(path, ...handlers) { this.add('GET', path, ...handlers); }
  post(path, ...handlers) { this.add('POST', path, ...handlers); }
  put(path, ...handlers) { this.add('PUT', path, ...handlers); }
  patch(path, ...handlers) { this.add('PATCH', path, ...handlers); }
  delete(path, ...handlers) { this.add('DELETE', path, ...handlers); }

  async handle(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    
    // Parse query parameters
    req.query = {};
    parsedUrl.searchParams.forEach((value, key) => {
      req.query[key] = value;
    });

    const method = req.method.toUpperCase();

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = pathname.match(route.regex);
      if (match) {
        req.params = {};
        route.paramNames.forEach((name, idx) => {
          req.params[name] = decodeURIComponent(match[idx + 1]);
        });

        // Run middleware chain
        return this.runHandlers(req, res, route.handlers);
      }
    }

    // 404 Route Not Found
    return sendError(res, 404, `API route [${method} ${pathname}] not found.`);
  }

  async runHandlers(req, res, handlers) {
    let index = 0;

    const next = async (err) => {
      if (err) {
        console.error('[Router Handler Error]:', err);
        return sendError(res, err.statusCode || 500, err.message || 'Internal Server Error');
      }

      if (index >= handlers.length) return;

      const handler = handlers[index++];
      try {
        await handler(req, res, next);
      } catch (handlerErr) {
        console.error('[Router Uncaught Error]:', handlerErr);
        if (!res.writableEnded) {
          sendError(res, handlerErr.statusCode || 500, handlerErr.message || 'Internal Server Error');
        }
      }
    };

    return next();
  }
}

module.exports = Router;
