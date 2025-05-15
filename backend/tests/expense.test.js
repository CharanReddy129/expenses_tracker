const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const Expense = require('../src/models/Expense');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker-test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Expense.deleteMany({});
});

describe('Expense API', () => {
  it('should create a new expense', async () => {
    const expenseData = {
      amount: 1000,
      category: 'Food',
      description: 'Lunch',
      date: new Date()
    };

    const response = await request(app)
      .post('/api/expenses')
      .send(expenseData);

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(expenseData.amount);
    expect(response.body.category).toBe(expenseData.category);
  });

  it('should get all expenses', async () => {
    await Expense.create({
      amount: 1000,
      category: 'Food',
      description: 'Lunch',
      date: new Date()
    });

    const response = await request(app)
      .get('/api/expenses');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });
}); 