import React, { useRef } from 'react';
import { Box, styled } from '@mui/material';

const BrandCarouselContainer = styled(Box)({
  width: '100%',
  overflow: 'hidden',
  backgroundColor: '#000',
  padding: '2rem 0',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100px',
    zIndex: 2,
    pointerEvents: 'none',
  },
  '&::before': {
    left: 0,
    background: 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 100%)',
  },
  '&::after': {
    right: 0,
    background: 'linear-gradient(270deg, #000 0%, rgba(0,0,0,0) 100%)',
  },
});

const Track = styled(Box)({
  display: 'flex',
  gap: '4rem',
  padding: '0rem 0',
  animation: 'scroll 30s linear infinite',
  '&:hover': {
    animationPlayState: 'paused',
  },
  '@keyframes scroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(calc(-250px * 9))',
    },
  },
});

const BrandLogo = styled('img')({
  height: '150px',
  width: 'auto',
  objectFit: 'contain',
  filter: 'grayscale(100%) brightness(2)',
  opacity: 0.8,
  transition: 'all 0.3s ease',
  '&:hover': {
    filter: 'grayscale(0) brightness(1)',
    opacity: 1,
    transform: 'scale(1.1)',
  },
  '@media (max-width: 768px)': {
    height: '80px',
    opacity: 0.9, // Slightly more visible on mobile
  },
  // Disable hover effects on touch devices
  '@media (hover: none)': {
    '&:hover': {
      filter: 'grayscale(100%) brightness(2)',
      opacity: 0.9,
      transform: 'none',
    },
  },
});
const BrandCarousel = () => {
  const trackRef = useRef(null);
  const brandLogos = [
    'black-fire.png',
    'hbada.png',
    'hi-spec.png',
    'hikvision.png',
    'jackery.png',
    'maison-backrayds.png',
    'samsung.png',
    'toshiba.png',
    'wolf-box.png',
  ];

  // Duplicate the array to create a seamless loop
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  return (
    <BrandCarouselContainer>
      <Track ref={trackRef}>
        {duplicatedLogos.map((logo, index) => (
          <Box key={`${logo}-${index}`} sx={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrandLogo 
              src={`/images/homepage-images/brands-worked-us/${logo}`} 
              alt={logo.replace('.png', '').replace(/-/g, ' ').toUpperCase()}
              loading="lazy"
            />
          </Box>
        ))}
      </Track>
    </BrandCarouselContainer>
  );
};

export default BrandCarousel;

