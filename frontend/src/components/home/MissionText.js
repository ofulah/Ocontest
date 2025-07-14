import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MissionText = () => {
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
                  mb: 4
                }}
              >
                It's challenging to maintain a global community of creatives and gather them in one place. Therefore, our goal is to continually expand, creating spaces for creative minds worldwide to collaborate, inspire each other, and help shape the future of media. This is OCHO MEDIA.
              </Typography>              
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MissionText;
