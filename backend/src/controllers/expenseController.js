const Expense = require('../models/Expense');

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expenses by category
exports.getExpensesByCategory = async (req, res) => {
  try {
    const expenses = await Expense.find({
      category: req.params.category
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expenses by date range
exports.getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await Expense.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new expense
exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expense summary
exports.getExpenseSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 