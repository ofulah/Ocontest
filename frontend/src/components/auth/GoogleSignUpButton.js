import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleSignUpButton = () => {
  const handleGoogleSignUp = () => {
    // Set role as creator by default
    const state = btoa(JSON.stringify({ role: 'creator' }));
    window.location.href = `${process.env.REACT_APP_API_URL}/social/login/google-oauth2/?state=${state}`;
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleGoogleSignUp}
      sx={{
        color: 'white',
        borderColor: 'rgba(255,255,255,0.3)',
        '&:hover': {
          borderColor: 'white',
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        py: 1,
        textTransform: 'none',
        fontSize: '1rem',
      }}
    >
      Sign up with Google
    </Button>
  );
};

export default GoogleSignUpButton;
