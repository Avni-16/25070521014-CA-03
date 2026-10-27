const { getDb } = require('../config/db');
const { hashPassword, verifyPassword, generateToken, hashToken } = require('../utils/crypto');
const { ObjectId } = require('mongodb');
const env = require('../config/env');

class AuthService {
  async register({ name, email, password, phone = '', role = 'customer' }) {
    const db = getDb();
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate
    const existing = await db.collection('users').findOne({ email: normalizedEmail });
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(password);
    const userDoc = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'customer',
      phone: phone.trim(),
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(userDoc);
    const userId = result.insertedId;

    // Create session
    const { token, session } = await this.createSession(userId);

    return {
      user: {
        _id: userId,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        phone: userDoc.phone
      },
      token,
      session
    };
  }

  async login({ email, password }) {
    const db = getDb();
    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.collection('users').findOne({ email: normalizedEmail });
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const matches = await verifyPassword(password, user.passwordHash);
    if (!matches) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const { token, session } = await this.createSession(user._id);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || ''
      },
      token,
      session
    };
  }

  async createSession(userId) {
    const db = getDb();
    const rawToken = generateToken(32);
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.SESSION_MAX_AGE_DAYS);

    const sessionDoc = {
      userId,
      tokenHash,
      createdAt: new Date(),
      expiresAt
    };

    await db.collection('sessions').insertOne(sessionDoc);
    return { token: rawToken, session: sessionDoc };
  }

  async logout(token) {
    if (!token) return;
    const db = getDb();
    const tokenHash = hashToken(token);
    await db.collection('sessions').deleteOne({ tokenHash });
  }

  async getCurrentUser(userId) {
    const db = getDb();
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return await db.collection('users').findOne(
      { _id: id },
      { projection: { passwordHash: 0 } }
    );
  }
}

module.exports = new AuthService();
