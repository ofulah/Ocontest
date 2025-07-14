import React from 'react';
import { Box, Typography } from '@mui/material';
import VideoBanner from '../components/home/VideoBanner';
import SectionTitle from '../components/home/SectionTitle';
import BrandCarousel from '../components/home/BrandCarousel';
import ImageRightSection from '../components/home/ImageRightSection';
import ImageLeftSection from '../components/home/ImageLeftSection';
import FullWidthImage from '../components/home/FullWidthImage';
import CommunityBoard from '../components/home/CommunityBoard';

const Home = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '#000',
      color: '#fff',
      pt: { xs: 8, md: 13 } // Add top padding to push content down from navbar
    }}>
      <Box sx={{ position: 'relative' }}>
        <VideoBanner />
      </Box>
      <Box sx={{ mb: 6 }}> {/* Further reduced margin to bring sections closer */}
        <SectionTitle 
          leftImage="/images/homepage-images/icons/2.png"
          rightImage="/images/homepage-images/icons/1.png"
        >
          PREVIOUSLY WITH US
        </SectionTitle>
      </Box>
      <BrandCarousel />
      
      <ImageLeftSection 
        imageSrc="/images/homepage-images/home-banners/what-is.png" 
        imageAlt="What is OCONTEST"
      >    
        <Typography paragraph sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: '#decd93' }}>Ohhh! CONTEST, &nbsp;OCONTEST, or OCHO CONTEST,</Box>
          {' '}is a creative space where we find and negotiate with brands to run contests through us.
        </Typography>
        <Typography>
          We decide the concept for each contest, which could range
          from specific disciplines to montage styles, split screens, or
          anything else, but all videos must be cinematic ads.
          Brands are searching for the best talent who can express
          their voice through a camera lens, challenging themselves
          among competitors to win trophies and cash prizes.
        </Typography>
      </ImageLeftSection>
      <SectionTitle 
        leftImage="/images/homepage-images/icons/2.png"
        rightImage="/images/homepage-images/icons/1.png"
      >
        How Does it WORK?
      </SectionTitle>
      <ImageRightSection 
        imageSrc="/images/homepage-images/home-banners/application.png" 
        imageAlt="How it works"
      >        
        <Typography paragraph sx={{ mb: 3 }}>
          The OCONTEST team partners with brands that are eager to try innovative contests through our OCONTEST platform.
        </Typography>
        <Typography component="div" paragraph sx={{ mb: 3 }}>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li>We select the product</li>
            <li>Creative direction</li>
            <li>Concept</li>
            <li>Style</li>
            <li>Challenge</li>
          </ul>
        </Typography>
        <Typography>
          Once the contest is launched, we preselect participants, jump on a call with you to explain everything clearly, and then once you're officially selected, a detailed contest brief will be sent to you via email and SMS.
        </Typography>
      </ImageRightSection>
      
      <ImageLeftSection 
        imageSrc="/images/homepage-images/home-banners/review.png" 
        imageAlt="Video Submission Process"
      >        
        <Typography paragraph sx={{ mb: 3 }}>
          Once your video is color graded, professionally edited, and
          ready to go, you simply submit your video through the
          OContest platform.
        </Typography>
        <Typography>
          All submissions will be reviewed by both the OCONTEST
          team and the brand's marketing team to determine the
          winner.
        </Typography>
      </ImageLeftSection>

      <ImageRightSection 
        imageSrc="/images/homepage-images/home-banners/tt.png" 
        imageAlt="OCONTEST Benefits"
      >
        <Typography paragraph sx={{ mb: 3 }}>
          OCONTEST goes beyond just being a platform.
          We provide ongoing opportunities for videographers,
          connecting them with brands that value creative
          collaboration.
        </Typography>
        <Typography>
          Winners receive trophies, cash prizes, extensive exposure
          through brand-driven campaigns, and valuable recognition
          within our vibrant community
        </Typography>
      </ImageRightSection>

      <Box sx={{ position: 'relative', width: '100%', margin: '0.25rem 0' }}>
        <FullWidthImage 
          imageSrc="/images/homepage-images/home-banners/community.png" 
          alt="OCONTEST Community"
          height="800px"
        />
        <Box 
          component="img"
          src="/images/homepage-images/overlay/paint-black.png"
          alt="Black paint overlay"
          sx={{
            position: 'absolute',
            top: -140,
            left: -199,
            width: '70%',
            height: 'auto',
            maxWidth: '60%',
            zIndex: 1
          }}
        />
        <Box 
          component="img"
          src="/images/homepage-images/overlay/paint-white.png"
          alt="White paint overlay"
          sx={{
            position: 'absolute',
            bottom: -157,
            right: -70,
            width: 'auto',
            height: 'auto',
            maxWidth: '35%',
            zIndex: 1
          }}
        />
      </Box>

      <Box sx={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
        '& .section-title-container': {
          justifyContent: 'flex-start',
          '& h2': {
            textAlign: 'left',
            marginLeft: '20px',
          }
        }
      }}>     
        

      {/* Community Board Section */}
      <Box sx={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
        '& .section-title-container': {
          justifyContent: 'flex-start',
          '& h2': {
            textAlign: 'left',
            marginLeft: '20px',
          }
        }
      }}>
        <SectionTitle 
          leftImage="/images/homepage-images/icons/2.png"
          rightImage="/images/homepage-images/icons/1.png"
          containerClass="section-title-container"
          sx={{ '& img': { margin: '0 -25px' } }}
        >
          COMMUNITY BOARD
        </SectionTitle>
      </Box>
      <CommunityBoard />
      </Box>
      
      {/* Disclaimer Strip */}
      <Box sx={{
        backgroundColor: '#decd93 !important', // Force the pale golden color
        py: 1,
        textAlign: 'center',
        mt: 6,
        borderTop: '1px solid #e6e6e6',
        borderBottom: '1px solid #e6e6e6',
        position: 'relative',
        zIndex: 1
      }}>
        <Typography 
          variant="body1" 
          color="black" 
          fontWeight="bold" 
          textAlign="center"
          sx={{ px: 2 }}
        >
          Disclaimer: OCONTEST is not affiliated with Meta, TikTok, Google, or any other social media platforms.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
