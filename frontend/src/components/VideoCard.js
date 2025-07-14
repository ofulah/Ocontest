import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending_approval':
      return '#ffa726'; // Orange
    case 'approved':
      return '#66bb6a'; // Green
    case 'rejected':
      return '#ef5350'; // Red
    case 'under_review':
      return '#42a5f5'; // Blue
    case 'finalist':
      return '#ab47bc'; // Purple
    case 'won':
      return '#ffd700'; // Gold
    case 'not_selected':
      return '#9e9e9e'; // Grey
    default:
      return '#9e9e9e';
  }
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Don't navigate to video if clicking on creator link
    if (e.target.closest('.creator-link')) {
      e.stopPropagation();
      return;
    }
    navigate(`/videos/${video.id}`);
  };

  const MotionCard = motion(Card);
  
  return (
    <MotionCard
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      sx={{
        height: '100%',
        width: 320, // Fixed width for all cards
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={handleClick}
    >
      <Box 
        sx={{ 
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#000',
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden'
        }}
      >
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
            label={video.is_standalone ? 'Standalone' : 'Contest Entry'}
            color={video.is_standalone ? 'default' : 'primary'}
            sx={{
              backgroundColor: video.is_standalone ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
              color: video.is_standalone ? '#fff' : '#000',
              fontWeight: 500
            }}
          />
        </Box>
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
              opacity: 1,
            },
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <PlayArrowIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" noWrap>
            {video.title}
          </Typography>
          <Tooltip title={video.status_display}>
            <Chip
              label={video.status_display}
              size="small"
              sx={{
                backgroundColor: getStatusColor(video.status),
                color: 'white',
                fontWeight: 'bold',
                ml: 1,
              }}
            />
          </Tooltip>
        </Box>


        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="rgba(255,255,255,0.5)">
            By {video.creator_name || 'Unknown Creator'}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.5)">
            {new Date(video.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default VideoCard;
