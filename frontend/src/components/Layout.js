import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material';

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: '#fafafa',
          mt: '64px', // Height of AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 