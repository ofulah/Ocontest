import React from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

const WhatWeStandtext = () => {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: 6,
        bgcolor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={6} 
          justifyContent="center"
          alignItems="center" 
          sx={{
            '@media (max-width: 900px)': {
              textAlign: 'center'
            }
          }}
        >
          <Grid item xs={12} md={10} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.secondary',
                  mb: 3
                }}
              >
                Ocontest is a revolutionary video contest platform that connects creative video makers with brands looking for unique content. Our platform makes it easy for brands to launch video contests and discover talented creators, while providing creators with opportunities to showcase their skills and win rewards.
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.secondary',
                  mb: 3
                }}
              >
                Whether you're a brand seeking fresh, engaging video content or a creator looking to showcase your talent, Ocontest provides the perfect platform to connect, create, and succeed in the world of video content creation.
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.secondary',
                  mb: 3
                }}
              >
                We stand for genuine connection, both from the brand's perspective and within the OHHH! Community. Our objective is to ensure ongoing contests on the platform, giving you numerous opportunities to participate, win awards, and earn money. Brands, in turn, can discover new talent for future collaborations.
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.secondary',
                  mb: 4
                }}
              >
                The most meaningful connection we stand for is the one built among our community members through our platform and OCommunity Discord server. This allows you to network and collaborate with other creators globally or locally, providing a supportive space where you can relax after an exhausting day of shooting and engage with others who truly understand your creative struggles and experiences.
              </Typography>
              <Box
                sx={{
                  mt: 6,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  gap: { xs: 3, sm: 4 },
                  width: '100%'
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="https://discord.gg/hDhkACxu"
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth={false}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 2,
                    px: { xs: 3, md: 6 },
                    py: 2,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                    minWidth: { xs: '100%', sm: '220px' },
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'white',
                      color: 'black'
                    }
                  }}
                >
                  Join OHHH! Discord Community
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="/signup"
                  fullWidth={false}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 2,
                    px: { xs: 3, md: 6 },
                    py: 2,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                    minWidth: { xs: '100%', sm: '220px' },
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'white',
                      color: 'black'
                    }
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WhatWeStandtext;
