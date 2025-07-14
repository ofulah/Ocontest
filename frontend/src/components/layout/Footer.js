import React from 'react';
import { Box, Container, Typography, Link, IconButton, Stack } from '@mui/material';
import footerLogo from '../../assets/images/ohh-contest.png';
import { Link as RouterLink } from 'react-router-dom';
// Social media icon paths
const socialIcons = {
  instagram: '/images/homepage-images/icons/instagram.png',
  youtube: '/images/homepage-images/icons/youtube.png',
  facebook: '/images/homepage-images/icons/facebook.png',
  discord: '/images/homepage-images/icons/discord.png',
  tiktok: '/images/homepage-images/icons/tiktok.png'
};

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      bgcolor: '#000', 
      color: 'white', 
      py: 6,
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          {/* Left Section - Navigation Links */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Link 
              component={RouterLink} 
              to="/privacy-policy" 
              color="inherit" 
              underline="none"
              sx={{ 
                '&:hover': { color: 'primary.main' },
                fontWeight: 1000,
                whiteSpace: 'nowrap',
                letterSpacing: '0.1em',
                fontSize: '1rem'
              }}
            >
              Privacy Policy            
            </Link>            
            <Box sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</Box>
            <Link 
              component={RouterLink} 
              to="/contact" 
              color="inherit" 
              underline="none"
              sx={{ 
                '&:hover': { color: 'primary.main' },
                fontWeight: 1000,
                whiteSpace: 'nowrap',
                letterSpacing: '0.1em',
                fontSize: '1rem'
              }}
            >
              Contact us
            </Link>
          </Stack>
          
          {/* Center Section - Logo */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            my: { xs: 2, md: 0 }
          }}>
            <Box 
              sx={{ 
                p: 1,
                mb: 1,
              }}
            >
              <Box 
                component="img"
                src={footerLogo}
                alt="OHHH! CONTEST"
                sx={{ 
                  height: 'auto',
                  width: { xs: '180px', md: '240px' },
                  display: 'block',
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Box>
          
          {/* Right Section - Social Media */}
          <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-end' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 1000, mr: 1, letterSpacing: '0.1em', fontSize: '1rem' }}>
                Connect With Us:
              </Typography>
              {Object.entries({
            instagram: 'https://instagram.com',
            youtube: 'https://youtube.com',
            facebook: 'https://facebook.com',
            discord: 'https://discord.com',
            tiktok: 'https://tiktok.com'
          }).map(([platform, url]) => (
            <IconButton 
              key={platform}
              href={url}
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                padding: 1,
                '&:hover': { 
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <img 
                src={socialIcons[platform]} 
                alt={`${platform} icon`}
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="rgba(255, 255, 255, 0.7)" 
          align="center"
          sx={{ 
            mt: 4, 
            pt: 4, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
          }}
        >
          OCONTEST © 2025. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
