function isEmail(val) {
  if (typeof val !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function validateRegisterInput(data = {}) {
  const errors = {};
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!data.email || !isEmail(data.email)) {
    errors.email = 'A valid email address is required.';
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateLoginInput(data = {}) {
  const errors = {};
  if (!data.email || !isEmail(data.email)) {
    errors.email = 'A valid email address is required.';
  }
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateCheckoutInput(data = {}) {
  const errors = {};
  const addr = data.shippingAddress || {};

  if (!addr.fullName || typeof addr.fullName !== 'string' || addr.fullName.trim().length < 2) {
    errors.fullName = 'Recipient name is required.';
  }
  if (!addr.street || typeof addr.street !== 'string' || addr.street.trim().length < 3) {
    errors.street = 'Street address is required.';
  }
  if (!addr.city || typeof addr.city !== 'string' || addr.city.trim().length < 2) {
    errors.city = 'City is required.';
  }
  if (!addr.state || typeof addr.state !== 'string' || addr.state.trim().length < 2) {
    errors.state = 'State / Region is required.';
  }
  if (!addr.postalCode || typeof addr.postalCode !== 'string' || addr.postalCode.trim().length < 3) {
    errors.postalCode = 'Postal code is required.';
  }
  if (!addr.phone || typeof addr.phone !== 'string' || addr.phone.trim().length < 7) {
    errors.phone = 'Valid contact phone number is required.';
  }

  const validPayments = ['cod', 'card', 'upi'];
  if (!data.paymentMethod || !validPayments.includes(data.paymentMethod)) {
    errors.paymentMethod = `Payment method must be one of: ${validPayments.join(', ')}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateProductInput(data = {}) {
  const errors = {};
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.name = 'Product name is required.';
  }
  if (data.price === undefined || isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.price = 'Valid non-negative price is required.';
  }
  if (data.stock === undefined || isNaN(Number(data.stock)) || Number(data.stock) < 0) {
    errors.stock = 'Valid non-negative stock count is required.';
  }
  if (!data.collection || typeof data.collection !== 'string') {
    errors.collection = 'Collection name is required.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  isEmail,
  validateRegisterInput,
  validateLoginInput,
  validateCheckoutInput,
  validateProductInput
};
