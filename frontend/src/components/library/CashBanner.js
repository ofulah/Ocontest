import React from 'react';
import { Box } from '@mui/material';

const CashBanner = () => {
  return (
    <Box 
      component="img"
      src="/images/library/cash.png"
      alt="Cash Prize"
      sx={{
        width: '100%',
        maxWidth: '1000px',
        display: 'block',
        margin: 0,
        padding: { xs: '0 0 16px 0', md: '0 0 24px 0' }, // Removed top padding, kept bottom padding
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.01)',
        },
      }}
    />
  );
};

export default CashBanner;
