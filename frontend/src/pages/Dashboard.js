import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Tab, Tabs } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCreatorStats, getCreatorVideos, getCreatorSubmissions, getCreatorEarnings } from '../services/creatorService';
import ProfileUpdateForm from '../components/profile/ProfileUpdateForm';

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StatCard = ({ title, value, subtitle, color = 'primary' }) => (
  <Card sx={{ 
    height: '100%',
    bgcolor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
  }}>
    <CardContent>
      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [videos, setVideos] = React.useState([]);
  const [submissions, setSubmissions] = React.useState([]);
  const [earnings, setEarnings] = React.useState(null);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, videosData, submissionsData, earningsData] = await Promise.all([
          getCreatorStats(),
          getCreatorVideos(),
          getCreatorSubmissions(),
          getCreatorEarnings()
        ]);
        
        setStats(statsData);
        setVideos(videosData);
        setSubmissions(submissionsData);
        setEarnings(earningsData);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (err.response?.status === 403) {
          setError('Please log in to view your dashboard');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ background: '#0d0d0d', minHeight: '100vh', py: { xs: 10, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="left" mb={6}>
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
              letterSpacing: '0.1em'
            }}
          >
            Creator Dashboard
          </Typography>
          <Typography 
            component={motion.h5}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variant="h5" 
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Welcome back, {user?.name || 'Creator'}
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

        {/* Dashboard Content */}
        {!loading && !error && (
          <>
            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Profile" />
                <Tab label="Earnings" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
              {!loading && !error && (!stats || !videos || !submissions) ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    No data available yet. Start creating content to see your stats!
                  </Typography>
                </Box>
              ) : !loading && !error && stats && videos && submissions ? (
                <div>
                  {/* Stats Overview */}
                  <Box>
                    <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>Stats Overview</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Total Videos"
                          value={stats?.totalVideos || 0}
                          subtitle="Uploaded videos"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Contest Submissions"
                          value={stats?.totalSubmissions || 0}
                          subtitle="Active submissions"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Contest Wins"
                          value={stats?.contestWins || 0}
                          subtitle="Winning entries"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Total Views"
                          value={stats?.totalViews?.toLocaleString() || 0}
                          subtitle="All-time views"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Earnings Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>Earnings Overview</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Total Earnings"
                          value={`$${earnings?.total || 0}`}
                          subtitle="All-time earnings"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="This Month"
                          value={`$${earnings?.thisMonth || 0}`}
                          subtitle="Current month earnings"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Last Month"
                          value={`$${earnings?.lastMonth || 0}`}
                          subtitle="Previous month earnings"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                          title="Average"
                          value={`$${earnings?.average || 0}`}
                          subtitle="Per contest win"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Videos Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>Recent Videos</Typography>
                    <Grid container spacing={3}>
                      {videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} key={video.id}>
                          <Card sx={{ 
                            bgcolor: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                          }}>
                            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                              <Box
                                component="video"
                                src={video.url}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>
                            <CardContent>
                              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                                {video.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                {video.views.toLocaleString()} views
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Uploaded {new Date(video.createdAt).toLocaleDateString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Submissions Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>Recent Submissions</Typography>
                    <Grid container spacing={3}>
                      {submissions.map((submission) => (
                        <Grid item xs={12} sm={6} md={4} key={submission.id}>
                          <Card sx={{ 
                            bgcolor: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                          }}>
                            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                              <Box
                                component="video"
                                src={submission.videoUrl}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>
                            <CardContent>
                              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                                {submission.contest.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                Status: {submission.status}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Submitted {new Date(submission.createdAt).toLocaleDateString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </div>
              ) : null}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ProfileUpdateForm />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
                        Earnings Overview
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            Total Earnings
                          </Typography>
                          <Typography variant="h3" sx={{ color: 'white' }}>
                            ${earnings?.total || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            Contest Wins
                          </Typography>
                          <Typography variant="h3" sx={{ color: 'white' }}>
                            {earnings?.contestWins || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            Average Per Win
                          </Typography>
                          <Typography variant="h3" sx={{ color: 'white' }}>
                            ${earnings?.averagePerWin || 0}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
