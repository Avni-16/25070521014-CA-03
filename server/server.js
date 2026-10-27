const http = require('http');
const env = require('./config/env');
const { connectDb, closeDb } = require('./config/db');
const { handleCors } = require('./middleware/cors');
const { parseJsonBody } = require('./middleware/bodyParser');
const { createApiRouter } = require('./routes/api');
const { sendError, sendJson } = require('./utils/response');

let server = null;

async function bootstrap() {
  try {
    console.log('[Socktales Server] Initializing MongoDB connection...');
    await connectDb();

    const router = createApiRouter();

    server = http.createServer(async (req, res) => {
      try {
        // Handle CORS (preflights and headers)
        const isPreflight = handleCors(req, res);
        if (isPreflight) return;

        // Health check endpoint
        if (req.url === '/health' || req.url === '/api/health') {
          return sendJson(res, 200, {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Socktales Native HTTP Backend'
          }, 'Service is operational');
        }

        // Parse JSON Body
        const parsed = await parseJsonBody(req, res);
        if (!parsed) return; // Error already sent by bodyParser

        // Route to controller
        await router.handle(req, res);
      } catch (err) {
        console.error('[Server Uncaught Error]:', err);
        if (!res.writableEnded) {
          sendError(res, 500, 'An unexpected server error occurred.');
        }
      }
    });

    server.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Socktales Native HTTP Server running on port ${env.PORT}`);
      console.log(`📡 API Base URL: http://localhost:${env.PORT}/api/v1`);
      console.log(`🛡️  Backend: Built-in Node.js 'http' module ONLY (Zero Express)`);
      console.log(`💾 Database: MongoDB via Official Node.js Driver`);
      console.log(`=======================================================`);
    });

  } catch (err) {
    console.error('Failed to start Socktales server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down Socktales server...');
  if (server) {
    server.close();
  }
  await closeDb();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (server) {
    server.close();
  }
  await closeDb();
  process.exit(0);
});

// Run server if called directly
if (require.main === module) {
  bootstrap();
}

module.exports = {
  bootstrap,
  getServer: () => server
};
