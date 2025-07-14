import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Avatar, 
  Button,
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  CircularProgress, 
  IconButton,
  Chip,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, LinkedIn, Instagram, Twitter, Facebook, Language } from '@mui/icons-material';
import VideoUploadModal from '../components/videos/VideoUploadModal';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import axiosInstance from '../utils/axiosConfig';
import { videoApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

// TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contest-tabpanel-${index}`}
      aria-labelledby={`contest-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CreatorDashboard = () => {
  // State hooks
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [contestsLoading, setContestsLoading] = useState(false);
  const [videoTabValue, setVideoTabValue] = useState(0);
  const [contestTabValue, setContestTabValue] = useState(0);
  // Profile completion state (0 - 100)
  const [profileCompletion, setProfileCompletion] = useState(0);
  
  // Context hooks
  const { token, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  
  // Log token status for debugging
  useEffect(() => {
    console.log('Auth token in localStorage:', localStorage.getItem('access_token'));
  }, []);

  // Helper to compute profile completion percentage
  const computeCompletion = useCallback((profileObj) => {
    const required = ['bio', 'portfolio_url', 'shipping_address_line1', 'shipping_country'];
    const filled = required.filter((field) => profileObj && profileObj[field]);
    return Math.round((filled.length / required.length) * 100);
  }, []);

  // Update completion when dashboard data loads
  useEffect(() => {
    if (dashboardData?.profile) {
      setProfileCompletion(computeCompletion(dashboardData.profile));
    }
  }, [dashboardData, computeCompletion]);

  // Periodic reminder popup every 60 seconds
  useEffect(() => {
    const id = setInterval(() => {
      if (profileCompletion < 100) {
        enqueueSnackbar('Please complete your profile', { 
          variant: 'warning',
          autoHideDuration: 4000, // 4 seconds
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          style: { 
            marginTop: '20px', 
            marginLeft: '20px',
            backgroundColor: '#d32f2f', // Dark red background
            color: '#ffffff' // White text
          },
          ContentProps: {
            style: {
              color: '#ffffff' // Ensure text is white
            }
          }
        });
      }
    }, 60000);
    return () => clearInterval(id);
  }, [profileCompletion, enqueueSnackbar]);
  
  // Event handlers - defined with useCallback at the top level
  const handleUploadSuccess = useCallback(() => {
    enqueueSnackbar('Video uploaded successfully!', { variant: 'success' });
    // We'll use the fetchMyVideos function directly in the component
    // and refresh the videos list after upload
    const refreshVideos = async () => {
      try {
        setVideosLoading(true);
        const videos = await videoApi.getMyVideos();
        setMyVideos(videos);
      } catch (error) {
        console.error('Error refreshing videos:', error);
      } finally {
        setVideosLoading(false);
      }
    };
    refreshVideos();
  }, [enqueueSnackbar]);

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setDashboardData(prevData => ({
      ...prevData,
      profile: updatedProfile
    }));
    enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
  }, [enqueueSnackbar]);

  const handleContestTabChange = useCallback((event, newValue) => {
    setContestTabValue(newValue);
  }, []);
  
  const handleVideoTabChange = useCallback((event, newValue) => {
    setVideoTabValue(newValue);
  }, []);

  const fetchMyVideos = useCallback(async () => {
    try {
      setVideosLoading(true);
      const videos = await videoApi.getMyVideos();
      setMyVideos(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      if (error.response && error.response.status === 401) {
        enqueueSnackbar('Your session has expired. Please log in again.', { variant: 'error' });
        localStorage.removeItem('access_token'); // Clear invalid token
        navigate('/login');
      } else {
        enqueueSnackbar('Failed to load your videos', { variant: 'error' });
      }
    } finally {
      setVideosLoading(false);
    }
  }, [enqueueSnackbar, navigate]);
  
  // Contests fetching is now handled in fetchDashboardData

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setContestsLoading(true);
      setError(null);
      
      // Check if we have a token before making the request
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        enqueueSnackbar('Please log in to continue with your application', { variant: 'error' });
        navigate('/login');
        return;
      }
      
      // Fetch creator stats
      const [statsRes, earningsRes, profileRes, contestsRes] = await Promise.all([
        axiosInstance.get('/accounts/creators/stats/').catch(err => {
          console.error('Error fetching stats:', err);
          throw err;
        }),
        axiosInstance.get('/accounts/creators/earnings/').catch(err => {
          console.error('Error fetching earnings:', err);
          throw err;
        }),
        axiosInstance.get('/accounts/auth/creator-profile/').catch(err => {
          console.error('Error fetching profile:', err);
          throw err;
        }),
        axiosInstance.get('/creator/dashboard/').catch(err => {
          console.error('Error fetching contests:', err);
          throw err;
        })
      ]);
      
      // Extract data from the responses
      const stats = statsRes.data || {};
      const earnings = earningsRes.data || {};
      const profile = profileRes.data || {};
      
      // Process contests data
      const contestsData = contestsRes.data || {};
      const running_contests = contestsData.running || [];
      const applied_contests = contestsData.applied || [];
      const ended_contests = contestsData.ended || [];
      
      // Prepare profile data with default values
      const profileData = {
        ...profile,
        // Ensure all required fields have default values
        name: profile?.name || '',
        email: profile?.email || '',
        bio: profile?.bio || '',
        phone: profile?.phone || '',
        gender: profile?.gender || '',
        address: profile?.address || '',
        website: profile?.website || '',
        portfolio_url: profile?.portfolio_url || '',
        linkedin: profile?.linkedin || '',
        instagram: profile?.instagram || '',
        twitter: profile?.twitter || '',
        facebook: profile?.facebook || '',
        shipping_address_line1: profile?.shipping_address_line1 || '',
        shipping_address_line2: profile?.shipping_address_line2 || '',
        shipping_city: profile?.shipping_city || '',
        shipping_state: profile?.shipping_state || '',
        shipping_postal_code: profile?.shipping_postal_code || '',
        shipping_country: profile?.shipping_country || '',
        avatar: profile?.avatar || ''
      };
      
      // Combine the data from the response
      const combinedData = {
        stats,
        earnings,
        profile: profileData,
        running_contests,
        applied_contests,
        ended_contests,
        // Add default values for any missing data
        totalVideos: stats?.total_videos || 0,
        totalEarnings: earnings?.total_earnings || 0,
        recentEarnings: earnings?.recent_earnings || 0
      };
      
      // Process contest data
      const processContest = (item, status) => {
        if (item.contest) {
          return {
            id: item.contest.id,
            title: item.contest.title,
            prize: item.contest.prize,
            deadline: item.contest.deadline,
            thumbnail: item.contest.thumbnail,
            submission: item.submission,
            status,
            ...(status === 'past' && { result: item.result })
          };
        }
        return { ...item, status };
      };

      const allContests = [
        ...(running_contests.map(item => processContest(item, 'running'))),
        ...(applied_contests.map(item => processContest(item, 'applied'))),
        ...(ended_contests.map(item => processContest(item, 'ended')))
      ];

      setMyContests(allContests);
      setDashboardData(combinedData);
      setContestsLoading(false);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        if (error.response.status === 401) {
          enqueueSnackbar('Your session has expired. Please log in again.', { 
            variant: 'error',
            autoHideDuration: 5000
          });
          // Clear any existing tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Redirect to login with a return URL
          navigate('/login', { 
            state: { 
              from: window.location.pathname,
              message: 'Please log in to access the dashboard' 
            } 
          });
          return;
        } else if (error.response.status >= 500) {
          enqueueSnackbar('Server error. Please try again later.', { 
            variant: 'error',
            autoHideDuration: 5000
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        enqueueSnackbar('Network error. Please check your connection.', { 
          variant: 'error',
          autoHideDuration: 5000
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        enqueueSnackbar('An unexpected error occurred. Please try again.', { 
          variant: 'error',
          autoHideDuration: 5000
        });
      }
      
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, navigate]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (token && dashboardData?.videos) {
      // If videos are already in dashboard data, use them
      setMyVideos(dashboardData.videos.map(video => ({
        ...video,
        type: video.contest_id ? 'contest' : 'standalone'
      })));
    } else if (token) {
      // Otherwise fetch videos separately
      fetchMyVideos();
    }
  }, [token, fetchMyVideos, dashboardData]);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  // Extract data from the combined dashboard data
  const { 
    stats = {}, 
    earnings = {}, 
    totalVideos = stats?.total_videos || 0, 
    totalEarnings = earnings?.total_earnings || 0,
    recentEarnings = earnings?.recent_earnings || 0
  } = dashboardData || {};
  
  // Contest data is now handled through the myContests state
  
  // Get profile from user context or stats
  const profile = stats?.profile || {};



  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Profile completion bar */}
        {profileCompletion < 100 && (
          <Box mb={4}>
            <Typography variant="body1" gutterBottom>
              Profile Completion: {profileCompletion}%
            </Typography>
            <LinearProgress variant="determinate" value={profileCompletion} />
          </Box>
        )}
        {/* Profile Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h5" component="h2">Profile</Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setProfileEditModalOpen(true)}
            >
              Edit Profile
            </Button>
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={profile?.avatar || ''}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4">{profile?.name || 'Creator'}</Typography>
              <Typography color="textSecondary" paragraph>{profile?.bio || ''}</Typography>
              {profile?.address && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Address:</strong> {profile.address}
                </Typography>
              )}
              {profile?.phone && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Phone:</strong> {profile.phone}
                </Typography>
              )}
              {profile?.email && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Email:</strong> {profile.email}
                </Typography>
              )}
              
              {/* Website and Portfolio */}
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile?.website && (
                  <Chip 
                    icon={<Language fontSize="small" />} 
                    label="Website" 
                    component="a" 
                    href={profile.website} 
                    target="_blank"
                    clickable
                    size="small"
                  />
                )}
                {profile?.portfolio_url && (
                  <Chip 
                    label="Portfolio" 
                    component="a" 
                    href={profile.portfolio_url} 
                    target="_blank"
                    clickable
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
              
              {/* Social Media Links */}
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile?.linkedin && (
                  <IconButton 
                    size="small" 
                    color="primary" 
                    component="a" 
                    href={profile.linkedin} 
                    target="_blank"
                    aria-label="LinkedIn"
                  >
                    <LinkedIn />
                  </IconButton>
                )}
                {profile?.instagram && (
                  <IconButton 
                    size="small" 
                    sx={{ color: '#E1306C' }} 
                    component="a" 
                    href={profile.instagram} 
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <Instagram />
                  </IconButton>
                )}
                {profile?.twitter && (
                  <IconButton 
                    size="small" 
                    color="info" 
                    component="a" 
                    href={profile.twitter} 
                    target="_blank"
                    aria-label="Twitter"
                  >
                    <Twitter />
                  </IconButton>
                )}
                {profile?.facebook && (
                  <IconButton 
                    size="small" 
                    color="primary" 
                    component="a" 
                    href={profile.facebook} 
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <Facebook />
                  </IconButton>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Grid container spacing={2}>
                <Grid item xs={6} sm="auto">
                  <Typography variant="h6">{stats.total_submissions || 0}</Typography>
                  <Typography color="textSecondary">Submissions</Typography>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Typography variant="h6">{stats.contests_won || 0}</Typography>
                  <Typography color="textSecondary">Contests Won</Typography>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Typography variant="h6">{totalVideos}</Typography>
                  <Typography color="textSecondary">Videos</Typography>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Earnings Overview */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Earnings Overview</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" color="textSecondary">Total Earnings</Typography>
                <Typography variant="h3">${totalEarnings.toFixed(2)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" color="textSecondary">Recent Earnings</Typography>
                <Typography variant="h3">${recentEarnings.toFixed(2)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" color="textSecondary">Pending Payments</Typography>
                <Typography variant="h3">${(earnings?.pending_payments || 0).toFixed(2)}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        

        
        {/* Contests Section with Tabs */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>My Contests</Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={contestTabValue} onChange={handleContestTabChange} aria-label="contest tabs">
              <Tab label="Running Contests" />
              <Tab label="Applied Contests" />
              <Tab label="Ended Contests" />
            </Tabs>
          </Box>
          
          {/* Running Contests Tab Panel */}
          <TabPanel value={contestTabValue} index={0}>
            {contestsLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : myContests.filter(contest => contest.status === 'active').length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Contest Name</TableCell>
                      <TableCell>Prize</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myContests
                      .filter(contest => contest.status === 'active')
                      .map((contest, index) => (
                        <TableRow key={`active-contest-${contest.id || index}`}>
                          <TableCell>
                            <Link 
                              to={`/contests/${contest.id}`}
                              style={{ textDecoration: 'none', color: '#fff', fontWeight: 500 }}
                            >
                              {contest.title}
                            </Link>
                          </TableCell>
                          <TableCell>{contest.prize ? `$${contest.prize}` : 'N/A'}</TableCell>
                          <TableCell>
                            {contest.deadline ? 
                              new Date(contest.deadline).toLocaleDateString() : 
                              'Not specified'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label="Active" 
                              color="success" 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" p={3}>
                <Typography>No running contests found.</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/contests"
                  sx={{ mt: 2 }}
                >
                  Browse Contests
                </Button>
              </Box>
            )}
          </TabPanel>
          
          {/* Applied Contests Tab Panel */}
          <TabPanel value={contestTabValue} index={1}>
            {contestsLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : myContests.filter(contest => contest.status === 'applied').length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Contest Name</TableCell>
                      <TableCell>Prize</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myContests
                      .filter(contest => contest.status === 'applied')
                      .map((contest, index) => (
                        <TableRow key={`applied-contest-${contest.id || index}`}>
                          <TableCell>
                            <Link 
                              to={`/contests/${contest.id}`}
                              style={{ textDecoration: 'none', color: '#fff', fontWeight: 500 }}
                            >
                              {contest.title}
                            </Link>
                          </TableCell>
                          <TableCell>{contest.prize ? `$${contest.prize}` : 'N/A'}</TableCell>
                          <TableCell>
                            {contest.deadline ? 
                              new Date(contest.deadline).toLocaleDateString() : 
                              'Not specified'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label="Applied" 
                              color="primary" 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" p={3}>
                <Typography>You haven't applied to any contests yet.</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/contests"
                  sx={{ mt: 2 }}
                >
                  Browse Contests
                </Button>
              </Box>
            )}
          </TabPanel>
          
          {/* Ended Contests Tab Panel */}
          <TabPanel value={contestTabValue} index={2}>
            {contestsLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : myContests.filter(contest => contest.status === 'past').length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Contest Name</TableCell>
                      <TableCell>Prize</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myContests
                      .filter(contest => contest.status === 'past')
                      .map((contest, index) => (
                        <TableRow key={`past-contest-${contest.id || index}`}>
                          <TableCell>
                            <Link 
                              to={`/contests/${contest.id}`}
                              style={{ textDecoration: 'none', color: '#fff', fontWeight: 500 }}
                            >
                              {contest.title}
                            </Link>
                          </TableCell>
                          <TableCell>{contest.prize ? `$${contest.prize}` : 'N/A'}</TableCell>
                          <TableCell>
                            {contest.deadline ? 
                              new Date(contest.deadline).toLocaleDateString() : 
                              'Not specified'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label="Completed" 
                              color="default" 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" p={3}>
                <Typography>No past contests found.</Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>

        {/* My Videos Section */}
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">My Videos</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setUploadModalOpen(true)}
              disabled={videosLoading}
            >
              Upload Video
            </Button>
          </Box>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={videoTabValue} onChange={handleVideoTabChange} aria-label="video tabs" centered>
              <Tab label="All Videos" />
              <Tab label="Recent Uploads" />
            </Tabs>
          </Box>
          
          {/* All Videos Tab */}
          <TabPanel value={videoTabValue} index={0}>
            {videosLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : myVideos.length > 0 ? (
              <Grid container spacing={3}>
                {myVideos.filter(video => true).map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`video-${video.id || index}`}>
                    <Paper component={Link} to={`/videos/${video.id}`} elevation={2} sx={{ p: 2, textDecoration: 'none', color: 'inherit', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                      <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2, bgcolor: 'black' }}>
                        {/* Video type badge */}
                        <Box 
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 1
                          }}
                        >
                          <Chip 
                            size="small" 
                            label={video.type === 'contest' ? 'Contest Entry' : 'Standalone'}
                            color={video.type === 'contest' ? 'primary' : 'default'}
                          />
                        </Box>
                        
                        {video.thumbnail_url || video.thumbnail ? (
                          <Box
                            component="img"
                            src={video.thumbnail_url ? video.thumbnail_url : `http://localhost:8000${video.thumbnail}`}
                            alt={video.title}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'grey.800'
                            }}
                          >
                            <Typography variant="body2" color="white">
                              No Thumbnail
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography variant="subtitle1" noWrap gutterBottom>
                        {video.title}
                      </Typography>
                      
                      {/* Show contest info if it's a contest video */}
                      {video.type === 'contest' && video.contestTitle && (
                        <Typography variant="body2" color="primary" gutterBottom>
                          For contest: {video.contestTitle}
                        </Typography>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {video.created_at || video.submissionDate ? new Date(video.created_at || video.submissionDate).toLocaleDateString() : 'Date not available'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" p={3}>
                <Typography>You haven't uploaded any videos yet.</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setUploadModalOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Upload Your First Video
                </Button>
              </Box>
            )}
          </TabPanel>
          
          {/* Recent Uploads Tab */}
          <TabPanel value={videoTabValue} index={1}>
            {videosLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : myVideos.length > 0 ? (
              <Grid container spacing={3}>
                {myVideos.filter(video => videoTabValue === 1 ? true : false)
                  .sort((a, b) => new Date(b.created_at || b.submissionDate || 0) - new Date(a.created_at || a.submissionDate || 0))
                  .map((video, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`video-${video.id || index}`}>
                      <Paper component={Link} to={`/videos/${video.id}`} elevation={2} sx={{ p: 2, textDecoration: 'none', color: 'inherit', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                        <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2, bgcolor: 'black' }}>
                          {/* Video type badge */}
                          <Box 
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              zIndex: 1
                            }}
                          >
                            <Chip 
                              size="small" 
                              label={video.type === 'contest' ? 'Contest Entry' : 'Standalone'}
                              color={video.type === 'contest' ? 'primary' : 'default'}
                            />
                          </Box>
                          
                          {video.thumbnail_url ? (
                            <Box
                              component="img"
                              src={video.thumbnail_url}
                              alt={video.title}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.800'
                              }}
                            >
                              <Typography variant="body2" color="white">
                                No Thumbnail
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="subtitle1" noWrap gutterBottom>
                          {video.title}
                        </Typography>
                        
                        {/* Show contest info if it's a contest video */}
                        {video.type === 'contest' && video.contestTitle && (
                          <Typography variant="body2" color="primary" gutterBottom>
                            For contest: {video.contestTitle}
                          </Typography>
                        )}
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {new Date(video.created_at || video.submissionDate).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <Box textAlign="center" p={3}>
                <Typography>No recent videos to display.</Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>

          {/* Video Upload Modal */}
          <VideoUploadModal 
            open={uploadModalOpen} 
            onClose={() => setUploadModalOpen(false)} 
            onSuccess={handleUploadSuccess} 
          />

        {/* Profile Edit Modal */}
        <ProfileEditModal
          open={profileEditModalOpen}
          onClose={() => setProfileEditModalOpen(false)}
          profile={dashboardData?.profile || {}}
          onSuccess={handleProfileUpdate}
        />
      </Box>
    </Container>
  );
};

export default CreatorDashboard;
