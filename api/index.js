const express = require("express");
const cors = require("cors");
const transactionsRouter = require("./routes/transactions");
const connectDB = require("./db");

require("dotenv").config();

const app = express();

const FRONTEND_URL = "https://expense-tracker-frontend1-three.vercel.app";

app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true
}));

app.use(express.json());

// Only connect to Mongo in production, NOT in tests
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use("/api/v1/transactions", transactionsRouter);

module.exports = app;  // IMPORTANT: no serverless here
