const productService = require('../services/productService');
const { validateProductInput } = require('../utils/validators');
const { sendJson, sendError } = require('../utils/response');

class ProductController {
  async list(req, res) {
    try {
      const data = await productService.listProducts(req.query);
      return sendJson(res, 200, data, 'Products retrieved successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async getOne(req, res) {
    try {
      const product = await productService.getProductByIdOrSlug(req.params.id);
      return sendJson(res, 200, { product }, 'Product details retrieved.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async create(req, res) {
    const { isValid, errors } = validateProductInput(req.body);
    if (!isValid) {
      return sendError(res, 400, 'Validation failed.', errors);
    }

    try {
      const product = await productService.createProduct(req.body);
      return sendJson(res, 201, { product }, 'Product created successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async update(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      return sendJson(res, 200, { product }, 'Product updated successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async delete(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      return sendJson(res, 200, null, 'Product deleted successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }

  async updateStock(req, res) {
    try {
      const { stock } = req.body;
      const product = await productService.updateStock(req.params.id, stock);
      return sendJson(res, 200, { product }, 'Stock updated successfully.');
    } catch (err) {
      return sendError(res, err.statusCode || 500, err.message);
    }
  }
}

module.exports = new ProductController();
