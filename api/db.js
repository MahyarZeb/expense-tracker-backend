const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  // Skip DB during tests
  if (process.env.NODE_ENV === "test") {
    console.log("Skipping MongoDB connection for tests");
    return;
  }

  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000
    });

    isConnected = true;
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    throw err;
  }
}

module.exports = connectDB;
