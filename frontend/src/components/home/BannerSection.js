import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const BannerSection = () => {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
        my: 6
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true }}
        style={{ height: '100%' }}
      >
        <Box
          component="img"
          src="/images/homepage-images/How-Does-It-Work.jpg"
          alt="Ocontest Banner"
          sx={{
            width: '100%',
            height: '600px',
            objectFit: 'cover',
            filter: 'brightness(0.8)',
          }}
        />
      </motion.div>
    </Box>
  );
};

export default BannerSection;
