// __tests__/transactions.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/index'); // your Express app
const Transaction = require('../api/models/Transaction');

let mongoServer;

// Prevent index.js from trying to connect to real DB
jest.mock('../api/db', () => jest.fn(() => Promise.resolve()));

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect mongoose to in-memory MongoDB
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear DB after each test
  await Transaction.deleteMany({});
});

describe('Transaction API', () => {
  it('BE-TC01: GET /transactions returns array', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('BE-TC02: POST /transactions adds a transaction', async () => {
    const res = await request(app).post('/api/v1/transactions').send({
      text: 'Test Income',
      amount: 100
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBe('Test Income');
  });

  it('BE-TC03: POST /transactions fails for empty description', async () => {
    const res = await request(app).post('/api/v1/transactions').send({
      text: '',
      amount: 100
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('BE-TC04: POST /transactions fails for empty amount', async () => {
    const res = await request(app).post('/api/v1/transactions').send({
      text: 'Test',
      amount: undefined
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('BE-TC05: POST /transactions fails for non-numeric amount', async () => {
    const res = await request(app).post('/api/v1/transactions').send({
      text: 'Test',
      amount: 'abc'
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('BE-TC06: DELETE /transactions/:id removes transaction', async () => {
    const transaction = await Transaction.create({ text: 'Delete Test', amount: 50 });
    const res = await request(app).delete(`/api/v1/transactions/${transaction._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('BE-TC07: DELETE /transactions/:id with invalid ID', async () => {
  const res = await request(app).delete(`/api/v1/transactions/123456789012`);
  expect(res.statusCode).toBe(404); // change from 500 to 404
  expect(res.body.success).toBe(false);
});


  it('BE-TC08: Balance calculation', async () => {
    await Transaction.create({ text: 'Income', amount: 200 });
    await Transaction.create({ text: 'Expense', amount: -50 });
    const res = await request(app).get('/api/v1/transactions');
    const balance = res.body.data.reduce((acc, t) => acc + t.amount, 0);
    expect(balance).toBe(150);
  });

  it('BE-TC09: GET /transactions returns empty array', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.body.data).toHaveLength(0);
  });

  it('BE-TC10: Data persistence in MongoDB', async () => {
    const t1 = await Transaction.create({ text: 'Persist 1', amount: 10 });
    const t2 = await Transaction.create({ text: 'Persist 2', amount: 20 });

    // simulate server restart by disconnecting and reconnecting
    await mongoose.disconnect();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

    const res = await request(app).get('/api/v1/transactions');
    expect(res.body.data.length).toBe(2);
    expect(res.body.data.map(t => t.text)).toContain('Persist 1');
    expect(res.body.data.map(t => t.text)).toContain('Persist 2');
  });
});
