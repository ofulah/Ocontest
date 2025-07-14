import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#1E1E1E',
  color: 'white',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validLink, setValidLink] = useState(null);
  const navigate = useNavigate();

  // Check if the reset link is valid
  useEffect(() => {
    const checkResetLink = async () => {
      try {
        // You might want to add an endpoint to validate the reset link
        // For now, we'll assume the link is valid if we have both uidb64 and token
        if (uidb64 && token) {
          setValidLink(true);
        } else {
          setValidLink(false);
        }
      } catch (err) {
        setValidLink(false);
        setError('Invalid or expired password reset link.');
      }
    };

    checkResetLink();
  }, [uidb64, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`/api/accounts/auth/password/reset/confirm/${uidb64}/${token}/`, {
        new_password1: password,
        new_password2: confirmPassword,
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err.response?.data?.error?.[0] || 
        err.response?.data?.detail || 
        'Failed to reset password. The link may have expired or is invalid.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (validLink === null) {
    return (
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <Typography>Verifying reset link...</Typography>
        </StyledPaper>
      </Container>
    );
  }

  if (!validLink) {
    return (
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <Typography variant="h6" color="error" gutterBottom>
            Invalid or Expired Link
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            The password reset link is invalid or has expired. Please request a new password reset link.
          </Typography>
          <Button
            component={Link}
            to="/forgot-password"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Request New Reset Link
          </Button>
        </StyledPaper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <Typography variant="h6" color="success" gutterBottom>
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Your password has been successfully reset. Redirecting to login...
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Go to Login
          </Button>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper>
        <Typography component="h1" variant="h5">
          Reset Your Password
        </Typography>
        
        <Typography variant="body2" align="center" sx={{ mt: 2, mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
          Please enter your new password below.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              mb: 2,
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              mb: 3,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              py: 1.5,
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link 
              to="/login" 
              style={{ 
                color: 'white',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Back to Sign In
            </Link>
          </Box>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default ResetPassword;
