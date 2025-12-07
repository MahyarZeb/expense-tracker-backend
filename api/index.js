const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const transactionsRouter = require("./routes/transactions");
const connectDB = require("./db");

require("dotenv").config();

const app = express();

// ----------------------
// CORS CONFIGURATION
// ----------------------
// Allow your frontend URL
const FRONTEND_URL = "https://expense-tracker-frontend1-three.vercel.app";

// Apply CORS middleware before routes
app.use(cors({
  origin: FRONTEND_URL,       // no trailing slash
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests explicitly
app.options("*", cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ----------------------
// DATABASE CONNECTION
// ----------------------
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
