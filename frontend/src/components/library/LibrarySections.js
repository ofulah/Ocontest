import React from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Reusable Video Section Component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {number} [props.columns=3] - Number of columns in grid (1-12)
 * @param {boolean} [props.largeThumb=false] - Use large thumbnail size
 * @param {number} [props.count=3] - Number of thumbnails to show
 * @param {string} [props.thumbnail='/images/library/videocover.png'] - Default thumbnail image
 * @param {boolean} [props.showHeader=true] - Show/hide section header
 * @param {boolean} [props.showMoreButton=true] - Show/hide the more button
 * @param {function} [props.onMoreClick] - Callback when more button is clicked
 */
const VideoSection = ({
  title,
  columns = 3,
  largeThumb = false,
  count = 3,
  thumbnail = '/images/library/videocover.png',
  thumbnails, // Array of custom thumbnails
  showHeader = true,
  showMoreButton = true,
  onMoreClick,
}) => {
  // Fixed thumbnail dimensions for consistency
  const thumbHeight = 160;
  const thumbWidth = 300; // Fixed width in pixels
  const gap = 16; // 16px gap between items (matches theme.spacing(2))

  return (
    <Box sx={{ 
      mb: 4,
      width: '100%',
      overflow: 'hidden' // Ensures content doesn't overflow the container
    }}>
      {showHeader && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            {title}
          </Typography>
          {showMoreButton && (
            <IconButton 
              size="small" 
              sx={{ color: '#fff', ml: 1 }}
              onClick={onMoreClick}
            >
              <ArrowForwardIosIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>
      )}
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px' // Space between rows including the separator
      }}>
        {Array.from({ length: Math.ceil(count / columns) }).map((_, rowIndex) => {
          const startIdx = rowIndex * columns;
          const endIdx = Math.min(startIdx + columns, count);
          const isLastRow = rowIndex === Math.ceil(count / columns) - 1;
          
          return (
            <React.Fragment key={rowIndex}>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '45px',
                mb: 2
              }}>
                {Array.from({ length: endIdx - startIdx }).map((_, colIndex) => {
                  const idx = startIdx + colIndex;
                  const thumbSrc = thumbnails && thumbnails[idx] ? thumbnails[idx] : thumbnail;
                  
                  return (
                    <Box
                      key={idx}
                      sx={{
                        width: thumbWidth,
                        flexShrink: 0
                      }}
                    >
                      <Box
                        component="img"
                        src={thumbSrc}
                        alt={`${title} ${idx + 1}`}
                        sx={{
                          width: '100%',
                          height: thumbHeight,
                          objectFit: 'cover',
                          borderRadius: 4,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          aspectRatio: '16/9',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
              {!isLastRow && (
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '2px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    my: 1,
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: '0 0 10px 1px rgba(255,255,255,0.5)'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

/**
 * Main Library Sections Component
 * @param {Object} props
 * @param {Array} [props.sections=[]] - Array of section configurations
 */
const LibrarySections = ({ 
  sections = [
    { 
      title: 'Highlighted Winners',
      count: 1,
      columns: 1,
    },
    {
      title: 'Resistance - Initiative',
      count: 3,
      columns: 3,
      thumbnails: [
        '/images/library/videocover.png',
        '/images/library/vision.png',
        '/images/library/videocover.png'
      ]
    },
    {
      title: 'Resistance - Initiative',
      count: 3,
      columns: 3,
    },
  ] 
}) => {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, pb: 4, pt: 2 }}>
      {sections.map((section, index) => (
        <VideoSection
          key={index}
          {...section}
          onMoreClick={() => console.log(`View more: ${section.title}`)}
        />
      ))}
    </Box>
  );
};

export { VideoSection };
export default LibrarySections;
