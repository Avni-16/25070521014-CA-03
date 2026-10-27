const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

class ProductService {
  async listProducts(query = {}) {
    const db = getDb();
    const filter = { active: { $ne: false } };

    // Search keyword
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { movieReference: { $regex: term, $options: 'i' } },
        { collection: { $regex: term, $options: 'i' } },
        { franchise: { $regex: term, $options: 'i' } },
        { categories: { $regex: term, $options: 'i' } }
      ];
    }

    // Collection or Franchise filter
    if (query.collection && query.collection !== 'all') {
      const colRegex = query.collection.replace(/-/g, '.*');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { collection: { $regex: `^${query.collection}$`, $options: 'i' } },
          { collection: { $regex: colRegex, $options: 'i' } },
          { franchise: { $regex: colRegex, $options: 'i' } },
          { categories: { $in: [new RegExp(query.collection.replace(/-/g, '.*'), 'i')] } }
        ]
      });
    }

    // Franchise filter
    if (query.franchise && query.franchise !== 'all') {
      filter.franchise = { $regex: query.franchise, $options: 'i' };
    }

    // Category filter
    if (query.category) {
      filter.categories = { $in: [new RegExp(`^${query.category}$`, 'i')] };
    }

    // Size filter
    if (query.size) {
      filter.sizes = { $in: [query.size.toUpperCase()] };
    }

    // Colour filter
    if (query.color) {
      filter.colors = { $in: [new RegExp(`^${query.color}$`, 'i')] };
    }

    // In Stock filter
    if (query.inStock === 'true' || query.inStock === true) {
      filter.stock = { $gt: 0 };
    }

    // Featured
    if (query.featured === 'true' || query.featured === true) {
      filter.isFeatured = true;
    }

    // Price range
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (query.sort === 'price_asc') sort = { price: 1 };
    else if (query.sort === 'price_desc') sort = { price: -1 };
    else if (query.sort === 'rating') sort = { rating: -1 };
    else if (query.sort === 'oldest') sort = { createdAt: 1 };
    else if (query.sort === 'name_asc') sort = { name: 1 };

    // Pagination
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 24));
    const skip = (page - 1) * limit;

    const total = await db.collection('products').countDocuments(filter);
    const products = await db.collection('products')
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProductByIdOrSlug(idOrSlug) {
    const db = getDb();
    let query;

    if (idOrSlug instanceof ObjectId) {
      query = { _id: idOrSlug };
    } else if (typeof idOrSlug === 'string' && ObjectId.isValid(idOrSlug) && idOrSlug.length === 24) {
      query = { $or: [{ _id: new ObjectId(idOrSlug) }, { slug: idOrSlug }] };
    } else {
      query = { slug: idOrSlug };
    }

    const product = await db.collection('products').findOne(query);
    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  async createProduct(data) {
    const db = getDb();
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await db.collection('products').findOne({ slug });
    if (existing) {
      const err = new Error('A product with this slug or title already exists.');
      err.statusCode = 409;
      throw err;
    }

    const doc = {
      name: data.name,
      slug,
      description: data.description || '',
      movieReference: data.movieReference || '',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/placeholder-sock.jpg'],
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      discountBadge: data.discountBadge || null,
      collection: data.collection || 'Movie-Inspired',
      categories: Array.isArray(data.categories) ? data.categories : ['socks'],
      sizes: Array.isArray(data.sizes) && data.sizes.length ? data.sizes : ['S', 'M', 'L'],
      colors: Array.isArray(data.colors) && data.colors.length ? data.colors : ['Black', 'Gold'],
      stock: Number(data.stock) || 0,
      material: data.material || '80% Combed Cotton, 17% Polyamide, 3% Elastane',
      rating: Number(data.rating) || 4.9,
      reviewsCount: Number(data.reviewsCount) || 12,
      isFeatured: Boolean(data.isFeatured),
      active: data.active !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async updateProduct(id, data) {
    const db = getDb();
    if (!ObjectId.isValid(id)) {
      const err = new Error('Invalid product ID format.');
      err.statusCode = 400;
      throw err;
    }

    const updateFields = {
      ...data,
      updatedAt: new Date()
    };
    delete updateFields._id;
    if (updateFields.price !== undefined) updateFields.price = Number(updateFields.price);
    if (updateFields.stock !== undefined) updateFields.stock = Number(updateFields.stock);
    if (updateFields.originalPrice !== undefined) updateFields.originalPrice = Number(updateFields.originalPrice);

    const result = await db.collection('products').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    return result;
  }

  async deleteProduct(id) {
    const db = getDb();
    if (!ObjectId.isValid(id)) {
      const err = new Error('Invalid product ID format.');
      err.statusCode = 400;
      throw err;
    }

    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    return true;
  }

  async updateStock(id, newStock) {
    const db = getDb();
    if (!ObjectId.isValid(id)) {
      const err = new Error('Invalid product ID.');
      err.statusCode = 400;
      throw err;
    }

    const stock = Number(newStock);
    if (isNaN(stock) || stock < 0) {
      const err = new Error('Stock must be a positive number.');
      err.statusCode = 400;
      throw err;
    }

    const result = await db.collection('products').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { stock, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    return result;
  }
}

module.exports = new ProductService();
