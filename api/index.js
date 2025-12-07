//api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const transactionsRouter = require("./routes/transactions");
const connectDB = require("./db");
require("dotenv").config();

const app = express();

// ----------------------
// CORS CONFIGURATION
// ----------------------
// Allow your deployed frontend URL
const FRONTEND_URL = "https://expense-tracker-frontend1-three.vercel.app";

app.use(cors({
  origin: FRONTEND_URL,          // only allow your frontend
  methods: ['GET','POST','DELETE','PUT','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// parse JSON
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
