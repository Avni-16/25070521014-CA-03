function sendJson(res, statusCode = 200, data = null, message = 'Success') {
  if (res.writableEnded) return;
  const payload = {
    success: statusCode >= 200 && statusCode < 400,
    message,
    data
  };
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendError(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
  if (res.writableEnded) return;
  const payload = {
    success: false,
    message,
    ...(errors ? { errors } : {})
  };
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

module.exports = {
  sendJson,
  sendError
};
