import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
  Alert,
  Paper,
} from '@mui/material';
import { PhotoCamera, Facebook, Twitter, Instagram, LinkedIn, YouTube } from '@mui/icons-material';
import { updateCreatorProfile } from '../../services/creatorService';
import { useAuth } from '../../context/AuthContext';

const ProfileUpdateForm = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    bio: '',
    address: '',
    country: '',
    portfolio_url: '',
    profile_picture: null,
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: '',
    social_media_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });

  useEffect(() => {
    if (user) {
      // Split the name into first and last name
      const [firstName = '', lastName = ''] = (user.name || '').split(' ');
      
      setFormData(prevData => ({
        ...prevData,
        first_name: firstName,
        last_name: lastName,
        phone_number: user.phone_number || '',
        bio: user.bio || '',
        address: user.address || '',
        country: user.country || '',
        portfolio_url: user.portfolio_url || '',
        shipping_address_line1: user.shipping_address_line1 || '',
        shipping_address_line2: user.shipping_address_line2 || '',
        shipping_city: user.shipping_city || '',
        shipping_state: user.shipping_state || '',
        shipping_postal_code: user.shipping_postal_code || '',
        shipping_country: user.shipping_country || '',
        social_media_links: user.social_media_links || {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: ''
        }
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_media_')) {
      const platform = name.replace('social_media_', '');
      setFormData(prev => ({
        ...prev,
        social_media_links: {
          ...prev.social_media_links,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'social_media_links') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profile_picture' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const updatedProfile = await updateCreatorProfile(formDataToSend);
      updateUser({ ...user, ...updatedProfile });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
      <Box component="form" onSubmit={handleSubmit}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}

        {/* Profile Picture */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={formData.profile_picture ? URL.createObjectURL(formData.profile_picture) : user?.profilePicture}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <label htmlFor="profile-picture">
            <input
              accept="image/*"
              id="profile-picture"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Personal Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, mt: 2 }}>Address Information</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              multiline
              rows={3}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>

          {/* Shipping Address */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, mt: 4 }}>Shipping Address</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This address will be used to ship any products you win in contests.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              name="shipping_address_line1"
              value={formData.shipping_address_line1}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2 (Optional)"
              name="shipping_address_line2"
              value={formData.shipping_address_line2}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              name="shipping_city"
              value={formData.shipping_city}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State/Province/Region"
              name="shipping_state"
              value={formData.shipping_state}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Postal/Zip Code"
              name="shipping_postal_code"
              value={formData.shipping_postal_code}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              name="shipping_country"
              value={formData.shipping_country}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 2 }}
            />
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, mt: 2 }}>Professional Information</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              multiline
              rows={4}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Portfolio URL"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, mt: 2 }}>Social Media Links</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Facebook"
              name="social_media_facebook"
              value={formData.social_media_links.facebook}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Facebook />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Twitter"
              name="social_media_twitter"
              value={formData.social_media_links.twitter}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Twitter />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Instagram"
              name="social_media_instagram"
              value={formData.social_media_links.instagram}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Instagram />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              name="social_media_linkedin"
              value={formData.social_media_links.linkedin}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedIn />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="YouTube"
              name="social_media_youtube"
              value={formData.social_media_links.youtube}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTube />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileUpdateForm;
