import React from 'react';
import { Box, Typography } from '@mui/material';
import VideoBanner from '../components/home/VideoBanner.jsx';
import SectionTitle from '../components/home/SectionTitle.jsx';
import BrandCarousel from '../components/home/BrandCarousel.jsx';
import ImageRightSection from '../components/home/ImageRightSection.jsx';
import ImageLeftSection from '../components/home/ImageLeftSection.jsx';
import FullWidthImage from '../components/home/FullWidthImage.jsx';
import CommunityBoard from '../components/home/CommunityBoard.jsx';
import YTvivdeos from '../components/home/YTvideos.jsx';
import Mission from '../components/home/Mission.js';
import CollapsibleText from '../components/home/CollapsibleText.jsx';
import "./home.css";
import CommunityImage from "./communitypng.png";

import Wheat1 from "../../public/images/homepage-images/icons/1.png";
import Wheat2 from "../../public/images/homepage-images/icons/2.png";

const Home = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '#000',
      color: '#fff',
      pt: { xs: 8, md: 13 }
    }}>
      <Box sx={{ position: 'relative' }}>
        <VideoBanner />
      </Box>

      <Box sx={{ mb: 6 }}>
        <SectionTitle
          leftImage="/images/homepage-images/icons/2.png"
          rightImage="/images/homepage-images/icons/1.png"
        >
          PREVIOUSLY WITH US
        </SectionTitle>
      </Box>

      <BrandCarousel className="carosel" />

      <ImageLeftSection
        imageSrc="/images/homepage-images/home-banners/what-is.png"
        imageAlt="What is OCONTEST"
      >
        <CollapsibleText>
          <Typography paragraph sx={{ mb: 3 }} className='fontSansRegular'>
            <Box component="span" sx={{ color: 'rgba(222, 205, 147, 1)' }} className='fontSansBold'>
              Ohhh! CONTEST, &nbsp;OCONTEST, or OCHO CONTEST,
            </Box>
            {' '}is a creative space where we find and negotiate with brands to run contests through us.
          </Typography>
          <Typography className='fontSansRegular'>
            We decide the concept for each contest, which could range from specific disciplines to montage styles, split screens, or anything else, but all videos must be cinematic ads. Brands are searching for the best talent who can express their voice through a camera lens, challenging themselves among competitors to win trophies and cash prizes.
          </Typography>
        </CollapsibleText>
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
        <CollapsibleText>
          <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
            The OCONTEST team partners with brands that are eager to try innovative contests through our OCONTEST platform.
          </Typography>
          <Typography component="div" paragraph sx={{ mb: 3 }} className='fontSansRegular'>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>We select the product</li>
              <li>Creative direction</li>
              <li>Concept</li>
              <li>Style</li>
              <li>Challenge</li>
            </ul>
          </Typography>
          <Typography className='fontSansRegular'>
            Once the contest is launched, we preselect participants, jump on a call with you to explain everything clearly, and then once you're officially selected, a detailed contest brief will be sent to you via email and SMS.
          </Typography>
        </CollapsibleText>
      </ImageRightSection>

      <ImageLeftSection
        imageSrc="/images/homepage-images/home-banners/review.png"
        imageAlt="Video Submission Process"
      >
        <CollapsibleText>
          <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
            Once your video is color graded, professionally edited, and ready to go, you simply submit your video through the OContest platform.
          </Typography>
          <Typography className='fontSansRegular'>
            All submissions will be reviewed by both the OCONTEST team and the brand's marketing team to determine the winner.
          </Typography>
        </CollapsibleText>
      </ImageLeftSection>

      <ImageRightSection
        imageSrc="images/homepage-images/home-banners/tt.png"
        imageAlt="OCONTEST Benefits"
      >
        <CollapsibleText>
          <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
            OCONTEST goes beyond just being a platform. We provide ongoing opportunities for videographers, connecting them with brands that value creative collaboration.
          </Typography>
          <Typography className='fontSansRegular'>
            Winners receive trophies, cash prizes, extensive exposure through brand-driven campaigns, and valuable recognition within our vibrant community
          </Typography>
        </CollapsibleText>
      </ImageRightSection>

      <img
        src={CommunityImage}
        alt="Community Banner"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '80vh',
          minHeight: "700px"
        }}
      />

      <YTvivdeos />
      <Mission />

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
        <div className="flex items-center justify-center space-x-4">
          <img src={Wheat2} alt="Wheat decoration 1" style={{ height: "75px" }} />
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "white",
              fontSize: '1.5rem',
            }}
          >
            Community Board
          </Typography>
          <img src={Wheat1} alt="Wheat decoration 2" style={{ height: "75px" }} />
        </div>
      </Box>

      <CommunityBoard />

      {/* Disclaimer Strip */}
      <Box sx={{
        backgroundColor: '#000000ff !important';
        py: 1,
        textAlign: 'center',
        mt: 6,
        borderTop: '1px solid #000000ff',
        borderBottom: '1px solid #000000ff',
        position: 'relative',
        zIndex: 1
      }}>

        <Typography
          variant="body1"
          color="white"
          backgroundColor="black"
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
