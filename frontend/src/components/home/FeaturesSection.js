import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: 12,
        bgcolor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Container>
        <Grid 
          container 
          spacing={6} 
          alignItems="center" 
          direction="row"
          sx={{
            flexWrap: 'nowrap',
            '@media (max-width: 900px)': {
              flexWrap: 'wrap'
            }
          }}
        >
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="/images/homepage-images/ohh-contest.png"
                alt="Ocontest Platform"
                sx={{
                  width: '100%',
                  maxWidth: '4000px',
                  height: 'auto',
                  maxHeight: '3000px',
                  objectFit: 'contain',
                  borderRadius: 3,
                  display: 'block',
                  margin: '0 auto',
                  boxShadow: (theme) => `0 20px 40px ${theme.palette.common.black}25`
                }}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                What is Ohhh! Contest?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.secondary',
                  mb: 2
                }}
              >
                Ohhh! Contest, OContest, or Ocho Contest, is a creative space where we find and negotiate with brands to run contests through us. We decide the concept for each contest, which could range from specific disciplines to montage styles, split screens, or anything else, but all videos must be cinematic ads. Brands are searching for the best talent who can express their voice through a camera lens, challenging themselves among competitors to win trophies and cash prizes.
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.secondary'
                }}
              >
                Whether you're a brand seeking fresh, engaging video content or a creator looking to showcase your talent, Ohhh! Contest provides the perfect platform to connect, create, and succeed in the world of video content creation.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
