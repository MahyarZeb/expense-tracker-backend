// api/index.js
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
const FRONTEND_URL = 'https://expense-tracker-frontend1-three.vercel.app'; // deployed frontend URL

app.use(cors({
  origin: FRONTEND_URL,  // allow frontend
  methods: ['GET','POST','DELETE','PUT','PATCH'],
  credentials: true
}));

// For testing, you can allow all origins temporarily:
// app.use(cors());

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
