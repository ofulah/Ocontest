import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideChrome = ['/library', '/videos'].includes(location.pathname);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      minHeight: 'calc(100 * var(--vh, 1vh))',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'black',
      position: 'relative', 
      overflowX: 'hidden' 
    }}>
      {!hideChrome && <Navbar />}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          position: 'relative',
          overflow: 'visible' 
        }}
      >
        {children}
      </Box>
      {!hideChrome && <Footer />}
    </Box>
  );
};

export default Layout;

