import React from 'react';
import { Box } from '@mui/material';

const FullWidthImage = ({ imageSrc, alt, height = 'auto', margin = '2rem 0' }) => {
  return (
    <Box 
      sx={{
        width: '100%',
        height: height,
        margin: margin,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        },
      }}
    >
      <img 
        src={imageSrc} 
        alt={alt || ''}
        loading="lazy"
      />
    </Box>
  );
};

export default FullWidthImage;
