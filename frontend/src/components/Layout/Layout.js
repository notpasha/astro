import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Outlet />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;