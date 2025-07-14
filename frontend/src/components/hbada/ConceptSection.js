import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

/**
 * Reusable section consisting of:
 * 1. Full-width hero background image with optional title + subtitle overlay (top-right).
 * 2. Black info block underneath with pill-style heading and rich text.
 *
 * Props:
 * - image: path to hero background (relative to public folder)
 * - title: big heading shown on hero (optional)
 * - subtitle: subheading on hero (optional)
 * - infoHeading: pill heading text
 * - paragraphs: array of paragraph strings
 */

const Hero = styled(Box)(({ image }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '60vh',
  background: `url(${image}) center/cover no-repeat`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 5%',
}));

const ConceptSection = ({ image, title, subtitle, infoHeading, paragraphs }) => (
  <Box>
    {/* Hero banner */}
    <Hero image={image}>
      <Box textAlign="right" sx={{ color: '#fff' }}>
        {title && (
          <Typography variant="h2" sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '2.8rem', md: '4.5rem' }, fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Hero>

    {/* Info block */}
    <Box sx={{ backgroundColor: '#000', px: '5%', py: { xs: 4, md: 6 } }}>
      {infoHeading && (
        <Typography variant="h5" sx={{ fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', borderRadius: '40px', display: 'inline-block', px: 3, py: 1, mb: 3 }}>
          {infoHeading}
        </Typography>
      )}
      {paragraphs &&
        paragraphs.map((p, idx) => (
          <Typography key={idx} sx={{ mb: 2, lineHeight: 1.8 }}>
            {p}
          </Typography>
        ))}
    </Box>
  </Box>
);

export default ConceptSection;
