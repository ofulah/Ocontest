import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const BannerSection = () => {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
        my: 8
      }}
    >
      <Box sx={{ height: '100%' }}>
        <Box
          component="img"
          src="/images/homepage-images/mission.jpg"
          alt="Mission Banner"
          sx={{
            width: '100%',
            height: '900px', 
            objectFit: 'cover',
            filter: 'brightness(0.7)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: 'translateY(7%)', 
          }}
        />
      </Box>
    </Box>
  );
};

export default BannerSection;
