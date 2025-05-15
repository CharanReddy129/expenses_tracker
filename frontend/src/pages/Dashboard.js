import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { expenses } from '../services/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const categories = [
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

const COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#14B8A6', // Teal
  '#EF4444', // Red
  '#22C55E', // Green
];

// Function to format amount in Indian Rupees
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function Dashboard() {
  const [expenseList, setExpenseList] = useState([]);
  const [summary, setSummary] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenses.getAll();
      setExpenseList(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await expenses.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenses.create(formData);
      handleClose();
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenses.delete(id);
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const totalExpenses = expenseList.reduce((sum, expense) => sum + expense.amount, 0);

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenseList.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    expenseList.forEach(expense => {
      if (!breakdown[expense.category]) {
        breakdown[expense.category] = 0;
      }
      breakdown[expense.category] += expense.amount;
    });
    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryBreakdown = getCategoryBreakdown();
  const averageExpense = expenseList.length > 0 
    ? totalExpenses / expenseList.length 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Stats Cards (30%) */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                height: '100%',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Total Expenses
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatAmount(totalExpenses)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Track your spending habits
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
                color: 'white',
                height: '100%',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(236, 72, 153, 0.2)',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarMonthIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      This Month
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatAmount(monthlyTotal)}
                  </Typography>
                  <Typography variant="body2">
                    {monthlyExpenses.length} expenses this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #F97316 0%, #F43F5E 100%)',
                color: 'white',
                height: '100%',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.2)',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingDownIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Average Expense
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatAmount(averageExpense)}
                  </Typography>
                  <Typography variant="body2">
                    Per transaction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Charts and Recent Expenses (70%) */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Recent Expenses */}
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: 400,
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                  borderRadius: '15px',
                  overflow: 'auto',
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}>
                  <Typography variant="h6" sx={{ color: '#6366F1', fontWeight: 'bold' }}>
                    Recent Expenses
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    startIcon={<AddIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #8B5CF6 30%, #6366F1 90%)',
                      },
                      borderRadius: '25px',
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    Add Expense
                  </Button>
                </Box>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress sx={{ color: '#6366F1' }} />
                  </Box>
                ) : (
                  expenseList.map((expense) => (
                    <Box
                      key={expense._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        borderRadius: '10px',
                        background: 'linear-gradient(to right, #F8FAFC, #F1F5F9)',
                        '&:hover': {
                          background: 'linear-gradient(to right, #F1F5F9, #E2E8F0)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out',
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 'bold', 
                          background: 'linear-gradient(45deg, #8B5CF6, #EC4899)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          {expense.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={expense.category} 
                            size="small"
                            sx={{ 
                              background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
                              color: '#8B5CF6',
                              fontWeight: '500',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                            }}
                          />
                          <Typography variant="body2" sx={{ 
                            color: '#64748B',
                            background: 'linear-gradient(45deg, #64748B, #94A3B8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #EC4899, #F43F5E)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {formatAmount(expense.amount)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(expense._id)}
                          sx={{
                            color: '#F43F5E',
                            '&:hover': {
                              background: 'rgba(244, 63, 94, 0.1)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>

            {/* Category Breakdown */}
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: 400,
                  background: 'linear-gradient(to bottom, #ffffff, #F8FAFC)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                  borderRadius: '15px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CategoryIcon sx={{ 
                    color: '#6366F1',
                    mr: 1
                  }} />
                  <Typography variant="h6" sx={{ 
                    color: '#6366F1',
                    fontWeight: 'bold' 
                  }}>
                    Category Breakdown
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', height: '100%' }}>
                  {/* Donut Chart */}
                  <Box sx={{ width: '40%', height: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          dataKey="amount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatAmount(value)}
                          contentStyle={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: '#6366F1', fontWeight: 'bold' }}>
                        Total
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#F43F5E', fontWeight: 'bold' }}>
                        {formatAmount(totalExpenses)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Category List */}
                  <Box sx={{ 
                    width: '60%', 
                    height: '100%', 
                    overflow: 'auto',
                    pl: 2,
                    borderLeft: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    {categoryBreakdown.map((category, index) => {
                      const percentage = (category.amount / totalExpenses * 100).toFixed(1);
                      return (
                        <Box 
                          key={category.category}
                          sx={{ 
                            mb: 2,
                            p: 1,
                            borderRadius: '8px',
                            '&:hover': {
                              background: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))',
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%',
                                  background: COLORS[index % COLORS.length],
                                  boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}40`
                                }} 
                              />
                              <Typography variant="subtitle2" sx={{ 
                                background: 'linear-gradient(45deg, #8B5CF6, #EC4899)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold' 
                              }}>
                                {category.category}
                              </Typography>
                            </Box>
                            <Typography variant="subtitle2" sx={{ 
                              background: 'linear-gradient(45deg, #EC4899, #F43F5E)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontWeight: 'bold' 
                            }}>
                              {formatAmount(category.amount)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box 
                              sx={{ 
                                flexGrow: 1,
                                height: 6,
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}
                            >
                              <Box 
                                sx={{ 
                                  height: '100%',
                                  width: `${percentage}%`,
                                  background: `linear-gradient(45deg, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`,
                                  borderRadius: '3px',
                                  transition: 'width 0.3s ease-in-out'
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ 
                              color: '#64748B',
                              minWidth: '45px',
                              background: 'linear-gradient(45deg, #64748B, #94A3B8)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              {percentage}%
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
            background: 'linear-gradient(to bottom, #ffffff 0%, #F8FAFC 100%)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#6366F1', fontWeight: 'bold' }}>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="amount"
            label="Amount (₹)"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Typography>₹</Typography>,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            select
            fullWidth
            value={formData.category}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: '#6366F1',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
              borderRadius: '25px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #8B5CF6 30%, #6366F1 90%)',
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;