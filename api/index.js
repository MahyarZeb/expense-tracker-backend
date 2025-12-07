// api/index.js
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const transactionsRouter = require("./routes/transactions");
const connectDB = require("./db");

require("dotenv").config(); // for local dev, Vercel uses dashboard env vars

const app = express();

// ----------------------
// CORS CONFIGURATION
// ----------------------
// Allow only your frontend origin. Replace with your deployed frontend URL
const FRONTEND_URL = 'https://expense-tracker-frontend1-three.vercel.app/';

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
}));

// For local development testing, you can uncomment this line to allow all origins
// app.use(cors());

app.use(express.json());

// ----------------------
// DATABASE CONNECTION
// ----------------------
// Use serverless-safe connection
connectDB();

// ----------------------
// ROUTES
// ----------------------
app.use("/api/v1/transactions", transactionsRouter);

// ----------------------
// EXPORT FOR VERCEL
// ----------------------
module.exports = app;
module.exports.handler = serverless(app);
