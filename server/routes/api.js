const Router = require('./router');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');

const { authenticate, requireAuth, requireAdmin } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

function createApiRouter() {
  const router = new Router();

  // Auth Routes
  router.post('/api/v1/auth/register', rateLimiter(20), (req, res) => authController.register(req, res));
  router.post('/api/v1/auth/login', rateLimiter(20), (req, res) => authController.login(req, res));
  router.post('/api/v1/auth/logout', (req, res) => authController.logout(req, res));
  router.get('/api/v1/auth/me', authenticate, (req, res) => authController.me(req, res));

  // Product Routes
  router.get('/api/v1/products', (req, res) => productController.list(req, res));
  router.post('/api/v1/products', requireAdmin, (req, res) => productController.create(req, res));
  router.get('/api/v1/products/:id', (req, res) => productController.getOne(req, res));
  router.put('/api/v1/products/:id', requireAdmin, (req, res) => productController.update(req, res));
  router.delete('/api/v1/products/:id', requireAdmin, (req, res) => productController.delete(req, res));
  router.patch('/api/v1/products/:id/stock', requireAdmin, (req, res) => productController.updateStock(req, res));

  // Category & Collection Routes
  router.get('/api/v1/categories', (req, res) => categoryController.list(req, res));
  router.post('/api/v1/categories', requireAdmin, (req, res) => categoryController.create(req, res));
  router.put('/api/v1/categories/:id', requireAdmin, (req, res) => categoryController.update(req, res));
  router.delete('/api/v1/categories/:id', requireAdmin, (req, res) => categoryController.delete(req, res));

  // Cart Routes
  router.get('/api/v1/cart', authenticate, (req, res) => cartController.get(req, res));
  router.post('/api/v1/cart/items', authenticate, (req, res) => cartController.addItem(req, res));
  router.put('/api/v1/cart/items/:id', authenticate, (req, res) => cartController.updateItem(req, res));
  router.delete('/api/v1/cart/items/:id', authenticate, (req, res) => cartController.removeItem(req, res));
  router.delete('/api/v1/cart', authenticate, (req, res) => cartController.clear(req, res));

  // Order Routes
  router.post('/api/v1/orders', requireAuth, (req, res) => orderController.checkout(req, res));
  router.get('/api/v1/orders', requireAuth, (req, res) => orderController.getMyOrders(req, res));
  router.get('/api/v1/orders/:id', requireAuth, (req, res) => orderController.getOne(req, res));

  // Admin Routes
  router.get('/api/v1/admin/orders', requireAdmin, (req, res) => orderController.listAll(req, res));
  router.patch('/api/v1/admin/orders/:id/status', requireAdmin, (req, res) => orderController.updateStatus(req, res));
  router.get('/api/v1/admin/stats', requireAdmin, (req, res) => userController.getAdminStats(req, res));

  // User Profile Routes
  router.get('/api/v1/users/profile', requireAuth, (req, res) => userController.getProfile(req, res));
  router.put('/api/v1/users/profile', requireAuth, (req, res) => userController.updateProfile(req, res));

  return router;
}

module.exports = {
  createApiRouter
};
