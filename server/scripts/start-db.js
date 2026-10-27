const { MongoMemoryReplSet } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

async function run() {
  const dataDir = path.resolve(__dirname, '..', 'data', 'db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log('[start-db] Starting standalone MongoDB Replica Set on port 27017...');
  console.log(`[start-db] Persistent data path: ${dataDir}`);

  try {
    const replSet = await MongoMemoryReplSet.create({
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

    const uri = replSet.getUri();
    console.log('=======================================================');
    console.log(`✅ MongoDB Replica Set is ACTIVE and listening!`);
    console.log(`🔗 Connection URI: ${uri}`);
    console.log(`🧭 MongoDB Compass Connection String: mongodb://127.0.0.1:27017/socktales?replicaSet=rs0`);
    console.log(`📂 Database Name: socktales`);
    console.log('=======================================================');

    // Keep running until terminated
    process.on('SIGINT', async () => {
      console.log('\nStopping MongoDB replica set...');
      await replSet.stop();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start MongoDB replica set:', err.message);
    process.exit(1);
  }
}

run();
