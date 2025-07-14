import React, { useState, useEffect } from 'react';
import { getFeaturedVideos } from '../../services/videoService';
import { Box, Container, Typography, Card, CardMedia, IconButton, CardContent, Link, CircularProgress, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// Create a motion component for the Card
const MotionCard = motion(Card);

const ShowcaseCard = styled(MotionCard)({
  background: 'transparent',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  flex: '0 0 auto',
  width: '320px',
  margin: '0 12px',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
      filter: 'brightness(0.8)'
    },
    '& .overlay-content': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
});

const NavigationButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  cursor: 'pointer',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));

const ShowcaseSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const scrollContainerRef = React.useRef(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getFeaturedVideos();
        // Check if we have videos
        if (response && response.length > 0) {
          // Transform videos to ensure consistent creator display
          const transformedVideos = response.map(video => ({
            ...video,
            creator: video.creator_name || (() => {
              if (video.creator_profile) {
                return `${video.creator_profile.first_name || ''} ${video.creator_profile.last_name || ''}`.trim() || 'Unknown Creator';
              } else if (typeof video.creator === 'string') {
                return video.creator;
              } else if (video.creator && typeof video.creator === 'object') {
                return video.creator.name || 'Unknown Creator';
              } else {
                return 'Unknown Creator';
              }
            })()
          }));
          setVideos(transformedVideos);
          setError(null);
        } else {
          console.log('No videos returned from API');
          setVideos([]);
          setError('No videos available at this time');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 12, background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!loading && (!videos || videos.length === 0)) {
    return (
      <Box ref={ref} sx={{ py: 12, background: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Typography
          component={motion.h5}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          variant="h5"
          sx={{ color: 'white' }}
        >
          {error || 'No videos available at the moment.'}
        </Typography>
        <Typography
          component={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variant="body1"
          sx={{ color: 'white' }}
        >
          Check back later for new content
        </Typography>
      </Box>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box ref={ref} sx={{ py: 8, backgroundColor: '#111' }}>
      <Container maxWidth="lg">
        <Typography
          component={motion.h2}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          variant="h2"
          align="center"
          sx={{
            mb: 2,
            color: 'white',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Recent Videos
        </Typography>
        
        <Typography 
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variant="h6" 
          align="center"
          sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '800px', mx: 'auto', mb: 6 }}
        >
          Discover the latest content from our talented creators
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Check back soon for new content!
            </Typography>
          </Box>
        ) : videos.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              No videos available at this time
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Be the first to upload content!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', mx: 3, overflow: 'hidden' }}>
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ width: '100%' }}
                key="showcase-container"
              >
                <Box sx={{ position: 'relative' }}>
                  <IconButton
                    onClick={() => scroll(-400)}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      '&:hover': { 
                        backgroundColor: 'rgba(0,0,0,0.9)',
                      },
                      [theme.breakpoints.down('sm')]: {
                        display: 'none',
                      },
                    }}
                  >
                    <NavigateBeforeIcon fontSize="large" />
                  </IconButton>
                  
                  <Box 
                    ref={scrollContainerRef}
                    sx={{ 
                      display: 'flex',
                      overflowX: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      py: 3,
                      px: 6,
                      gap: 2,
                      position: 'relative',
                      scrollBehavior: 'smooth',
                      '& > *': {
                        flex: '0 0 auto',
                      },
                      [theme.breakpoints.down('sm')]: {
                        px: 2,
                      },
                    }}
                  >
                  {videos.map((video) => (
                          <ShowcaseCard
                            component={motion.div}
                            variants={itemVariants}
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.2 },
                            }}
                            onClick={() => navigate(`/videos/${video.id}`)}
                            sx={{ 
                              cursor: 'pointer',
                              width: '320px',
                              flexShrink: 0,
                              mx: 1
                            }}
                          >
                            <Box sx={{ 
                              position: 'relative',
                              paddingTop: '56.25%',
                              backgroundColor: '#000',
                              borderRadius: '4px 4px 0 0',
                              overflow: 'hidden'
                            }}>
                              <img
                                src={video.thumbnail || '/images/defaults/video-placeholder.svg'}
                                alt={video.title}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.2s',
                                  '&:hover': {
                                    opacity: 1
                                  }
                                }}
                              >
                                <IconButton
                                  sx={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0,0,0,0.8)'
                                    }
                                  }}
                                >
                                  <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                                </IconButton>
                              </Box>
                            </Box>
                            <CardContent sx={{ p: 2, flexGrow: 1, bgcolor: 'rgba(0,0,0,0.5)' }}>
                              <Typography variant="h6" sx={{ 
                                fontSize: '1rem',
                                fontWeight: 600,
                                mb: 1,
                                color: 'white',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.2
                              }}>
                                {video.title}
                              </Typography>
                              <Box sx={{ mt: 'auto' }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  By {video.creator_name || video.creator}
                                </Typography>
                              </Box>
                            </CardContent>
                          </ShowcaseCard>
                  ))}
                  </Box>
                  
                  <IconButton
                    onClick={() => scroll(400)}
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      '&:hover': { 
                        backgroundColor: 'rgba(0,0,0,0.9)',
                      },
                      [theme.breakpoints.down('sm')]: {
                        display: 'none',
                      },
                    }}
                  >
                    <NavigateNextIcon fontSize="large" />
                  </IconButton>
                </Box>
              </motion.div>
            </AnimatePresence>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link
            href="/videos"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            See More Creator Videos
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default ShowcaseSection;
