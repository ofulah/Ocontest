import React from 'react';
import { Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const LibraryBanner = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '80vh', md: '90vh' },
        backgroundImage: 'url(/images/library/main.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 5%',
      }}
    >
      <Box sx={{ position: 'absolute', bottom: { xs: 24, md: 32 }, left: { xs: 35, md: 80, }, display: 'flex', gap: 2, zIndex: 2 }}>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#4caf50',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: '24px',
            '&:hover': {
              backgroundColor: '#43a047',
            },
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          Go ahead and apply
        </Button>
        
        <Button 
          variant="contained" 
          startIcon={<PlayArrowIcon />}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            px: 2.5,
            py: 1,
            borderRadius: '24px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          PLAY
        </Button>
      </Box>
    </Box>
  );
};

export default LibraryBanner;
