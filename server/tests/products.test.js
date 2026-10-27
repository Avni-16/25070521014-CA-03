const test = require('node:test');
const assert = require('node:assert');
const { connectDb, closeDb, getDb } = require('../config/db');
const productService = require('../services/productService');

test('Product Catalogue and CRUD Suite', async (t) => {
  await connectDb();
  let createdProductId = null;

  await t.test('Admin can create a new movie-inspired sock product', async () => {
    const newProduct = await productService.createProduct({
      name: 'Blade Runner Neon Cyber Calf',
      movieReference: 'Blade Runner 2049',
      collection: 'Movie-Inspired',
      description: 'Futuristic synthetic blend with reflective amber micro-fibres.',
      price: 29,
      originalPrice: 38,
      stock: 40,
      sizes: ['S', 'M', 'L'],
      colors: ['Amber Glow', 'Onyx Black']
    });

    assert.ok(newProduct._id, 'Product ID must be generated');
    assert.strictEqual(newProduct.name, 'Blade Runner Neon Cyber Calf');
    assert.strictEqual(newProduct.stock, 40);
    createdProductId = newProduct._id.toString();
  });

  await t.test('Search and filter products by collection and query', async () => {
    const res = await productService.listProducts({
      collection: 'Movie-Inspired',
      search: 'Blade Runner'
    });

    assert.ok(res.products.length > 0, 'Should find created product');
    assert.strictEqual(res.products[0].movieReference, 'Blade Runner 2049');
  });

  await t.test('Admin can update product details and stock', async () => {
    const updated = await productService.updateStock(createdProductId, 85);
    assert.strictEqual(updated.stock, 85, 'Stock should be updated to 85');
  });

  await t.test('Admin can delete a product', async () => {
    const deleted = await productService.deleteProduct(createdProductId);
    assert.strictEqual(deleted, true);

    await assert.rejects(
      async () => {
        await productService.getProductByIdOrSlug(createdProductId);
      },
      (err) => {
        assert.strictEqual(err.statusCode, 404);
        return true;
      }
    );
  });

  await closeDb();
});
