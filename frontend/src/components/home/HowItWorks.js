import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const HowItWorks = () => {
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
       
        {/* Step 1: Application */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          direction="row"
          sx={{
            flexWrap: 'nowrap',
            mb: 12,
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
                src="/images/homepage-images/application.jpg"
                alt="Application Process"
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
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  textAlign: 'justify'
                }}
              >
                The OCONTEST team partners with brands eager to try innovative contests through our OContest platform. We select the product, creative direction, concept, style, and challenge. Once the contest is launched, we preselect participants, jump on a call with you to explain everything clearly, and then once you’re officially selected, a detailed contest brief will be sent to you via email and SMS.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        {/* Step 2: Review */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          direction="row"
          sx={{
            flexWrap: 'nowrap',
            mb: 12,
            '@media (max-width: 900px)': {
              flexWrap: 'wrap'
            }
          }}
        >
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  textAlign: 'justify'
                }}
              >
                Once your video is color graded, professionally edited, and ready to go, you simply submit your video through the OContest platform. All submissions will be reviewed by both the OCONTEST team and the brand's marketing team to determine the winner.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="/images/homepage-images/review.jpg"
                alt="Review Process"
                sx={{
                  width: '100%',
                  maxWidth: '2000px',
                  height: 'auto',
                  maxHeight: '1000px',
                  objectFit: 'contain',
                  borderRadius: 3,
                  display: 'block',
                  margin: '0 auto',
                  boxShadow: (theme) => `0 20px 40px ${theme.palette.common.black}25`
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Step 3: Reward */}
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
                src="/images/homepage-images/reward.jpg"
                alt="Reward Process"
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
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  textAlign: 'justify'
                }}
              >
                OContest goes beyond just being a platform. We provide ongoing opportunities for videographers, connecting them with brands that value creative collaboration. Winners receive trophies, cash prizes, extensive exposure through brand-driven campaigns, and valuable recognition within our vibrant community.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;