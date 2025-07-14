import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Link,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
} from '@mui/material';
import { VideoLibrary as VideoIcon, Email as EmailIcon, LocationOn as LocationIcon, Edit as EditIcon, EmojiEvents as TrophyIcon, Event as EventIcon, Language as WebsiteIcon, Instagram as InstagramIcon, Twitter as TwitterIcon, LinkedIn as LinkedInIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import VideoCard from '../components/VideoCard';
import axiosInstance from '../utils/axiosConfig';

const CreatorProfile = () => {
  const { id } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Get current user data
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bannerImage, setBannerImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBannerUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('banner_image', selectedFile);

    try {
      const response = await axiosInstance.patch(`/accounts/creator-profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBannerImage(response.data.banner_image);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading banner:', err);
      setError('Failed to upload banner image');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      // Set ownership status immediately based on URL and current user
      const isOwn = !id || (currentUser && id === currentUser.id.toString());
      console.log('Initial profile check:', { currentUser, id, isOwn });
      setIsOwnProfile(isOwn);
      try {
        // Always fetch from creator-profile endpoint when no ID
        let profileEndpoint = id ? `/accounts/public/${id}/` : '/accounts/auth/creator-profile/';
        console.log('Fetching creator profile...');
        const [creatorResponse, videosResponse] = await Promise.all([
          axiosInstance.get(profileEndpoint),
          axiosInstance.get(id ? `/videos/creator/${id}/` : '/videos/creator/me/')
        ]);

        console.log('Creator data:', creatorResponse.data);
        setCreator(creatorResponse.data);
        setVideos(videosResponse.data);
        setBannerImage(creatorResponse.data.banner_image || '');
        // Double check ownership with profile data
        if (creatorResponse.data && creatorResponse.data.id) {
          const isOwn = !id || (currentUser && creatorResponse.data.id === currentUser.id);
          console.log('Profile data check:', {
            currentUserId: currentUser?.id,
            profileId: creatorResponse.data.id,
            isOwn,
            id
          });
          setIsOwnProfile(isOwn);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load creator profile');
        setLoading(false);
      }
    };

    fetchCreatorProfile();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!creator) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Creator not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Banner Section */}
      <Box 
        onClick={() => {
          console.log('Banner clicked:', { isOwnProfile });
          if (isOwnProfile) {
            setIsEditing(true);
          }
        }}
        sx={{
          height: '300px',
          width: '100%',
          position: 'relative',
          mb: 4,
          bgcolor: 'grey.100',
          border: !bannerImage && isOwnProfile ? '2px dashed #ccc' : 'none',
          backgroundImage: bannerImage ? `url(${bannerImage})` : 'url(/images/defaults/default-banner.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: isOwnProfile ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          '&:hover': isOwnProfile ? {
            bgcolor: 'grey.200',
            border: !bannerImage ? '2px dashed #999' : 'none',
            '&::after': bannerImage ? {
              content: '"Click to Change Banner"',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            } : {}
          } : {}
        }}
      >
        {/* Default banner shows instructions */}
      </Box>

      {/* Profile Info */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Avatar
            src={creator.profile_picture || '/images/defaults/default-avatar.svg'}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              margin: '-60px auto 20px',
              bgcolor: '#1e1e1e'
            }}
          />
          <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
            {creator.full_name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
            {creator.bio || "This creator hasn't added a bio yet."}
          </Typography>

          {/* Stats and Basic Info */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {creator.country && (
              <Chip
                icon={<LocationIcon />}
                label={creator.country}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            )}
            <Chip
              icon={<VideoIcon />}
              label={`${creator.total_videos} Videos`}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
            <Chip
              icon={<TrophyIcon />}
              label={`${creator.contest_wins || 0} Wins`}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
            <Chip
              icon={<EventIcon />}
              label={`${creator.contest_participations || 0} Contests`}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </Box>

          {/* Additional Info */}
          <Grid container spacing={3} sx={{ maxWidth: '800px', margin: '0 auto' }}>
            {creator.experience_level && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  p: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                    Experience Level
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {creator.experience_level}
                  </Typography>
                </Box>
              </Grid>
            )}
            {creator.specialties && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  p: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                    Specialties
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {creator.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}
            {creator.website && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  p: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                    Portfolio
                  </Typography>
                  <Link 
                    href={creator.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main' }}
                  >
                    View Portfolio
                  </Link>
                </Box>
              </Grid>
            )}
            {creator.social_links && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  p: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                    Social Media
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {Object.entries(creator.social_links || {}).map(([platform, url]) => {
                      let Icon;
                      switch(platform.toLowerCase()) {
                        case 'instagram':
                          Icon = InstagramIcon;
                          break;
                        case 'twitter':
                          Icon = TwitterIcon;
                          break;
                        case 'linkedin':
                          Icon = LinkedInIcon;
                          break;
                        case 'facebook':
                          Icon = FacebookIcon;
                          break;
                        default:
                          Icon = WebsiteIcon;
                      }
                      return (
                        <IconButton
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: 'white',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                          size="large"
                        >
                          <Icon />
                        </IconButton>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Videos Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              mb: 3,
              textAlign: 'center'
            }}
          >
            Videos
          </Typography>
          <Grid 
            container 
            spacing={3} 
            sx={{
              justifyContent: 'center',
              '& .MuiGrid-item': {
                display: 'flex',
                justifyContent: 'center'
              }
            }}
          >
            {videos.map((video) => (
              <Grid item key={video.id}>
                <VideoCard video={video} />
              </Grid>
            ))}
            {videos.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  No videos available
                </Typography>
              </Box>
            )}
          </Grid>
        </Box>
      </Container>

      {/* Banner Edit Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{bannerImage ? 'Change Banner Image' : 'Add Banner Image'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Requirements
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Recommended size: 1920×480 pixels
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Aspect ratio: 4:1 (width should be 4 times the height)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • File types: JPG, PNG, or WebP
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Maximum file size: 5MB
            </Typography>
            <Box 
              sx={{
                mt: 3,
                p: 3,
                border: '2px dashed #ccc',
                borderRadius: 1,
                bgcolor: 'grey.50',
                textAlign: 'center'
              }}
            >
              <Input
                type="file"
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                fullWidth
                sx={{
                  '&::before': { display: 'none' },
                  '&::after': { display: 'none' }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button
            onClick={handleBannerUpload}
            variant="contained"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatorProfile;
