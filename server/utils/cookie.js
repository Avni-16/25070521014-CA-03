const env = require('../config/env');

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;

  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts.shift().trim();
      const val = decodeURIComponent(parts.join('='));
      if (name) list[name] = val;
    });
  }
  return list;
}

function serializeCookie(name, val, options = {}) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;

  if (options.maxAge) {
    cookie += `; Max-Age=${Math.floor(options.maxAge)}`;
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }
  if (options.path) {
    cookie += `; Path=${options.path}`;
  } else {
    cookie += '; Path=/';
  }
  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.httpOnly) {
    cookie += '; HttpOnly';
  }
  if (options.secure) {
    cookie += '; Secure';
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  return cookie;
}

function setSessionCookie(res, token, maxAgeDays = env.SESSION_MAX_AGE_DAYS) {
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  const cookieStr = serializeCookie(env.COOKIE_NAME, token, {
    maxAge: maxAgeSeconds,
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: env.NODE_ENV === 'production'
  });
  res.setHeader('Set-Cookie', cookieStr);
}

function clearSessionCookie(res) {
  const cookieStr = serializeCookie(env.COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: env.NODE_ENV === 'production'
  });
  res.setHeader('Set-Cookie', cookieStr);
}

module.exports = {
  parseCookies,
  serializeCookie,
  setSessionCookie,
  clearSessionCookie
};
