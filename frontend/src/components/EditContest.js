import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Alert,
  Box
} from '@mui/material';

import { updateContest } from '../services/contestService';

const EditContest = ({ open, onClose, onSuccess, contest }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    brief: '',
    inspiration: '',
    rules: '',
    deadline: '',
    region: '',
    language: 'English',
    max_entries: '',
    thumbnail: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (contest) {
      setFormData({
        title: contest.title || '',
        description: contest.description || '',
        prize: contest.prize || '',
        brief: contest.brief || '',
        inspiration: contest.inspiration || '',
        rules: contest.rules || '',
        deadline: new Date(contest.deadline).toISOString().slice(0, 16),
        region: contest.region || '',
        language: contest.language || 'English',
        max_entries: contest.max_entries || ''
      });
    }
  }, [contest]);

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

      // Update contest
      // Prepare data for update
      const updateData = {
        title: formData.title,
        description: formData.description,
        prize: parseFloat(formData.prize),
        brief: formData.brief,
        inspiration: formData.inspiration || '',
        rules: formData.rules || '',
        deadline: new Date(formData.deadline).toISOString(),
        region: formData.region || '',
        language: formData.language || 'English',
        max_entries: formData.max_entries ? parseInt(formData.max_entries) : null
      };

      const updatedContest = await updateContest(contest.id, updateData);

      onSuccess(updatedContest);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update contest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Contest</DialogTitle>
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
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prize"
                name="prize"
                type="number"
                value={formData.prize}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Entries"
                name="max_entries"
                type="number"
                value={formData.max_entries}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Brief"
                name="brief"
                value={formData.brief}
                onChange={handleChange}
                helperText="Detailed requirements for the video content"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Inspiration"
                name="inspiration"
                value={formData.inspiration}
                onChange={handleChange}
                helperText="Examples or references for inspiration"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Rules"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                helperText="Contest rules and guidelines"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="datetime-local"
                label="Deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                helperText="Leave empty for worldwide"
              />
            </Grid>
            <Grid item xs={12}>
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
                  {previewImage ? 'Change Thumbnail Image' : 'Upload Thumbnail Image'}
                </Button>
              </label>
              {previewImage && (
                <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  <img
                    src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)}
                    alt="Thumbnail preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  label="Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="Japanese">Japanese</MenuItem>
                </Select>
              </FormControl>
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
            {loading ? 'Updating...' : 'Update Contest'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditContest;
