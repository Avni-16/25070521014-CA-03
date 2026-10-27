const test = require('node:test');
const assert = require('node:assert');
const { connectDb, closeDb, getDb } = require('../config/db');
const authService = require('../services/authService');
const { hashPassword, verifyPassword } = require('../utils/crypto');

test('Authentication and Security Suite', async (t) => {
  await connectDb();
  const db = getDb();

  await t.test('Password hashing produces secure salted output and verifies accurately', async () => {
    const raw = 'SecretLuxury123!';
    const hash = await hashPassword(raw);
    assert.ok(hash.includes(':'), 'Hash must contain salt delimiter');
    const isValid = await verifyPassword(raw, hash);
    assert.strictEqual(isValid, true, 'Original password must verify successfully');

    const isInvalid = await verifyPassword('WrongPassword', hash);
    assert.strictEqual(isInvalid, false, 'Wrong password must be rejected');
  });

  const testEmail = `test_${Date.now()}@socktales.test`;

  await t.test('Register new customer successfully creates session and hashes password', async () => {
    const res = await authService.register({
      name: 'Test Customer',
      email: testEmail,
      password: 'SecurePassword123'
    });

    assert.ok(res.user._id, 'User ID must be assigned');
    assert.strictEqual(res.user.email, testEmail);
    assert.strictEqual(res.user.role, 'customer');
    assert.ok(res.token, 'Session token must be returned');

    // Verify record in MongoDB
    const record = await db.collection('users').findOne({ email: testEmail });
    assert.ok(record, 'MongoDB user record must exist');
    assert.notStrictEqual(record.passwordHash, 'SecurePassword123', 'Password hash must never store plaintext');
  });

  await t.test('Reject duplicate user registration', async () => {
    await assert.rejects(
      async () => {
        await authService.register({
          name: 'Duplicate Test',
          email: testEmail,
          password: 'Password999'
        });
      },
      (err) => {
        assert.strictEqual(err.statusCode, 409);
        return true;
      }
    );
  });

  await t.test('Login with valid credentials returns user profile and session token', async () => {
    const res = await authService.login({
      email: testEmail,
      password: 'SecurePassword123'
    });
    assert.ok(res.token, 'Session token must be generated');
    assert.strictEqual(res.user.email, testEmail);
  });

  await t.test('Login with invalid password fails with 401', async () => {
    await assert.rejects(
      async () => {
        await authService.login({
          email: testEmail,
          password: 'IncorrectPassword'
        });
      },
      (err) => {
        assert.strictEqual(err.statusCode, 401);
        return true;
      }
    );
  });

  await t.test('Logout deletes active session from database', async () => {
    const loginRes = await authService.login({
      email: testEmail,
      password: 'SecurePassword123'
    });

    await authService.logout(loginRes.token);
    const sessionCount = await db.collection('sessions').countDocuments({ tokenHash: loginRes.token });
    assert.strictEqual(sessionCount, 0, 'Session must be destroyed upon logout');
  });

  // Clean up
  await db.collection('users').deleteOne({ email: testEmail });
  await closeDb();
});
