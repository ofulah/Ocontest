import React, { useState, useRef, useEffect } from 'react';
import { videoApi } from '../../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../utils/axiosConfig';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const VideoUploadModal = ({ open, onClose, onUploadSuccess, onError }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a valid video file (MP4, WebM, or QuickTime)');
        return;
      }
      
      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 500MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      
      // Set default title if not set
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title for your video');
      return;
    }
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title.trim());
    if (description.trim()) {
      formData.append('description', description.trim());
    }
    
    try {
      setIsUploading(true);
      setError('');
      
      const response = await videoApi.uploadVideo(
        formData,
        (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      );
      
      onUploadSuccess?.(response);
      handleClose();
    } catch (err) {
      console.error('Error uploading video:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         'Failed to upload video. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleClose = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setError('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={isUploading ? null : handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Upload New Video
          <IconButton 
            onClick={handleClose} 
            disabled={isUploading}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '200px',
                border: '2px dashed',
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {file ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUpload fontSize="large" color="action" />
                  <Typography variant="h6" gutterBottom>
                    Select Video File
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    MP4, WebM, or QuickTime
                    <br />
                    Max 500MB
                  </Typography>
                </>
              )}
              <VisuallyHiddenInput
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isUploading}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              margin="normal"
              multiline
              rows={4}
            />
            
            {isUploading && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Uploading... {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
            
            {error && (
              <Typography color="error" variant="body2" mt={2}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={isUploading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={isUploading || !file || !title.trim()}
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoUploadModal;
