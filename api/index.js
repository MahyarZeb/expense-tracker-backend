const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const connectDB = require("./db");

const transactionsRouter = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/v1/transactions", transactionsRouter);

module.exports = app;
module.exports.handler = serverless(app);
