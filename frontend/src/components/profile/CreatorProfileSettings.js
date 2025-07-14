import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { NotificationsActive, Phone } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosConfig';

const CreatorProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [receiveSmsNotifications, setReceiveSmsNotifications] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/accounts/auth/creator-profile/');
      setProfile(response.data);
      setPhoneNumber(response.data.phone_number || '');
      setReceiveSmsNotifications(response.data.receive_sms_notifications || false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    // Clear error when user starts typing
    if (phoneError) setPhoneError('');
  };

  const handleSmsToggle = (e) => {
    setReceiveSmsNotifications(e.target.checked);
  };

  const validatePhone = () => {
    // Simple validation for international phone format
    if (receiveSmsNotifications && !phoneNumber) {
      setPhoneError('Phone number is required for SMS notifications');
      return false;
    }
    
    if (phoneNumber && !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      setPhoneError('Please enter a valid phone number in international format (e.g., +1234567890)');
      return false;
    }
    
    return true;
  };

  const handleSaveSettings = async () => {
    if (!validatePhone()) return;
    
    try {
      const response = await axiosInstance.patch('/accounts/auth/creator-profile/', {
        phone_number: phoneNumber,
        receive_sms_notifications: receiveSmsNotifications
      });
      
      setSuccessMessage('Notification settings updated successfully!');
      setOpenSnackbar(true);
      
      // Update local state with response data
      setProfile(response.data);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      if (error.response && error.response.data && error.response.data.phone_number) {
        setPhoneError(error.response.data.phone_number[0]);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Loading profile settings...</Box>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Notification Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <NotificationsActive sx={{ mr: 1, verticalAlign: 'middle' }} />
            SMS Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Receive SMS notifications for new contests and important updates.
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={handlePhoneChange}
                error={!!phoneError}
                helperText={phoneError || "Enter your phone number in international format"}
                InputProps={{
                  startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={receiveSmsNotifications}
                    onChange={handleSmsToggle}
                    color="primary"
                  />
                }
                label="Receive SMS notifications"
              />
            </Grid>
          </Grid>
          
          {receiveSmsNotifications && !phoneNumber && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You need to provide a phone number to receive SMS notifications.
            </Alert>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </CardContent>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Card>
  );
};

export default CreatorProfileSettings;
