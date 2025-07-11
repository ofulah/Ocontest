import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const LowerLibSection = ({ title = 'Resistance Videos', showHeader = true }) => {
  // First row thumbnails (16:9) using images from lowersec directory
  const firstRowImages = [
    { id: 1, src: '/images/library/lowersec/red.png', alt: 'Red' },
    { id: 2, src: '/images/library/lowersec/orange.png', alt: 'Orange' },
    { id: 3, src: '/images/library/lowersec/grey.png', alt: 'Grey' },
  ];

  // Second row thumbnails (9:16) using images from 1916 directory
  const secondRowImages = [
    { id: 4, src: '/images/library/1916/blue.jpg', alt: 'Blue Portrait' },
    { id: 5, src: '/images/library/1916/orange.jpg', alt: 'Orange Portrait' },
    { id: 6, src: '/images/library/1916/yellow.jpg', alt: 'Yellow Portrait' },
  ];

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      {showHeader && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1.25rem' }}>
            {title}
          </Typography>
          <IconButton size="small" sx={{ color: '#fff', ml: 1 }}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      
      {/* First Row - 16:9 Thumbnails */}
      <Box sx={{ 
        display: 'flex', 
        gap: '45px', 
        mb: 3,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none' // Hide scrollbar
        }
      }}>
        {firstRowImages.map((image) => (
          <Box 
            key={image.id}
            sx={{
              flex: '0 0 auto',
              width: '300px',
              height: '169px', // 16:9 aspect ratio
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Second Row - 9:16 Thumbnails */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ 
            color: '#fff', 
            fontWeight: 600, 
            fontSize: '1.25rem',
            mr: 1
          }}>
            9:16 Stand-out
          </Typography>
          <IconButton size="small" sx={{ color: '#fff' }}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: '45px',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none' // Hide scrollbar
          }
        }}>
        {secondRowImages.map((image) => (
          <Box 
            key={image.id}
            sx={{
              flex: '0 0 auto',
              width: '315px',
              height: '560px', // 9:16 aspect ratio
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LowerLibSection;
