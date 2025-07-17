import React from 'react';
import { Box, Typography, Container, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import "./mission.css";
import Wheat1 from "../../../public/images/homepage-images/icons/1.png";
import Wheat2 from "../../../public/images/homepage-images/icons/2.png";

const MissionSection = () => {
  const theme = useTheme();

  const HighlightText = styled('span')({
    color: theme.palette.primary.main,
    fontWeight: 700,
  });

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
<div className="flex items-center justify-center space-x-4"> {/* Added flex container */}
  <img src={Wheat2} alt="Wheat decoration 1" style={{ height: "75px" }} />

  <Typography
    variant="h3"
    component="h2"
    sx={{
      fontWeight: 700,
      // Removed mb: 4 as it's not needed in a flex row for vertical spacing
      color: theme.palette.text.primary,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      }
    }}
    className='fontSansBoldMission'
  >
    Mission
  </Typography>

  <img src={Wheat1} alt="Wheat decoration 2" style={{ height: "75px" }} />
</div>

      {/* Mission Statement */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }} className='fontSansRegular'>
          It's challenging to maintain a global community of creatives and gather them in one place.  
          Therefore, our goal is to continually expand, creating spaces for creative minds worldwide to 
          <HighlightText> collaborate</HighlightText>, <HighlightText>inspire</HighlightText> each other, 
          and help shape the future of media. This is <HighlightText>OCHO MEDIA</HighlightText>.
        </Typography>
      </Box>

      <Divider sx={{ my: 6, borderColor: theme.palette.divider }} />
<div className="flex items-center justify-center space-x-4"> {/* Added flex container */}
  <img src={Wheat2} alt="Wheat decoration 1" style={{ height: "75px" }} />

  <Typography
    variant="h3"
    component="h2"
    sx={{
      fontWeight: 700,
      // Removed mb: 4 as it's not needed in a flex row for vertical spacing
      color: theme.palette.text.primary,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      }
    }}
    className='fontSansBoldMission'
  >
    WHAT WE STAND FOR
  </Typography>

  <img src={Wheat1} alt="Wheat decoration 2" style={{ height: "75px" }} />
</div>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }} className='fontSansRegular'>
          We stand for <HighlightText>genuine connection</HighlightText>, both from the brand's perspective 
          and within the <HighlightText>OHHH! Community</HighlightText>. Our objective is to ensure ongoing 
          contests on the platform, giving you numerous opportunities to participate, win awards, and earn money. 
          Brands, in turn, can discover new talent for future collaborations.
        </Typography>
      </Box>

      <Box>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }} className='fontSansRegular'>
          The most meaningful connection we stand for is the one built among our community members through our 
          platform and <HighlightText>OCommunity Discord server</HighlightText>. This allows you to network 
          and collaborate with other creators globally or locally, providing a supportive space where you can 
          relax after an exhausting day of shooting and engage with others who truly understand your creative 
          struggles and experiences.
        </Typography>
      </Box>
    </Container>
  );
};

export default MissionSection;
