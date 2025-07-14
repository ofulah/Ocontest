import React from 'react';
import { Box, Button, Link } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        width: '100%',
        bgcolor: 'black',
        mb: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        src="videos/hero-background.mp4"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />
      <Link href="/contests">
        <Button
          variant="outlined"
          size="large"
          sx={{
            position: 'absolute',
            zIndex: 2,
            color: 'white',
            borderColor: 'white',
            borderWidth: 2,
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            left: '50%',
            bottom: '20%',
            transform: 'translate(-50%, 50%)',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            '&:hover': {
              borderWidth: 2,
              bgcolor: 'white',
              color: 'black',
              transform: 'translate(-50%, calc(50% - 3px))',
              boxShadow: '0 4px 20px rgba(255,255,255,0.2)'
            }
          }}
        >
          Check Live Contests
        </Button>
      </Link>
    </Box>
  );
};

export default HeroSection;
