import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <EmailIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          
          <Typography component="h1" variant="h4" gutterBottom>
            Check Your Email
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to complete your registration.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            If you don't see the email, check your spam folder. The email should arrive within a few minutes.
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              sx={{ mb: 1 }}
            >
              Back to Login
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" display="inline">
                Didn't receive the email? 
              </Typography>
              <Button
                component={Link}
                to="/resend-verification"
                variant="text"
                color="primary"
                sx={{ ml: 1 }}
              >
                Resend verification email
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckEmailPage;
