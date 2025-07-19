import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

const SectionTitle = ({ title, subtitle, align = 'center' }) => {
  return (
    <Box sx={{ textAlign: align, mb: 6, color: "white"}}>

      {subtitle && (
       <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          position: 'relative',
          display: 'inline-block',
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '50px',
            height: '3px',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'primary.main',
          },
        }}
      >
        {title}
      </Typography>
      )}
    </Box>
  );
};

export default SectionTitle;

/**
 * 
 *       <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          position: 'relative',
          display: 'inline-block',
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '50px',
            height: '3px',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'primary.main',
          },
        }}
      >
        {title}
      </Typography>
 */
