import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  VideoCameraBack,
  EmojiEvents,
  MonetizationOn,
  Groups,
  Star,
  WorkspacePremium
} from '@mui/icons-material';

const steps = [
  {
    title: 'Create Your Profile',
    description: 'Sign up and showcase your creative portfolio. Build your reputation in the community.',
    icon: <Groups fontSize="large" />,
    color: '#FF6B6B'
  },
  {
    title: 'Browse Videos',
    description: 'Explore exciting videos from creators and participate in video contests.',
    icon: <VideoCameraBack fontSize="large" />,
    color: '#4ECDC4'
  },
  {
    title: 'Submit Your Work',
    description: 'Create and upload your unique video content following contest guidelines.',
    icon: <Star fontSize="large" />,
    color: '#45B7D1'
  },
  {
    title: 'Get Recognized',
    description: 'Stand out with your creativity and win recognition from industry leaders.',
    icon: <EmojiEvents fontSize="large" />,
    color: '#96CEB4'
  },
  {
    title: 'Win Prizes',
    description: 'Earn rewards and cash prizes for your winning submissions.',
    icon: <MonetizationOn fontSize="large" />,
    color: '#FFD93D'
  },
  {
    title: 'Grow Your Career',
    description: 'Build your professional network and advance your creative career.',
    icon: <WorkspacePremium fontSize="large" />,
    color: '#6C5CE7'
  }
];

const HowItWorks = () => {
  return (
    <Box sx={{ background: '#0d0d0d', py: { xs: 10, md: 16 }, color: 'white' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, letterSpacing: '0.1em' }}>
            How It Works
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            From sign-up to recognition, follow the journey that turns your creativity into opportunity.
          </Typography>
        </Box>

        {/* Timeline */}
        <Box sx={{ position: 'relative', pl: 3, borderLeft: '3px solid rgba(255,255,255,0.1)' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 6, position: 'relative' }}>
                {/* Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '-30px',
                    top: 2,
                    backgroundColor: step.color,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 12px ${step.color}55`
                  }}
                >
                  {step.icon}
                </Box>

                {/* Content */}
                <Box pl={6}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* CTA */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          textAlign="center"
          mt={12}
          px={4}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Start Your Creative Journey Today
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Sign up and bring your ideas to life through video. The world is watching.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
