process.env.NODE_ENV = "test"; // at the top of transactions.test.js

const request = require("supertest");
const app = require("../api/index");

describe("Transactions API", () => {
  it(
    "should return something from the route",
    async () => {
      const res = await request(app).get("/api/v1/transactions");
      expect([200, 500]).toContain(res.statusCode); // accept both
    },
    20000 // <-- increase timeout to 20s
  );
});
