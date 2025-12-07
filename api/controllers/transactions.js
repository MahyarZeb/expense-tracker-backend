const Transaction = require("../models/Transaction");

// GET /api/v1/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// POST /api/v1/transactions
exports.addTransaction = async (req, res) => {
  try {
    const { text, amount } = req.body;
    const transaction = await Transaction.create({ text, amount });

    return res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// DELETE /api/v1/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    await transaction.deleteOne();
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
