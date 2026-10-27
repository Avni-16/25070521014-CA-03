const { sendError } = require('../utils/response');

function parseJsonBody(req, res, maxBytes = 1048576) {
  return new Promise((resolve) => {
    // Only parse for methods with potential bodies
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      req.body = {};
      return resolve(true);
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      req.body = {};
      return resolve(true);
    }

    let bodyData = '';
    let bytesReceived = 0;

    req.on('data', chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > maxBytes) {
        sendError(res, 413, 'Payload Too Large. Max size is 1MB.');
        req.destroy();
        return resolve(false);
      }
      bodyData += chunk;
    });

    req.on('end', () => {
      if (!bodyData.trim()) {
        req.body = {};
        return resolve(true);
      }
      try {
        req.body = JSON.parse(bodyData);
        resolve(true);
      } catch (err) {
        sendError(res, 400, 'Invalid JSON payload format.');
        resolve(false);
      }
    });

    req.on('error', (err) => {
      sendError(res, 400, 'Error reading request body: ' + err.message);
      resolve(false);
    });
  });
}

module.exports = {
  parseJsonBody
};
