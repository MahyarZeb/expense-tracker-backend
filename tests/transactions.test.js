const request = require('supertest');
const app = require('../api/index');

describe('Transactions API', () => {
  it('should fetch all transactions', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
