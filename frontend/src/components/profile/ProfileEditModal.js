import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  CircularProgress,
  Typography,
  Divider
} from '@mui/material';
import { PhotoCamera, LinkedIn, Instagram, Twitter, Facebook, Language } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosConfig';

// Helper function to get CSRF token
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const ProfileEditModal = ({ open, onClose, profile, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    address: '',
    phone: '',
    gender: '',
    email: '',
    website: '',
    portfolio_url: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: '',
    // Shipping fields
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        address: profile.address || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        email: profile.email || '',
        website: profile.website || '',
        portfolio_url: profile.portfolio_url || '',
        linkedin: profile.linkedin || '',
        instagram: profile.instagram || '',
        twitter: profile.twitter || '',
        facebook: profile.facebook || '',
        shipping_address_line1: profile.shipping_address_line1 || '',
        shipping_address_line2: profile.shipping_address_line2 || '',
        shipping_city: profile.shipping_city || '',
        shipping_state: profile.shipping_state || '',
        shipping_postal_code: profile.shipping_postal_code || '',
        shipping_country: profile.shipping_country || ''
      });
      setAvatarPreview(profile.avatar || '');
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields, including empty strings
      Object.entries(formData).forEach(([key, value]) => {
        // Skip social media links as they'll be sent as a nested object
        if (!['linkedin', 'instagram', 'twitter', 'facebook', 'website', 'portfolio_url'].includes(key)) {
          formDataToSend.append(key, value || '');
        }
      });
      
      // Handle social media links as a nested object
      const socialLinks = {
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        twitter: formData.twitter,
        facebook: formData.facebook,
        website: formData.website,
        portfolio_url: formData.portfolio_url
      };
      
      formDataToSend.append('social_links', JSON.stringify(socialLinks));
      
      // Append avatar if changed
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }
      
      // Send to backend
      const response = await axiosInstance.patch('/accounts/creators/profile/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCookie('csrftoken')
        },
        withCredentials: true
      });
      
      // Show success message and update parent component
      if (onSuccess) {
        onSuccess({
          ...response.data,
          ...socialLinks // Ensure social links are included in the updated profile
        });
      }
      
      // Close the modal after a short delay to show success state
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle validation errors from backend
      if (error.response && error.response.data) {
        const backendErrors = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value.join(' ') : value;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar 
            src={avatarPreview} 
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <label htmlFor="avatar-upload">
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Change Photo
            </Button>
          </label>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="">Prefer not to say</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Shipping Address</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Used to ship prizes for contest wins.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              name="shipping_address_line1"
              value={formData.shipping_address_line1}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2 (Optional)"
              name="shipping_address_line2"
              value={formData.shipping_address_line2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="shipping_city"
              value={formData.shipping_city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State / Province / Region"
              name="shipping_state"
              value={formData.shipping_state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal / Zip Code"
              name="shipping_postal_code"
              value={formData.shipping_postal_code}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="shipping_country"
              value={formData.shipping_country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              InputProps={{
                startAdornment: <Language fontSize="small" color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Portfolio & Social Media</Typography>
          </Grid>

          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Portfolio URL"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="https://portfolio.com"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              InputProps={{
                startAdornment: <LinkedIn fontSize="small" color="primary" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
              InputProps={{
                startAdornment: <Instagram fontSize="small" color="error" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              InputProps={{
                startAdornment: <Twitter fontSize="small" color="info" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/username"
              InputProps={{
                startAdornment: <Facebook fontSize="small" color="primary" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileEditModal;
