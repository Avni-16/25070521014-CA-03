const { MongoClient } = require('mongodb');
const env = require('./env');
const path = require('path');
const fs = require('fs');

let client = null;
let db = null;
let memoryServer = null;
let isReplicaSet = false;

async function startEmbeddedMongoIfAvailable() {
  try {
    const { MongoMemoryReplSet } = require('mongodb-memory-server');
    console.log('[DB] Attempting to launch local MongoDB replica set for development...');
    const dataDir = path.resolve(__dirname, '..', 'data', 'db');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    memoryServer = await MongoMemoryReplSet.create({
      replSet: {
        name: 'rs0',
        count: 1,
        storageEngine: 'wiredTiger',
        dbPath: dataDir
      },
      instanceOpts: [
        {
          port: 27017,
          dbPath: dataDir
        }
      ]
    });

    const uri = memoryServer.getUri();
    console.log(`[DB] Embedded MongoDB Replica Set started at: ${uri}`);
    return uri;
  } catch (err) {
    console.warn('[DB] Embedded MongoMemoryReplSet could not start on default port, checking if regular mongod is active or trying dynamic port:', err.message);
    try {
      const { MongoMemoryReplSet } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryReplSet.create({
        replSet: { name: 'rs0', count: 1 }
      });
      const uri = memoryServer.getUri();
      console.log(`[DB] Embedded MongoDB Replica Set started on dynamic port: ${uri}`);
      return uri;
    } catch (innerErr) {
      console.warn('[DB] Could not start embedded MongoDB:', innerErr.message);
      return null;
    }
  }
}

async function connectDb() {
  if (db) return db;

  let uri = env.MONGODB_URI;

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    await client.connect();
    console.log(`[DB] Connected to MongoDB at: ${uri}`);
  } catch (initialErr) {
    console.warn(`[DB] Could not connect directly to ${uri}. Checking embedded replica set...`);
    const embeddedUri = await startEmbeddedMongoIfAvailable();
    if (embeddedUri) {
      uri = embeddedUri;
      client = new MongoClient(uri);
      await client.connect();
      console.log(`[DB] Connected to Embedded MongoDB at: ${uri}`);
    } else {
      throw initialErr;
    }
  }

  db = client.db(env.DB_NAME);

  // Check if connected deployment supports replica sets / transactions
  try {
    const admin = client.db('admin');
    const isMaster = await admin.command({ isMaster: 1 });
    if (isMaster.setName || isMaster.hosts) {
      isReplicaSet = true;
      console.log(`[DB] Deployment replica set detected: ${isMaster.setName || 'active'}`);
    } else {
      isReplicaSet = false;
      console.log('[DB] Deployment is standalone (transactions will run with safe fallback).');
    }
  } catch (err) {
    isReplicaSet = false;
  }

  await initIndexes();
  return db;
}

async function initIndexes() {
  if (!db) return;

  try {
    // Users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Sessions
    await db.collection('sessions').createIndex({ tokenHash: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Products
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ collection: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ isFeatured: 1 });
    await db.collection('products').createIndex({ active: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });

    // Categories
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });

    // Carts
    await db.collection('carts').createIndex({ userId: 1 }, { unique: true });

    // Orders
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ customerId: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });

    console.log('[DB] Indexes verified and initialized successfully.');
  } catch (err) {
    console.error('[DB] Error initializing indexes:', err.message);
  }
}

async function withTransaction(callback) {
  if (!client) throw new Error('Database not connected');

  if (isReplicaSet) {
    const session = client.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        result = await callback(session);
      });
      return result;
    } finally {
      await session.endSession();
    }
  } else {
    // Standalone fallback without session transaction
    return await callback(null);
  }
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connectDb() first.');
  return db;
}

function getClient() {
  return client;
}

async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  console.log('[DB] MongoDB connection closed.');
}

module.exports = {
  connectDb,
  getDb,
  getClient,
  closeDb,
  withTransaction,
  initIndexes,
  isReplicaSet: () => isReplicaSet
};
