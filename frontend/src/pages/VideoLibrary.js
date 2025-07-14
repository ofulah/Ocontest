import React from 'react';
import { Box, Container, Typography, Grid, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getAllVideos, searchVideos } from '../services/videoService';

const VideoLibrary = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [videos, setVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);


  // Debounce search query
  const debouncedSearchQuery = React.useMemo(() => {
    let timeoutId;
    return (query, callback) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(query), 500);
    };
  }, []);

  // Load initial videos
  React.useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getAllVideos();
        setVideos(data);
        setError(null);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Handle search
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setLoading(true);

    debouncedSearchQuery(query, async (debouncedQuery) => {
      try {
        if (!debouncedQuery.trim()) {
          const data = await getAllVideos();
          setVideos(data);
        } else {
          const results = await searchVideos(debouncedQuery);
          setVideos(results);
        }
        setError(null);
      } catch (err) {
        console.error('Error searching videos:', err);
        setError('Failed to search videos');
      } finally {
        setLoading(false);
      }
    });
  };



  return (
    <Box sx={{ background: '#0d0d0d', minHeight: '100vh', py: { xs: 10, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            variant="h2" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Video Library
          </Typography>
          <Typography 
            component={motion.h5}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variant="h5" 
            sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}
          >
            Discover opportunities to showcase your talent
          </Typography>
        </Box>

        {/* Search and Filter Bar */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          sx={{ 
            mb: 6,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={handleSearch}
            disabled={loading}
            sx={{
              maxWidth: 500,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: 'white',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton 
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              }
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* No Results */}
        {!loading && !error && videos.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              No videos found
            </Typography>
            {searchQuery && (
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
                Try adjusting your search terms
              </Typography>
            )}
          </Box>
        )}

        {/* Contest Grid */}
        {!loading && !error && videos.length > 0 && (
          <Grid 
            container 
            spacing={2}
            sx={{
              width: '100%',
              margin: 0,
              padding: 2,
              '& .MuiGrid-item': {
                display: 'flex',
              },
            }}
          >
            {videos.map((video, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id} sx={{
                padding: 1,
                display: 'block',
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        '& .video-thumbnail': {
                          transform: 'scale(1.05)',
                        },
                      },
                    }}
                  >
                    {/* Video Thumbnail Container */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        backgroundColor: '#000',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 1.5,
                      }}
                    >
                      <Box
                        component="video"
                        className="video-thumbnail"
                        src={video.thumbnail}
                        autoPlay
                        muted
                        loop
                        playsInline
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Box>


                    {/* Video Info */}
                    <Box sx={{ px: 0.5 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {video.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.9rem',
                          mb: 0.5,
                        }}
                      >
                        {video.brand}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Posted: {new Date(video.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default VideoLibrary;
