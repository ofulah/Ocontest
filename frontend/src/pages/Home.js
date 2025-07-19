import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import VideoBanner from '../components/home/VideoBanner.jsx';
import SectionTitle from '../components/home/SectionTitle.jsx';
import BrandCarousel from '../components/home/BrandCarousel.jsx';
import ImageRightSection from '../components/home/ImageRightSection.jsx';
import ImageLeftSection from '../components/home/ImageLeftSection.jsx';
import CommunityBoard from '../components/home/CommunityBoard.jsx';
import YTvideos from '../components/home/YTvideos.jsx';
import Mission from '../components/home/Mission.jsx';
import CollapsibleText from '../components/home/CollapsibleText.jsx';
import "./home.css";
import CommunityImage from "./communitypng.png";
import ImageHeadingText from './ImageHeading.jsx';
import image1 from "./titles/5.png";
import image2 from "./titles/4.png";
import image3 from "./titles/3.png";
import image4 from "./titles/2.png";
import image5 from "./titles/1.png";

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

  // Mobile component with bordered text only
  const MobileImageTextSection = ({ imageSrc, imageAlt, children }) => (
    <Box sx={{ 
      ...sectionContainerStyles,
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      my: 4
    }}>
      {/* Image without border but with rounded corners */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '12px'
      }}>
        <img 
          src={imageSrc} 
          alt={imageAlt}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '12px'
          }}
        />
      </Box>
      
      {/* Text content with border */}
      <Box sx={{
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        {children}
      </Box>
    </Box>
  );

  // Desktop text container with borders only
  const borderedTextContainerStyles = {
    ...contentColumnStyles,
    padding: { xs: '20px', md: '40px' },
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    backgroundColor: 'rgba(0,0,0,0.2)'
  };

  // Image container for desktop (no border)
  const imageContainerStyles = {
    ...contentColumnStyles,
    overflow: 'hidden',
    borderRadius: '16px',
    img: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      borderRadius: '16px'
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '#000',
      color: '#fff',
      pt: { xs: 8, md: 13 },
      marginTop: "50px"
    }}>
      {/* Video Banner Section */}
      <Box sx={{ position: 'relative' }}>
        <VideoBanner />
      </Box>

      <ImageHeadingText
        imageSrc={image1}
        imageAlt="Previously With Us"
        align="center"
      />
      
      <BrandCarousel />

      <ImageHeadingText
        imageSrc={image2}
        imageAlt="What is OCONTEST"
        align="center"
      />

      {/* What is OCONTEST Section */}
      {isMobile ? (
        <MobileImageTextSection 
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
        </MobileImageTextSection>
      ) : (
        <Box sx={sectionContainerStyles}>
          <ImageLeftSection
            imageSrc="/images/homepage-images/home-banners/what-is.png"
            imageAlt="What is OCONTEST"
            containerSx={imageTextSectionStyles}
            imageContainerSx={imageContainerStyles}
            textContainerSx={borderedTextContainerStyles}
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
      )}

      {/* How Does it Work Section */}
      <Box sx={sectionContainerStyles}>
        <SectionTitle
          leftImage="/images/homepage-images/icons/2.png"
          rightImage="/images/homepage-images/icons/1.png"
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          How Does it WORK?
        </SectionTitle>

        {/* Application Section */}
        {isMobile ? (
          <MobileImageTextSection 
            imageSrc="/images/homepage-images/home-banners/application.png"
            imageAlt="How it works"
          >
            <CollapsibleText>
              <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
                The OCONTEST team partners with brands that are eager to try innovative contests through our OCONTEST platform.
              </Typography>
              <Typography component="div" paragraph sx={{ 
                mb: 3,
                textAlign: 'left',
                width: '100%'
              }} className='fontSansRegular'>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1.2rem',
                  textAlign: 'left',
                  listStylePosition: 'inside'
                }}>
                  <li style={{ textAlign: 'left' }}>We select the product</li>
                  <li style={{ textAlign: 'left' }}>Creative direction</li>
                  <li style={{ textAlign: 'left' }}>Concept</li>
                  <li style={{ textAlign: 'left' }}>Style</li>
                  <li style={{ textAlign: 'left' }}>Challenge</li>
                </ul>
              </Typography>
              <Typography className='fontSansRegular'>
                Once the contest is launched, we preselect participants, jump on a call with you to explain everything clearly, and then once you're officially selected, a detailed contest brief will be sent to you via email and SMS.
              </Typography>
            </CollapsibleText>
          </MobileImageTextSection>
        ) : (
          <ImageRightSection
            imageSrc="/images/homepage-images/home-banners/application.png"
            imageAlt="How it works"
            containerSx={imageTextSectionStyles}
            imageContainerSx={imageContainerStyles}
            textContainerSx={borderedTextContainerStyles}
          >
            <CollapsibleText>
              <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
                The OCONTEST team partners with brands that are eager to try innovative contests through our OCONTEST platform.
              </Typography>
              <Typography component="div" paragraph sx={{ mb: 3 }} className='fontSansRegular'>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', alignContent: "flex-start"}}>
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
        )}

        {/* Review Section */}
        {isMobile ? (
          <MobileImageTextSection 
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
          </MobileImageTextSection>
        ) : (
          <ImageLeftSection
            imageSrc="/images/homepage-images/home-banners/review.png"
            imageAlt="Video Submission Process"
            containerSx={imageTextSectionStyles}
            imageContainerSx={imageContainerStyles}
            textContainerSx={borderedTextContainerStyles}
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
        )}

        {/* Benefits Section */}
        {isMobile ? (
          <MobileImageTextSection 
            imageSrc="./TT.png"
            imageAlt="OCONTEST Benefits"
          >
            <CollapsibleText>
              <Typography paragraph sx={{ mb: 3 }} className='fontSansBold'>
                OCONTEST goes beyond just being a platform. We provide ongoing opportunities for videographers, connecting them with brands that value creative collaboration.
              </Typography>
              <Typography className='fontSansRegular'>
                Winners receive trophies, cash prizes, extensive exposure through brand-driven campaigns, and valuable recognition within our vibrant community.
              </Typography>
            </CollapsibleText>
          </MobileImageTextSection>
        ) : (
          <ImageRightSection
            imageSrc="./TT.png"
            imageAlt="OCONTEST Benefits"
            containerSx={imageTextSectionStyles}
            imageContainerSx={imageContainerStyles}
            textContainerSx={borderedTextContainerStyles}
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
        )}
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
            margin: '40px 0',
            borderRadius: '16px'
          }}
        />
      </Box>

      <Box sx={sectionContainerStyles}>
        <Mission />
      </Box>

      {/* YouTube Videos Section */}
      <Box sx={sectionContainerStyles}>
        <YTvideos />
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
        <ImageHeadingText
          imageSrc={image5}
          imageAlt="Community Board"
          align="center"
        />
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
        sx={{ 
          px: 2,
          fontWeight: 800,
          fontSize: '1.1rem',
          textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)',
          letterSpacing: '0.3px' 
        }}
      >
        Disclaimer: OCONTEST is not affiliated with Meta, TikTok, Google, or any other social media platforms.
      </Typography>
      </Box>
    </Box>
  );
};

export default Home;
