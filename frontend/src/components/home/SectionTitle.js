import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

const SectionTitle = ({ title, subtitle, align = 'center' }) => {
  return (
    <Box sx={{ textAlign: align, mb: 6 }}>

      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionTitle;

export default SectionTitle;
