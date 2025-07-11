import React from 'react';
import { Box } from '@mui/material';
import LibraryBanner from '../components/library/LibraryBanner';
import SideMenu from '../components/library/SideMenu';
import LibrarySections from '../components/library/LibrarySections';
import CashBanner from '../components/library/CashBanner';
import LowerLibSection from '../components/library/LowerLibSection';

const Library2 = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      backgroundColor: 'black' // Fallback color
    }}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/library/back.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <SideMenu sx={{ position: 'relative', zIndex: 1 }} />
      <Box sx={{
        flexGrow: 1,
        ml: { xs: '64px', md: '170px' },
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <LibraryBanner />
        <LibrarySections />
        <Box sx={{ 
          px: { xs: 2, md: 4 },
          mt: -2 // Negative margin to pull the banner up
        }}>
          <CashBanner />
          <LowerLibSection />
        </Box>
      </Box>
    </Box>
  );
};

// This tells the app to render this page without the Layout wrapper
Library2.noLayout = true;

export default Library2;
