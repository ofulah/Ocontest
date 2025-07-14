import React from 'react';
import { Box } from '@mui/material';
import bannerVideo from '../../assets/videos/homepage-banner-video.mp4';

const VideoBanner = () => {
  return (
    <Box sx={{ 
      position: 'relative', 
      height: '100vh', // Full viewport height
      width: '100%', // Full width
      mx: 0, // No horizontal margin
      left: 0,
      transform: 'none', // No transform needed
      overflow: 'hidden',
      my: 0, // No vertical margin
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Background video */}
      <video
        src={bannerVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Dark overlay + content */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          p: 3,
        }}
      >        
      </Box>
    </Box>
  );
};

export default VideoBanner;
