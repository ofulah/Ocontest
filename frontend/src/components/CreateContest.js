import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Alert,
  Box
} from '@mui/material';

import { createContest } from '../services/contestService';
import { createNotification } from '../services/notificationService';

const CreateContest = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    brief: '',
    inspiration: '',
    rules: '',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    region: '',
    language: 'English',
    max_entries: '',
    thumbnail: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Image file too large. Size should not exceed 5MB.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.prize || !formData.brief) {
        throw new Error('Please fill in all required fields');
      }

      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate < new Date()) {
        throw new Error('Deadline must be in the future');
      }

      // Create contest
      const contest = await createContest({
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
        prize: parseFloat(formData.prize)
      });

      // Send notification to all creators
      await createNotification({
        title: 'New Contest Available!',
        message: `${contest.title} - Prize: $${contest.prize}`,
        type: 'new_contest',
        link: `/contests/${contest.id}`,
        recipientRole: 'creator'
      });

      onSuccess(contest);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create contest');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Contest</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Contest Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="prize"
                label="Prize Amount"
                value={formData.prize}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="thumbnail-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="thumbnail-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Thumbnail Image
                </Button>
              </label>
              {previewImage && (
                <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  <img
                    src={previewImage}
                    alt="Thumbnail preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="brief"
                label="Brief"
                value={formData.brief}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required
                helperText="Brief description of what you want"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="inspiration"
                label="Inspiration"
                value={formData.inspiration}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                helperText="Examples or inspiration for creators"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="rules"
                label="Rules"
                value={formData.rules}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                helperText="Contest rules and guidelines"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="region"
                label="Region"
                value={formData.region}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="max_entries"
                label="Maximum Entries"
                value={formData.max_entries}
                onChange={handleChange}
                type="number"
                fullWidth
                helperText="Leave empty for unlimited entries"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="deadline"
                label="Submission Deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Contest'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateContest;
