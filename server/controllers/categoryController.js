const { getDb } = require('../config/db');
const { sendJson, sendError } = require('../utils/response');
const { ObjectId } = require('mongodb');

class CategoryController {
  async list(req, res) {
    try {
      const db = getDb();
      const categories = await db.collection('categories').find({}).toArray();
      return sendJson(res, 200, { categories }, 'Categories retrieved.');
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  async create(req, res) {
    const { name, slug, description, image, banner } = req.body;
    if (!name) {
      return sendError(res, 400, 'Category name is required.');
    }

    try {
      const db = getDb();
      const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const doc = {
        name,
        slug: categorySlug,
        description: description || '',
        image: image || '/images/categories/movie-inspired.jpg',
        banner: banner || image || '/images/categories/movie-inspired.jpg',
        createdAt: new Date()
      };

      const result = await db.collection('categories').insertOne(doc);
      return sendJson(res, 201, { category: { ...doc, _id: result.insertedId } }, 'Category created.');
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  async update(req, res) {
    try {
      const db = getDb();
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return sendError(res, 400, 'Invalid category ID.');
      }

      const updateData = { ...req.body, updatedAt: new Date() };
      delete updateData._id;

      const result = await db.collection('categories').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      return sendJson(res, 200, { category: result }, 'Category updated.');
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  async delete(req, res) {
    try {
      const db = getDb();
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return sendError(res, 400, 'Invalid category ID.');
      }

      await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
      return sendJson(res, 200, null, 'Category deleted.');
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }
}

module.exports = new CategoryController();
