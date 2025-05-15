require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware

const allowedOrigins = process.env.CORS_ORIGIN.split(',');

app.use(cors({
  origin: allowedOrigins || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/expenses', require('./routes/expenses'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 