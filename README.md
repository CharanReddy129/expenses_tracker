# Expense Tracker with Analytics Dashboard

A full-stack MERN application for tracking expenses with analytics and user authentication.

## Features

- User Authentication (Register/Login)
- Expense Management (Add, Edit, Delete)
- Expense Categorization
- Analytics Dashboard with Charts
- Profile Management
- Responsive Design

## Tech Stack

- Frontend: React, Material-UI, Recharts
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-secret-key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Expenses
- GET /api/expenses - Get all expenses
- POST /api/expenses - Create new expense
- PATCH /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense
- GET /api/expenses/summary - Get expense summary

### Users
- PATCH /api/users/profile - Update user profile
- DELETE /api/users/profile - Delete user account

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 