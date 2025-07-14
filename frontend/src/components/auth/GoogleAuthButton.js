import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleAuthButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to Django's social auth endpoint for Google
    window.location.href = `${process.env.REACT_APP_API_URL}/social/login/google-oauth2/`;
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
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
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
