import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import ConceptSection from '../components/hbada/ConceptSection';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// NOTE: We keep the image in public so it works even before being migrated to assets.
const bannerSrc = process.env.PUBLIC_URL + '/images/hbadaMedia/Hbada-banner.jpg';

const BannerWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '80vh',
  background: `url(${bannerSrc}) center/cover no-repeat`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0 5%',
  [theme.breakpoints.down('md')]: {
    minHeight: '70vh',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

const Tagline = styled(Typography)(({ theme }) => ({
  fontFamily: '"Bebas Neue", sans-serif',
  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
  fontWeight: 700,
  color: '#ffffff',
  lineHeight: 1,
}));

const SubTagline = styled(Typography)(() => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  color: '#ffffff',
  marginTop: '0.5rem',
}));

// BottomBar component removed

const HbadaSynergy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Function to handle authentication check for Apply button
  const handleApplyClick = (e) => {
    e.preventDefault();
    if (user) {
      // User is logged in, redirect to application page
      navigate('/contests/4/apply');
    } else {
      // User is not logged in, show message and redirect to login page
      setSnackbarMessage('Please log in to apply for this contest');
      setSnackbarOpen(true);
      // Delay navigation to allow user to see the message
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    }
  };
  
  // Function to handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const products = [
    { name: 'E3 PRO', img: '/images/hbadaMedia/products/E3.jpg', status: 'Available' },
    { name: 'X7 SMART', img: '/images/hbadaMedia/products/x7.jpg', status: 'All Picked!' },
    { name: 'P2 ERGONOMIC', img: '/images/hbadaMedia/products/p2.jpg', status: 'Available' },
  ];
  return (
    <Box>
      {/* Hero Banner */}
      <BannerWrapper>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
        {/* Bottom Info Bar removed */}
      </BannerWrapper>



      {/* Secondary Banner Section */}
      <Box component="img"
           src={process.env.PUBLIC_URL + '/images/hbadaMedia/banners/ohhh-contest.jpg'}
           alt="OHhh Contest banner"
           sx={{ width: '100%', display: 'block', mt: { xs: 4, md: 6 } }}
      />

      {/* About & How It Works Section */}
      <Box sx={{ px: '5%', py: { xs: 4, md: 8 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 6, md: 4 } }}>

          {/* Left Column */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', borderRadius: '40px', display: 'inline-block', px: 3, py: 1, mb: 2 }}>
              What Is Ocontest?
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
              Ocontest is created by people just like you, creative minds who decided to build something exceptional. It's a platform designed to connect creators, foster mutual opportunities, and help you compete in exciting contests to partner with leading brands. Based in China, with an additional office in Singapore, we're part of the OHHH! Worldwide brand.
            </Typography>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', borderRadius: '40px', display: 'inline-block', px: 3, py: 1, mb: 2 }}>
              How Does it Work?
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
              We actively seek out and secure brand sponsorships, then notify our talented community whenever a new contest becomes available. You simply apply, and if selected, you receive a premium product absolutely free to create content without limitations. <br /><br />
              Speed is crucial! Brands are eager to see your innovative videos. Once all submissions are received, we'll review them to determine the winners.
            </Typography>
          </Box>

        </Box>
      </Box>
      {/* Brand Banner */}
      <Box component="img"
           src={process.env.PUBLIC_URL + '/images/hbadaMedia/banners/hbada.jpg'}
           alt="Hbada brand banner"
           sx={{ width: '100%', display: 'block' }}
      />

      {/* Brand Introduction Section */}
      <Box sx={{ px: '5%', py: { xs: 4, md: 6 }, backgroundColor: '#000' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', borderRadius: '40px', display: 'inline-block', px: 3, py: 1, mb: 3 }}>
          Brand introduction
        </Typography>
        <Typography sx={{ lineHeight: 1.8 }}>
          HBADA is where comfort, design, and wellness converge. Founded in 2008, the brand has earned a global reputation for crafting ergonomic furniture that supports healthier lifestyles without compromising aesthetics. With a deep commitment to technological innovation and user well-being, HBADA’s products are designed to adapt to the body’s natural posture, ensuring long-term comfort and support. From breathable materials to precision adjustability, every detail reflects HBADA’s mission to enhance the everyday experience through functional elegance. Explore more at HBADA Official Website.
        </Typography>
      </Box>

      {/* Products In Contest Heading */}
      <Box sx={{ backgroundColor: '#000', py: { xs: 4, md: 6 } }}>
        <Box sx={{ border: '3px solid #fff', borderRadius: '80px', maxWidth: '95%', mx: 'auto', px: 3, py: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
            Products In Contest
          </Typography>
        </Box>
      </Box>

      {/* Products Cards */}
      <Box sx={{ backgroundColor: '#000', px: '5%', pb: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 6, md: 4 }, justifyContent: 'space-between' }}>
          {products.map((prod) => (
            <Box key={prod.name} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.1rem', letterSpacing: 1, mb: 2 }}>
                {prod.name}
              </Typography>

              <Box sx={{ backgroundColor: '#111', borderRadius: '20px', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: { xs: 300, md: 380 } }}>
                <img src={process.env.PUBLIC_URL + prod.img} alt={prod.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ border: '2px solid #fff', borderRadius: '20px', display: 'inline-block', px: 6, py: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{prod.status}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: '#000', px: '5%', py: { xs: 4, md: 6 }, mt: { xs: 4, md: -2 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {[
            {
              title: 'E3 Pro Features',
              features: [
                'High Elasticity Cushion',
                '3-Zone Lumbar Support',
                '4D Adjustable Headrest',
                'Multi-scenario Ready',
                'Custom-fit Adjustability',
              ],
            },
            {
              title: 'X7 Smart Features',
              features: [
                'Therapeutic Massage',
                'Cooling Cloud Seat',
                'Adjustable Headrest',
                '140° Recline',
                'Auto-Adaptive Lumbar',
              ],
            },
            {
              title: 'P2 Features',
              features: [
                '3D Lumbar Support',
                '360° 3D Armrests',
                'Ergonomic mesh',
                'Curved Neck Pillow',
                'Integrated Foot rest',
              ],
            },
          ].map((col, idx) => (
            <Box key={col.title} sx={{ flex: 1, borderRight: { md: idx < 2 ? '1px solid #333' : 'none' }, px: { xs: 0, md: 3 }, mb: { xs: 6, md: 0 } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
                {col.title}
              </Typography>
              {col.features.map((feat) => (
                <Box key={feat} sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ border: '2px solid #fff', borderRadius: '30px', px: 2.5, py: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography sx={{ flex: 1 }}>{feat}</Typography>
                    <Typography sx={{ fontWeight: 700, ml: 1 }}>✔︎</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>


      {/* Synergy Concept Section */}
      <ConceptSection
        image={process.env.PUBLIC_URL + '/images/hbadaMedia/synergy.jpg'}
        title="Synergy"
        subtitle="Self-love is your energy"
        infoHeading="Introduction to the Concept"
        paragraphs={[
          'Synergy is the reflection of what happens when you align with your space, your rhythm, your purpose. Synergy is the art of harmony between self-love and the tools that support you.',
          'With the fluid calm of X7 Zen, the adaptive power of E3 Zone, and the focused drive of P2 Zoom, you’re not just sitting, you’re creating from a place of balance.',
          'Let your energy speak. Create from your center. Show us your synergy.',
        ]}
      />

      {/* X7 Zen Section */}
      <ConceptSection
        image={process.env.PUBLIC_URL + '/images/hbadaMedia/banners/x7.jpg'}
        title="X7 is Zen"
        infoHeading="ZEN from our perspective"
        paragraphs={[
          'X7 is Zen: Imagine finding tranquility in creativity. As we write this brief, we are on the balcony of our Airbnb looking at the stunning Copacabana Hotel in Pattaya, Thailand.',
          'Envisioning something even more magnificent, an empowered community-driven movement. This represents Zen for us: unlocking creativity, inspiring one another, evolving together, and experiencing deep satisfaction and pride.',
          'Picture yourself effortlessly connecting with fellow creators from across the globe, from Europe, USA, or even in the Moroccan Sahara, embodying serenity and creative freedom.',
          "Now, it's your turn to show us how Zen are you with the X7 chair?",
        ]}
      />

      {/* E3 Zone Section */}
      <ConceptSection
        image={process.env.PUBLIC_URL + '/images/hbadaMedia/sections/e3.jpg'}
        title="E3 is Zone"
        infoHeading="ZONE from our perspective"
        paragraphs={[
          'E3 is Zone: Before officially launching Ocontest, we tested this format of competition with another brand "Sunaofe". It was challenging, endless hours spent navigating corporate bureaucracy and battling creative stagnation.',
          'Yet, in such environments, people often blend their professional and personal lives seamlessly, creating their "zone." But they forget that there is an infinite amount of zones, good ones and bad ones, from inspiring ones to energy draining ones. So, what zone do you belong to, or should we say, which zone are you creating?',
          'For us Ocontest is the zone we want to be in and occupy. Which zone are you going to choose to highlight the E3 chair?',
        ]}
      />

      {/* P2 Zoom Section */}
      <ConceptSection
        image={process.env.PUBLIC_URL + '/images/hbadaMedia/sections/p2.jpg'}
        title="P2 is Zoom"
        infoHeading="ZOOM from our perspective"
        paragraphs={[
          "P2 is Zoom: Now it's been 2 hours since we're still working passionately to finish this brief at the same balcony, and the same view, to perfect this experience for you.",
          "It's more than just content creation, it's about relentless dedication, attention to detail, and visionary thinking. As we zoom in on every aspect of building this platform, every detail needed to create something powerful that will potentially change the world.",
          'Remember that behind every successful contest are countless sleepless nights filled with joy, vision, and commitment.',
          "This is how we see zoom, it's passion, love, and vision. How do you zoom in? Are you ready to zoom in with us through the P2 chair? Let's create greatness together!",
        ]}
      />

      {/* Contest Guidelines Section */}
      <ConceptSection
        image={process.env.PUBLIC_URL + '/images/hbadaMedia/sections/CONTEST-GUIDELINES.jpg'}
        title="Contest Guidelines"
        infoHeading="Guidelines"
        paragraphs={[
          'Your video must serve as a cinematic call-to-action ad that reflects HBADA’s brand philosophy that supports real lives with aesthetic intelligence and ergonomic precision.',
          'Each participant must choose one HBADA chair: X7, E3, or P2. Each tied to a core concept (Zen, Zone, Zoom) and distinct user experience.',
          'Your task is to visually interpret the concept, you can get inspired with the situations we provided or come up with your own as long as it matches the chair’s concept, and embed the chair’s unique selling points naturally into your storytelling.',
        ]}
      />

      {/* The Challenge Section */}
      <Box sx={{ backgroundColor: '#000', px: '5%', py: { xs: 6, md: 8 } }}>
        <Typography variant="h5" sx={{ fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', borderRadius: '40px', display: 'inline-block', px: 3, py: 1, mb: 3 }}>
          The Challenge
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
          We know that shooting in 9:16 can sometimes feel like a creative constraint, especially for cinematic storytellers. It compresses your vision, flattens your frame, and can make it hard to express depth and movement.
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
          That’s why we’re flipping the challenge.
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
          In this contest, your video should be 9:16, but divided into three horizontal panels stacked on top of each other—a vertical triptych. This split-screen format invites you to think in layers: play with time, space, and story. You can show the same scene from different angles, pause one panel while the others move, or sync and desync motion to reflect synergy, duality, or contrast. These are just suggestions—don’t be afraid to break the pattern. Use the format as a tool to push your creativity and storytelling.
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
          Yes, you’re free to shoot horizontally and re-frame it into this stacked format. But if at any point you feel that a full-screen 9:16 moment helps build a stronger narrative or better highlights product features, you can use it—just keep it minimal. Think of it as a strategic break, not the default.
        </Typography>
        <Typography sx={{ lineHeight: 1.8 }}>
          The goal is simple: challenge yourself, elevate the story, and make your vision unforgettable within and beyond the frame. (Do not forget to send a 16:9 version as it increases your chances of winning)
        </Typography>
      </Box>

      {/* Format Section */}
      <Box sx={{ backgroundColor: '#000', px: '5%', py: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', gap: { xs: 4, md: 6 } }}>
          {/* Text Column */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', borderRadius: '40px', display: 'inline-block', px: 3, py: 1, mb: 3 }}>
              Format
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0, lineHeight: 1.8 }}>
              {[
                'Good Hook (Visual, Sound, or text...)',
                'Video duration: 1–3 minutes.',
                'Format: 9:16 vertical, cinematic split-screen.',
                'Additional 16:9 version increases your chance of winning.',
                'Product must be visibly used and featured.',
                'Key selling points of selected chair must be demonstrated.',
                'The core focus is cinematic call-to-action ad.',
                'Language: English.',
              ].map((item) => (
                <Typography component="li" key={item} sx={{ mb: 1 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Images Column */}
          <Box sx={{ flex: '0 0 300px', maxWidth: 300, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            {[1, 2].map((i) => (
              <Box
                key={i}
                component="img"
                src={process.env.PUBLIC_URL + '/images/hbadaMedia/1.jpg'}
                alt={`format-example-${i}`}
                sx={{ width: '50%', height: 'auto', borderRadius: 2, objectFit: 'cover' }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box>
        <Box
          component="img"
          src={process.env.PUBLIC_URL + '/images/hbadaMedia/what.jpg'}
          alt="What are you waiting for?"
          sx={{ width: '100%', display: 'block' }}
        />
        <Box sx={{ backgroundColor: '#000', py: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            sx={{
              color: '#000',
              backgroundColor: '#fff',
              borderColor: '#fff',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': { backgroundColor: '#f0f0f0', borderColor: '#fff' },
            }}
            onClick={() => {
              if (!user) {
                setSnackbarMessage('Please log in to apply for this contest');
                setSnackbarOpen(true);
                // Delay navigation to allow user to see the message
                setTimeout(() => {
                  navigate('/login');
                }, 3000);
              } else {
                navigate('/contests/4/apply');
              }
            }}
          >
            Create an account
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#00924A',
              color: '#fff',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': { backgroundColor: '#007a3d' },
            }}
            onClick={handleApplyClick}
          >
            Apply to Compete
          </Button>
        </Box>
      </Box>
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%', bgcolor: '#d32f2f' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HbadaSynergy;
