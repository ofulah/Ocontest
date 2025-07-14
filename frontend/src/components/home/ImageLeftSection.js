import React from 'react';
import { Box, styled } from '@mui/material';

const SectionContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  color: 'white',
  padding: '1.5rem 5% 3rem 5%',
  gap: '4rem',
  '@media (max-width: 992px)': {
    flexDirection: 'column',
    padding: '4rem 5%',
    gap: '2rem',
    textAlign: 'center',
  },
});

const ImageContainer = styled(Box)({
  flex: '1',
  minWidth: '45%',
  height: '400px',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  '@media (max-width: 992px)': {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
});

const ContentContainer = styled(Box)({
  flex: '1',
  maxWidth: '600px',
  position: 'relative',
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '400px', // Fixed height to match image
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    border: '1px solid #444',
    borderRadius: '40px',
    pointerEvents: 'none',
  },
  '& h2': {
    fontFamily: '"Bebas Neue", cursive',
    fontSize: '3.5rem',
    letterSpacing: '2px',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
    position: 'relative',
    '&::after': {
      content: '""',
      display: 'block',
      width: '60px',
      height: '3px',
      background: '#FFD700',
      marginTop: '1rem',
    }
  },
  '& p': {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
    color: '#e0e0e0',
    position: 'relative',
  },
  '@media (max-width: 1200px)': {
    '& h2': {
      fontSize: '3rem',
    },
  },
  '@media (max-width: 992px)': {
    textAlign: 'center',
    maxWidth: '100%',
    '& h2': {
      fontSize: '2.5rem',
    },
    '&::after': {
      left: '50%',
      transform: 'translateX(-50%)',
    }
  },
});

const ImageLeftSection = ({ children, imageSrc, imageAlt }) => {
  return (
    <SectionContainer>
      <ImageContainer>
        <img 
          src={imageSrc} 
          alt={imageAlt}
          loading="lazy"
        />
      </ImageContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </SectionContainer>
  );
};

export default ImageLeftSection;
