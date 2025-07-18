import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import "./mission.css";

const MissionSection = () => {
  const theme = useTheme();

  const HighlightText = styled('span')({
    color: theme.palette.primary.main,
    fontWeight: 700,
  });

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
      <Box
        sx={{
          width: { xs: '100%', md: '75%' },
          mx: 'auto', // center the content horizontally
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: theme.palette.text.primary,
            textAlign: 'left',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.5rem',
            },
          }}
          className='fontSansBoldMission'
        >
          Mission
        </Typography>

        {/* Mission Statement */}
        <Typography
          variant="body1"
          paragraph
          sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'left' }}
          className='fontSansRegular'
        >
          It's challenging to maintain a global community of creatives and gather them in one place.  
          Therefore, our goal is to continually expand, creating spaces for creative minds worldwide to 
          <HighlightText> collaborate</HighlightText>, <HighlightText>inspire</HighlightText> each other, 
          and help shape the future of media. This is <HighlightText>OCHO MEDIA</HighlightText>.
        </Typography>

        <Divider sx={{ my: 6, borderColor: theme.palette.divider }} />

        {/* Second Title */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: theme.palette.text.primary,
            textAlign: 'left',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.5rem',
            },
          }}
          className='fontSansBoldMission'
        >
          WHAT WE STAND FOR
        </Typography>

        {/* Second Paragraph */}
        <Typography
          variant="body1"
          paragraph
          sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'left' }}
          className='fontSansRegular'
        >
          We stand for <HighlightText>genuine connection</HighlightText>, both from the brand's perspective 
          and within the <HighlightText>OHHH! Community</HighlightText>. Our objective is to ensure ongoing 
          contests on the platform, giving you numerous opportunities to participate, win awards, and earn money. 
          Brands, in turn, can discover new talent for future collaborations.
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'left' }}
          className='fontSansRegular'
        >
          The most meaningful connection we stand for is the one built among our community members through our 
          platform and <HighlightText>OCommunity Discord server</HighlightText>. This allows you to network 
          and collaborate with other creators globally or locally, providing a supportive space where you can 
          relax after an exhausting day of shooting and engage with others who truly understand your creative 
          struggles and experiences.
        </Typography>
      </Box>
    </Box>
  );
};

export default MissionSection; 

