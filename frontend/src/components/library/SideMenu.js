import React from 'react';
import { Box, Stack, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'HOME', icon: '/images/library/icons/eye.png', path: '/' },
  { label: 'CONTESTS', icon: '/images/library/icons/contests.png', path: '/contests' },  
  { label: 'LIBRARY', icon: '/images/library/icons/library.png', path: '/library2' },  
];

const SideMenu = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: { xs: '64px', md: '170px' },
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 2,
        zIndex: 1000,
      }}
    >
      {/* Eye icon/top logo */}
      <Box
        sx={{
          width: 48,
          height: 48,
          border: '2px solid #fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Box 
          component="img" 
          src="/images/library/icons/eye.png" 
          alt="Eye Icon" 
          sx={{ width: 24, height: 24, objectFit: 'contain' }} 
        />
      </Box>

      <Stack spacing={1} sx={{ width: '100%', px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.label}
              component={RouterLink}
              to={item.path}
              sx={{
                justifyContent: 'flex-start',
                color: '#fff',
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                pl: 1,
                pr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
                fontSize: '0.85rem',
              }}
              fullWidth
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Box 
                  component="img" 
                  src={item.icon} 
                  alt={item.label} 
                  sx={{ width: 24, height: 24, objectFit: 'contain' }} 
                />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default SideMenu;
