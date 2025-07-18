import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import VideoBanner from '../components/home/VideoBanner.jsx';
import SectionTitle from '../components/home/SectionTitle.jsx';
import BrandCarousel from '../components/home/BrandCarousel.jsx';
import ImageRightSection from '../components/home/ImageRightSection.jsx';
import ImageLeftSection from '../components/home/ImageLeftSection.jsx';
import FullWidthImage from '../components/home/FullWidthImage.jsx';
import CommunityBoard from '../components/home/CommunityBoard.jsx';
import YTvivdeos from '../components/home/YTvideos.jsx';
import Mission from '../components/home/Mission.jsx';
import CollapsibleText from '../components/home/CollapsibleText.jsx';
import "./home.css";
import CommunityImage from "./communitypng.png";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sectionContainerStyles = {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: { xs: '0 20px', md: '0 40px' },
  };

  const imageTextSectionStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'stretch',
    minHeight: { xs: 'auto', md: '500px' },
    gap: { xs: '30px', md: '50px' },
    my: { xs: 4, md: 8 }
  };

  const contentColumnStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '#000',
      color: '#fff',
      pt: { xs: 8, md: 13 }
    }}>
      {/* Video Banner Section */}
      <Box sx={{ position: 'relative' }}>
        <VideoBanner />
      </Box>

      {/* Previously With Us Section */}
      <Box sx={{ ...sectionContainerStyles, mb: 6 }}>
        <SectionTitle
          leftImage="/images/homepage-images/icons/2.png"
          rightImage="/images/homepage-images/icons/1.png"
        >
          PREVIOUSLY WITH US
        </SectionTitle>
        <BrandCarousel />
      </Box>

      {/* What is OCONTEST Section */}
      <Box sx={sectionContainerStyles}>
        <ImageLeftSection
          imageSrc="/images/homepage-images/home-banners/what-is.png"
          imageAlt="What is OCONTEST"
          containerSx={imageTextSectionStyles}
          imageContainerSx={contentColumnStyles}
          textContainerSx={{
            ...contentColumnStyles,
            padding: { xs: '0', md: '0 40px' }
          }}
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
      </Box>

      {/* How Does it Work Section */}
      <Box sx={sectionContainerStyles}>
        <SectionTitle
          leftImage="/images/homepage-images/icons/2.png"
          rightImage="/images/homepage-images/icons/1.png"
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          How Does it WORK?
        </SectionTitle>

        <ImageRightSection
          imageSrc="/images/homepage-images/home-banners/application.png"
          imageAlt="How it works"
          containerSx={imageTextSectionStyles}
          imageContainerSx={contentColumnStyles}
          textContainerSx={{
            ...contentColumnStyles,
            padding: { xs: '0', md: '0 40px' }
          }}
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
          containerSx={imageTextSectionStyles}
          imageContainerSx={contentColumnStyles}
          textContainerSx={{
            ...contentColumnStyles,
            padding: { xs: '0', md: '0 40px' }
          }}
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
          containerSx={imageTextSectionStyles}
          imageContainerSx={contentColumnStyles}
          textContainerSx={{
            ...contentColumnStyles,
            padding: { xs: '0', md: '0 40px' }
          }}
        >
          <CollapsibleText>
            <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
              OCONTEST goes beyond just being a platform. We provide ongoing opportunities for videographers, connecting them with brands that value creative collaboration.
            </Typography>
            <Typography className='fontSansRegular'>
              Winners receive trophies, cash prizes, extensive exposure through brand-driven campaigns, and valuable recognition within our vibrant community.
            </Typography>
          </CollapsibleText>
        </ImageRightSection>
      </Box>

      {/* Community Image Section */}
      <Box sx={sectionContainerStyles}>
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
            minHeight: isMobile ? '400px' : '700px',
            margin: '40px 0'
          }}
        />
      </Box>

      {/* YouTube Videos Section */}
      <Box sx={sectionContainerStyles}>
        <YTvivdeos />
      </Box>

      {/* Mission Section */}
      <Box sx={sectionContainerStyles}>
        <Mission />
      </Box>

      {/* Community Board Section */}
      <Box sx={{
        ...sectionContainerStyles,
        '& .section-title-container': {
          justifyContent: 'flex-start',
          '& h2': {
            textAlign: 'left',
            marginLeft: '20px',
          }
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 4,
          my: 4
        }}>
          <img 
            src="/images/homepage-images/icons/2.png" 
            alt="Wheat decoration" 
            style={{ height: "75px" }} 
          />
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
          <img 
            src="/images/homepage-images/icons/1.png" 
            alt="Wheat decoration" 
            style={{ height: "75px" }} 
          />
        </Box>
        <CommunityBoard />
      </Box>

      {/* Disclaimer Strip */}
      <Box sx={{
        backgroundColor: '#decd93',
        py: 2,
        textAlign: 'center',
        mt: 6,
        borderTop: '1px solid #e6e6e6',
        borderBottom: '1px solid #e6e6e6',
      }}>
        <Typography 
          variant="body1" 
          color="black" 
          fontWeight="bold" 
          sx={{ px: 2 }}
        >
          Disclaimer: OCONTEST is not affiliated with Meta, TikTok, Google, or any other social media platforms.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
