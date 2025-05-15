const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Get all expenses
router.get('/', expenseController.getAllExpenses);

// Get expenses by category
router.get('/category/:category', expenseController.getExpensesByCategory);

// Get expenses by date range
router.get('/date-range', expenseController.getExpensesByDateRange);

// Create new expense
router.post('/', expenseController.createExpense);

// Update expense
router.put('/:id', expenseController.updateExpense);

// Delete expense
router.delete('/:id', expenseController.deleteExpense);

// Get expense summary
router.get('/summary', expenseController.getExpenseSummary);

module.exports = router; 