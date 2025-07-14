import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getActiveContests } from '../services/contestService';

const Contests = () => {
  const navigate = useNavigate();
  const [contests, setContests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadContests = async () => {
      try {
        const data = await getActiveContests();
        setContests(data);
        setError(null);
      } catch (err) {
        console.error('Error loading contests:', err);
        setError('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

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
            Video Contests
          </Typography>
          <Typography 
            component={motion.h5}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variant="h5" 
            sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}
          >
            Participate in exciting video competitions and win prizes
          </Typography>
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

        {/* No Contests */}
        {!loading && !error && contests.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              No active contests at the moment
            </Typography>
          </Box>
        )}

        {/* Contests Grid */}
        {!loading && !error && contests.length > 0 && (
          <Grid container spacing={3}>
            {contests.map((contest, index) => (
              <Grid item xs={12} sm={6} md={4} key={contest.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={contest.thumbnail || '/placeholder-contest.jpg'}
                      alt={contest.title}
                      sx={{
                        objectFit: 'cover',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }}
                    />
                    <CardContent>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        sx={{ 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        {contest.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          mb: 2
                        }}
                      >
                        {contest.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: 'rgba(255,255,255,0.9)' }}
                        >
                          Prize: ${contest.prize}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          Deadline: {new Date(contest.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/contests/${contest.id}`)}
                        sx={{
                          mt: 2,
                          bgcolor: 'white',
                          color: 'black',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)'
                          }
                        }}
                      >
                        See Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Contests;
