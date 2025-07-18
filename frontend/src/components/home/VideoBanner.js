import React from 'react';
import { Box } from '@mui/material';
import bannerVideo from '../../assets/videos/homepage-banner-video.mp4';

const VideoBanner = () => {
  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      paddingTop: '56.25%', 
      overflow: 'hidden',
      mx: 0,
      my: 0
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
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover', 
        }}
      />
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

