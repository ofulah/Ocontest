import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Stack, Button, CircularProgress, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import api from '../services/api';


/**
 * ContestDetails01 Page
 * This page renders the contest details for "HBADA – Synergy".
 * The first component is a full-width banner at the top.
 *
 * Banner image source (placed in public):
 *   /images/contest-details01/Hbada-banner.jpg
 */

const ContestDetails = () => {
  const [products, setProducts] = useState([
    { name: 'E3 PRO', status: 'Loading...' },
    { name: 'X7 SMART', status: 'Loading...' },
    { name: 'P2 ERGONOMIC', status: 'Loading...' }
  ]);
  const [loading, setLoading] = useState(true);
  const [expandedFeature, setExpandedFeature] = useState(null);

  useEffect(() => {
    const fetchProductStatuses = async () => {
      try {
        // Fetch products for the specific brand (using brand_id 4)
        // Note: No leading slash since baseURL is already set in axios config
        const response = await api.get('brands/4/products/');
        if (response.data && Array.isArray(response.data)) {
          const updatedProducts = products.map(product => {
            // Find matching product by name (case-insensitive)
            const productData = response.data.find(p => 
              p.name && p.name.toUpperCase() === product.name.toUpperCase()
            );
            return {
              ...product,
              status: productData ? 
                (productData.status === 'available' ? 'Available' : 'All Picked!') : 
                'Status Unavailable'
            };
          });
          setProducts(updatedProducts);
        }
      } catch (error) {
        console.error('Error fetching product statuses:', error);
        // Fallback to default statuses if API fails
        setProducts([
          { name: 'E3 PRO', status: 'Available' },
          { name: 'X7 SMART', status: 'All Picked!' },
          { name: 'P2 ERGONOMIC', status: 'Available' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductStatuses();
  }, [products]);
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Top Banner */}
      <Box
        component="img"
        src="/images/contest-details01/Hbada-banner.jpg"
        alt="HBADA Contest Banner"
        sx={{
          width: '100%',
          height: { xs: 220, sm: 320, md: 480 },
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {/* Contest Info Bar */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          px: 2,
          py: 3,
        }}
      >
        <Grid container alignItems="center" spacing={2} sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
          {/* Left: Brand & socials */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '4rem' } }}>
                HBADA
              </Typography>
              <Stack direction="row" spacing={1}>
                <LanguageIcon fontSize="medium" />
                <InstagramIcon fontSize="medium" />
                <MusicNoteIcon fontSize="medium" />
                <YouTubeIcon fontSize="medium" />
              </Stack>
            </Stack>
          </Grid>

          {/* Middle: Deadline */}
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="subtitle1" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>Deadline: 01-08-2025</Typography>
          </Grid>

          {/* Right: Slogan */}
          <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '4.5rem' }}}>
              Synergy
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: { xs: '1rem', md: '1.5rem' }}}>
              Self-love is your energy
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Ocontest Banner */}
      <Box
        component="img"
        src="/images/contest-details01/banners/ohhh-contest.jpg"
        alt="Ocontest banner"
        sx={{
          width: '100%',
          height: { xs: 220, md: 320 },
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Ocontest Intro Section */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          pt: { xs: 6, md: 10 },
          pb: 0,
          px: 2,
        }}
      >
        {/* Content */}
        <Box sx={{ position: 'relative', maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>

          <Grid container spacing={4}>
            {/* What is Ocontest */}
            <Grid item xs={12} md={6} sx={{ 
              pr: { md: 4 }, 
              position: 'relative',
              mb: { xs: 4, md: 0 },
              '&:before': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: -47,        // Start at the top of this section
                bottom: 0,     // Extend to the bottom of this section
                width: '1px',
                backgroundColor: '#fff',
                display: { xs: 'none', md: 'block' },
                zIndex: 1
              }
            }}>
              <Box
                sx={{
                  border: '2px solid #fff',
                  borderRadius: 4,
                  px: 3,
                  py: 1,
                  display: 'inline-block',
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  What Is Ocontest?
                </Typography>
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  textAlign: 'justify'
                }}>
                {`Ocontest is created by people just like you, creative minds who decided to build something exceptional.
It's a platform designed to connect creators, foster mutual opportunities, and help you compete in exciting contests to partner with leading brands.
Based in China, with an additional office in Singapore, we're part of the OHHH! Worldwide brand.`}
              </Typography>
            </Grid>

            {/* How does it work */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: '2px solid #fff',
                  borderRadius: 4,
                  px: 3,
                  py: 1,
                  display: 'inline-block',
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  How Does it Work?
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 6, textAlign: 'justify' }}>
                {`We actively seek out and secure brand sponsorships, then notify our talented community whenever a new contest becomes available.
You simply apply, and if selected, you receive a premium product absolutely free to create content without limitations.
Speed is crucial! Brands are eager to see your innovative videos. Once all submissions are received, we'll review them to determine the winners.`}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Hbada Brand Banner */}
      <Box
        component="img"
        src="/images/contest-details01/banners/hbada.jpg"
        alt="HBADA Brand banner"
        sx={{
          width: '100%',
          height: { xs: 220, md: 320 },
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Brand Introduction */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          px: 2,
          pt: { xs: 6, md: 8 },
          pb: 0,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              border: '2px solid #fff',
              borderRadius: 4,
              px: 3,
              py: 1,
              display: 'inline-block',
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Brand introduction
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 6, textAlign: 'justify' }}>
            {`HBADA is where comfort, design, and wellness converge. Founded in 2008, the brand has earned a global reputation for crafting ergonomic furniture that supports healthier lifestyles without compromising aesthetics. With a deep commitment to technological innovation and user well-being, HBADA’s products are designed to adapt to the body’s natural posture, ensuring long-term comfort and support. From breathable materials to precision adjustability, every detail reflects HBADA’s mission to enhance the everyday experience through functional elegance. Explore more at HBADA Official Website.`}
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ width: '100%', height: '1px', bgcolor: '#fff' }} />

      {/* Products In Contest Heading */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            border: '2px solid #fff',
            borderRadius: '50px',
            px: { xs: 4, md: 8 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Products In Contest
          </Typography>
        </Box>
      </Box>

      {/* Products Grid */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          px: 2,
          pb: 0,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Grid container>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              products.map((item, idx) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={item.name}
                  sx={{
                    textAlign: 'center',
                    borderRight: idx < 2 ? '1px solid #fff' : 'none',
                    pb: { xs: 8, md: 10 }, // increased bottom padding to create spacing while keeping divider continuous
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {item.name}
                  </Typography>
                  <Box
                    component="img"
                    src={
                      item.name.includes('E3') 
                        ? "/images/contest-details01/products/e3.jpg"
                        : item.name.includes('X7')
                        ? "/images/contest-details01/products/x7.jpg"
                        : "/images/contest-details01/products/p2.jpg"
                    }
                    alt={item.name}
                    sx={{
                      width: '80%',
                      maxWidth: 260,
                      borderRadius: 2,
                      mb: 3,
                    }}
                  />
                  <Box
                    sx={{
                      display: 'inline-block',
                      border: '2px solid #fff',
                      borderRadius: '12px',
                      px: 4,
                      py: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>

      {/* Features Grid */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          px: 2,
          pb: 0,
          pt: 0, // keep divider alignment within section

        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Grid container>
            {[
              {
                title: 'E3 Pro Features',
                features: [
                  {
                    name: 'High Elasticity Cushion',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/e3high-elastisity.gif',
                    description: '16.5% breathable mesh is fully covered to realise superior comfort and durable support. nylon and yarn provide superior support'
                  },
                  {
                    name: 'Ergonomic Curve',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/e3ergonomic-curve.png',
                    description: 'Cradles the head to disperse pressure, reducing fatigue.'
                  },
                  {
                    name: '360° Swivel Arm Rest',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/e3Swivel-ArmRest.gif',
                    description: 'Rock-Steady Grip for Home/Office/Industrial Use'
                  },
                  {
                    name: '140° Comfortable Reclining',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/comfortable-recliningE3.png',
                    description: 'Just lean back and take a nap.Enjoy unparalleled comfort with the 140° reclining feature, allowing you to lean back and relax with ease.'
                  },
                  {
                    name: 'Auto gravity-sensing chassis',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/E3autogravity-sensing.png',
                    description: 'The Gravity-sensing Chassis office chair intuitively detects changes in the users weight and posture'
                  },
                ],
              },
              {
                title: 'X7 Smart Features',
                features: [
                  {
                    name: 'Therapeutic Massage',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/therapeutic-massage.gif',
                    description: 'Choose from three massage intensities to relax muscles, red light and graphene heating warm the entire lumbar area.'
                  },
                  {
                    name: 'Cooling Cloud Seat',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/cooling-cloud-seat.gif',
                    description: 'Dual-fan ventilated mesh seat with 3-speed airflow keeps you cool year-round.'
                  },
                  {
                    name: 'Adjustable Headrest',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/adjustable-headrest.gif',
                    description: 'Rotates, slides, lifts, and flips to support every neck angle.'
                  },
                  {
                    name: 'Lumbar Tracking',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/lumbar-trackingg.gif',
                    description: 'It senses your weight and adjusts to your lumbar curve—no manual input required. Ten adjustable intensity levels ensure precise tracking for every body type.'
                  },
                  {
                    name: 'Smart Posture Memory',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/memory.gif',
                    description: 'It recalls your last setting for automatic re-adjustment.'
                  },
                ],
              },
              {
                title: 'P2 Features',
                features: [
                  {
                    name: '3D Lumbar Support',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/P2lumbar-support.png',
                    description: 'Advanced 3D lumbar support system that moves with you, providing dynamic support that adapts to your sitting position.'
                  },
                  {
                    name: '360° 3D Armrests',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/p2armrest.png',
                    description: 'Fully adjustable armrests that move in three dimensions, allowing you to find the perfect position for your arms and shoulders.'
                  },
                  {
                    name: 'Ergonomic Mesh',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/P2ergonomic-mesh.png',
                    description: 'High-quality breathable mesh material that provides both support and ventilation, keeping you comfortable all day long.'
                  },
                  {
                    name: 'Curved Neck Pillow',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/P2curved-neck.png',
                    description: 'Anatomically designed neck pillow that cradles your head and neck, reducing strain and promoting proper alignment.'
                  },
                  {
                    name: 'Integrated Footrest',
                    type: 'dropdown',
                    image: '/images/contest-details01/Features/p2foot-rest.png',
                    description: 'Built-in retractable footrest for ultimate comfort during relaxation, with smooth extension and sturdy support.'
                  },
                ],
              },
            ].map((col, idx) => (
              <Grid
                item
                xs={12}
                md={4}
                key={col.title}
                sx={{
                  borderRight: idx < 2 ? '1px solid #fff' : 'none',
                  py: { xs: 3, md: 4 },
                  px: { md: 3 },
                }}
              >
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  textAlign: 'center',
                  mb: 3,
                  pb: 1,
                  borderBottom: '1px solid #fff'
                }}>
                  {col.title}
                </Typography>
                <Stack spacing={2}>
                  {col.features.map((feat, featIdx) => {
                    const isDropdown = typeof feat === 'object' && feat.type === 'dropdown';
                    const isExpanded = expandedFeature === `${col.title}-${featIdx}`;
                    
                    return (
                      <Box key={isDropdown ? feat.name : feat}>
                        <Box
                          onClick={() => isDropdown && setExpandedFeature(isExpanded ? null : `${col.title}-${featIdx}`)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '2px solid #fff',
                            borderRadius: '30px',
                            px: 3,
                            py: 1.5,
                            cursor: isDropdown ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            '&:hover': isDropdown ? {
                              transform: 'translateY(-2px)',
                            } : {},
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {isDropdown ? feat.name : feat}
                          </Typography>
                          {isDropdown && (
                            <IconButton
                              size="small"
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                                color: '#fff',
                                p: 0.5
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          )}
                        </Box>
                        
                        {isDropdown && (
                          <Collapse in={isExpanded} sx={{ mt: 1, pl: 2, pr: 1 }}>
                            <Box sx={{ 
                              p: 2,
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              bgcolor: 'rgba(255, 255, 255, 0.05)'
                            }}>
                              <Box
                                component="img"
                                src={feat.image}
                                alt={feat.name}
                                sx={{
                                  width: '100%',
                                  maxHeight: '200px',
                                  objectFit: 'contain',
                                  borderRadius: '8px',
                                  mb: 2,
                                }}
                              />
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {feat.description}
                              </Typography>
                            </Box>
                          </Collapse>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Details Grid */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          px: 2,
          pt: 0,
          pb: { xs: 10, md: 12 },
        }}
      >        
      </Box>

      {/* Synergy Concept Banner */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: "url('/images/contest-details01/banners/synergy.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 10, md: 17 },
          px: 2,
        }}
      >        
      </Box>

      {/* Concept Introduction */}
      <Box
        sx={{ bgcolor: '#000', color: '#fff', px: 2, pt: { xs: 6, md: 8 }, pb: { xs: 10, md: 12 } }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              border: '2px solid #fff',
              borderRadius: 4,
              px: 3,
              py: 1,
              display: 'inline-block',
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Introduction to the Concept
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Synergy is the reflection of what happens when you align with your space, your rhythm, your purpose. Synergy is the art of harmony between self-love and the tools that support you.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`With the fluid calm of X7 Zen, the adaptive power of E3 Zone, and the focused drive of P2 Zoom, you’re not just sitting, you’re creating from a place of balance.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Let your energy speak. Create from your center. Show us your synergy.`}
          </Typography>
        </Box>
      </Box>

      {/* X7 Zen Banner */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: "url('/images/contest-details01/banners/X7-is-zen.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 10, md: 24 },
          px: 2,
        }}
      >
        
      </Box>

      {/* Zen Perspective and Description */}
      <Box sx={{ bgcolor: '#000', color: '#fff', px: 2, pt: { xs: 6, md: 8 }, pb: { xs: 10, md: 12 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Pill heading */}
          <Box
            sx={{
              display: 'block',
              width: 'fit-content',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              position: 'relative',
              zIndex: 2,
              mt: { xs: -10, md: -11 },
              border: '2px solid #fff',
              borderRadius: '30px',
              px: 3,
              py: 1,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ZEN from our perspective
            </Typography>
          </Box>

          {/* Paragraphs */}
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`X7 is Zen: Imagine finding tranquility in creativity. As we write this brief, we are on the balcony of our Airbnb looking at the stunning Copacabana Hotel in Pattaya, Thailand.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Envisioning something even more magnificent, an empowered community-driven movement. This represents Zen for us: unlocking creativity, inspiring one another, evolving together, and experiencing deep satisfaction and pride.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Picture yourself effortlessly connecting with fellow creators from across the globe, from Europe, USA, or even in the Moroccan Sahara, embodying serenity and creative freedom.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', textAlign: 'justify'}}>
            {`Now, it's your turn to show us how Zen are you with the X7 chair?`}
          </Typography>
        </Box>
      </Box>

            {/* X7 Smart Carousel */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          pt: { xs: 6, md: 1 },
          pb: { xs: 8, md: 15 },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}
          >
            X7 SMART - ZEN INSPIRATION
          </Typography>
          
          {/* Carousel */}
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Left Arrow */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              onClick={() => {
                const carousel = document.getElementById('x7-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: -carousel.offsetWidth, behavior: 'smooth' });
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 24, height: 24, fill: '#fff' }}
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </Box>
            </Box>
            
            {/* Carousel Container */}
            <Box
              id="x7-carousel"
              sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                gap: 2,
                pb: 2,
              }}
            >
              {[
                { 
                  img: 'X7-Body.jpg', 
                  title: 'Body',
                  description: 'On their honeymoon, a man relaxes with a massage in the X7 Chair, feeling fully at peace.'
                },
                { 
                  img: 'X7-Breakfast.jpg', 
                  title: 'Breakfast',
                  description: 'Enjoying a peaceful breakfast in the comfort of the X7 Chair.'
                },
                { 
                  img: 'X7-Cool.jpg', 
                  title: 'Cool',
                  description: 'Staying cool and comfortable in the X7 Chair.'
                },
                { 
                  img: 'X7-Deaf.jpg', 
                  title: 'Deaf',
                  description: 'Experience tranquility with the X7 Chair.'
                },
                { 
                  img: 'X7-Horizon.jpg', 
                  title: 'Horizon',
                  description: 'Relax and gaze at the horizon from your X7 Chair.'
                },
                { 
                  img: 'X7-Support.jpg', 
                  title: 'Support',
                  description: 'Optimal support for ultimate relaxation in the X7 Chair.'
                },
                { 
                  img: 'X7-The-Marathon.jpg', 
                  title: 'The Marathon',
                  description: 'Endless comfort for your marathon relaxation sessions.'
                },
                { 
                  img: 'X7-The-TRip.jpg', 
                  title: 'The Trip',
                  description: 'The perfect companion for your relaxation journey.'
                },
                { 
                  img: 'X7-The-View.jpg', 
                  title: 'The View',
                  description: 'Enjoy breathtaking views from your X7 Chair.'
                },
                { 
                  img: 'X7-Windy-Fire.jpg', 
                  title: 'Windy Fire',
                  description: 'Stay cozy and comfortable in any weather with the X7 Chair.'
                },
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    minWidth: { xs: '85%', sm: '45%', md: '30%' },
                    scrollSnapAlign: 'start',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#000',
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/contest-details01/X7Carousel/${item.img}`}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: { xs: 200, sm: 250, md: 200 },
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {/* Right Arrow */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              onClick={() => {
                const carousel = document.getElementById('x7-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 24, height: 24, fill: '#fff' }}
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>        

      {/* E3 is zone Banner */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: "url('/images/contest-details01/banners/E3-is-zone.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 10, md: 17 },
          px: 2,
        }}
      >        
      </Box>

      {/* Zen Perspective and Description */}
      <Box sx={{ bgcolor: '#000', color: '#fff', px: 2, pt: { xs: 6, md: 8 }, pb: { xs: 10, md: 12 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Pill heading */}
          <Box
            sx={{
              display: 'block',
              width: 'fit-content',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              position: 'relative',
              zIndex: 2,
              mt: { xs: -10, md: -11 },
              border: '2px solid #fff',
              borderRadius: '30px',
              px: 3,
              py: 1,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ZEN from our perspective
            </Typography>
          </Box>

          {/* Paragraphs */}
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`X7 is Zen: Imagine finding tranquility in creativity. As we write this brief, we are on the balcony of our Airbnb looking at the stunning Copacabana Hotel in Pattaya, Thailand.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
            {`Envisioning something even more magnificent, an empowered community-driven movement. This represents Zen for us: unlocking creativity, inspiring one another, evolving together, and experiencing deep satisfaction and pride.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Picture yourself effortlessly connecting with fellow creators from across the globe, from Europe, USA, or even in the Moroccan Sahara, embodying serenity and creative freedom.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
            {`Now, it's your turn to show us how Zen are you with the X7 chair?`}
          </Typography>
        </Box>
      </Box>

      {/* E3 is zone Carousel */}            
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          pt: { xs: 6, md: 1 },
          pb: { xs: 8, md: 15 },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}
          >
            E3 SMART - ZEN INSPIRATION
          </Typography>
          
          {/* Carousel */}
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Left Arrow */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              onClick={() => {
                const carousel = document.getElementById('e3-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: -carousel.offsetWidth, behavior: 'smooth' });
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 24, height: 24, fill: '#fff' }}
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </Box>
            </Box>
            
            {/* Carousel Container */}
            <Box
              id="e3-carousel"
              sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                gap: 2,
                pb: 2,
              }}
            >
              {[
                { 
                  img: 'E3-Doctor.jpg', 
                  title: 'Medical Professional',
                  description: 'Ergonomic support for healthcare professionals during long shifts.'
                },
                { 
                  img: 'E3-Music-production.jpg', 
                  title: 'Music Producer',
                  description: 'Perfect posture for those long studio sessions producing music.'
                },
                { 
                  img: 'E3-Office.jpg', 
                  title: 'Office Worker',
                  description: 'Designed for all-day comfort in corporate environments.'
                },
                { 
                  img: 'E3-Programmer.jpg', 
                  title: 'Software Developer',
                  description: 'Optimal support for coders during marathon programming sessions.'
                },
                { 
                  img: 'E3-Streamer.jpg', 
                  title: 'Content Creator',
                  description: 'Stay comfortable during long streaming sessions.'
                },
                { 
                  img: 'E3-gaming-setup-room.jpg', 
                  title: 'Gaming Setup',
                  description: 'Enhance your gaming experience with proper ergonomic support.'
                },
                { 
                  img: 'E3-home-office.jpg', 
                  title: 'Home Office',
                  description: 'Professional comfort for your work-from-home setup.'
                },
                { 
                  img: 'E3-trader.jpg', 
                  title: 'Day Trader',
                  description: 'Stay focused and comfortable during market hours.'
                },
                { 
                  img: 'Grocery-Store.jpg', 
                  title: 'Retail Professional',
                  description: 'Ergonomic support for those long hours on the sales floor.'
                },
                { 
                  img: 'Dorm-Room.png', 
                  title: 'Student Life',
                  description: 'Essential support for students during study sessions.'
                }
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    minWidth: { xs: '85%', sm: '45%', md: '30%' },
                    scrollSnapAlign: 'start',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#000',
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/contest-details01/E3Carousel/${item.img}`}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: { xs: 200, sm: 250, md: 200 },
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {/* Right Arrow */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              onClick={() => {
                const carousel = document.getElementById('e3-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 24, height: 24, fill: '#fff' }}
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* P2 Banner */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: "url('/images/contest-details01/banners/p2-is-zoom.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 10, md: 20 },
          px: 2,
        }}
      >
        
      </Box>

      {/* Zen Perspective and Description - DUPLICATE 2 */}
      <Box sx={{ bgcolor: '#000', color: '#fff', px: 2, pt: { xs: 6, md: 8 }, pb: { xs: 10, md: 12 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Pill heading */}
          <Box
            sx={{
              display: 'block',
              width: 'fit-content',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              position: 'relative',
              zIndex: 2,
              mt: { xs: -10, md: -11 },
              border: '2px solid #fff',
              borderRadius: '30px',
              px: 3,
              py: 1,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ZEN from our perspective
            </Typography>
          </Box>

          {/* Paragraphs */}
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`X7 is Zen: Imagine finding tranquility in creativity. As we write this brief, we are on the balcony of our Airbnb looking at the stunning Copacabana Hotel in Pattaya, Thailand.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Envisioning something even more magnificent, an empowered community-driven movement. This represents Zen for us: unlocking creativity, inspiring one another, evolving together, and experiencing deep satisfaction and pride.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', mb: 3 , textAlign: 'justify'}}>
            {`Picture yourself effortlessly connecting with fellow creators from across the globe, from Europe, USA, or even in the Moroccan Sahara, embodying serenity and creative freedom.`}
          </Typography>
          <Typography variant="h6" sx={{ whiteSpace: 'pre-line', textAlign: 'justify'}}>
            {`Now, it's your turn to show us how Zen are you with the X7 chair?`}
          </Typography>
        </Box>
      </Box>

      {/* P2 Smart Carousel */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          pt: { xs: 6, md: 1 },
          pb: { xs: 8, md: 15 },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}
          >
            P2 SMART - ZEN INSPIRATION
          </Typography>
          
          {/* Carousel */}
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Left Arrow */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              onClick={() => {
                const carousel = document.getElementById('p2-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: -carousel.offsetWidth, behavior: 'smooth' });
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 24, height: 24, fill: '#fff' }}
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </Box>
            </Box>
            
            {/* Carousel Container */}
            <Box
              id="p2-carousel"
              sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                gap: 2,
                pb: 2,
              }}
            >
              {[
                { 
                  img: 'P2-All-in.jpg', 
                  title: 'All In',
                  description: 'Experience complete immersion in your work with the P2 Smart chair.'
                },
                { 
                  img: 'P2-Bond.jpg', 
                  title: 'Bond',
                  description: 'Build stronger connections with ergonomic comfort that lasts all day.'
                },
                { 
                  img: 'P2-Dinner.jpg', 
                  title: 'Dinner',
                  description: 'Perfect posture even during your evening relaxation time.'
                },
                { 
                  img: 'P2-Flowers.jpg', 
                  title: 'Flowers',
                  description: 'Blend of style and comfort in your workspace.'
                },
                { 
                  img: 'P2-Medal.jpg', 
                  title: 'Medal',
                  description: 'Award-winning design for your ultimate comfort.'
                },
                { 
                  img: 'P2-Run.jpg', 
                  title: 'Run',
                  description: 'Stay active and comfortable throughout your busy day.'
                },
                { 
                  img: 'P2-Sidewalk.jpg', 
                  title: 'Sidewalk',
                  description: 'Perfect for both work and casual relaxation.'
                },
                { 
                  img: 'P2-Sugar.jpg', 
                  title: 'Sugar',
                  description: 'Sweet comfort for your work-from-home setup.'
                },
                { 
                  img: 'P2-The-Order.jpg', 
                  title: 'The Order',
                  description: 'Organized comfort for your professional needs.'
                },
                { 
                  img: 'P2-The-Rig.jpg', 
                  title: 'The Rig',
                  description: 'Built for performance and durability in any setting.'
                }
              ].map((item, idx) => (              
                <Box
                  key={idx}
                  sx={{
                    minWidth: { xs: '85%', sm: '45%', md: '30%' },
                    scrollSnapAlign: 'start',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#000',
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/contest-details01/P2Carousel/${item.img}`}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: { xs: 200, sm: 250, md: 200 },
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {/* Right Arrow */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              onClick={() => {
                const carousel = document.getElementById('p2-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 24, height: 24, fill: '#fff' }}
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Contest Guidelines Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: "url('/images/contest-details01/banners/guidelines.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 10, md: 24 },
          px: 2,
          mb: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            maxWidth: 1200,
            mx: 'auto',
            textAlign: 'left',
          }}
        >          
        </Box>
      </Box>

      {/* Guidelines Content */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          py: { xs: 6, md: 6 },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Guidelines Pill */}
          <Box
            sx={{
              display: 'inline-block',
              border: '1px solid #fff',
              borderRadius: '30px',
              px: 4,
              py: 1,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Guidelines
            </Typography>
          </Box>

          {/* Guidelines Text */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            Your video must serve as a cinematic call-to-action ad that reflects HBADA's brand philosophy that
            supports real lives with aesthetic intelligence and ergonomic precision.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            Each participant must choose one HBADA chair: X7, E3, or P2. Each tied to a core concept (Zen, Zone,
            Zoom) and distinct user experience.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            Your task is to visually interpret the concept, you can get inspired with the situations we provided or
            come up with your own as long as it matches the chair's concept, and embed the chair's unique
            selling points naturally into your storytelling.
          </Typography>
        </Box>
      </Box>

      {/* The Challenge Section */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          py: { xs: 6, md: 8 },
          px: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* The Challenge Pill */}
          <Box
            sx={{
              display: 'inline-block',
              border: '1px solid #fff',
              borderRadius: '30px',
              px: 4,
              py: 1,
              mb: 5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              The Challenge
            </Typography>
          </Box>

          {/* Challenge Text Paragraphs */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            We know that shooting in 9:16 can sometimes feel like a creative constraint, especially for cinematic 
            storytellers. It compresses your vision, flattens your frame, and can make it hard to express depth and 
            movement.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            That's why we're flipping the challenge.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            In this contest, your video should be 9:16, but divided into three horizontal panels stacked on top of each 
            other a vertical triptych. This split screen format invites you to think in layers: play with time, space, and 
            story. You can show the same scene from different angles, pause one panel while the others move, or 
            sync and desync motion to reflect synergy, duality, or contrast. These are just suggestions, don't be afraid 
            to break the pattern. Use the format as a tool to push your creativity and storytelling.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            Yes, you're free to shoot horizontally and reframe it into this stacked format. But if at any point you feel that 
            a full-screen 9:16 moment helps build a stronger narrative or better highlights product features, you can 
            use it, just keep it minimal. Think of it as a strategic break, not the default.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'justify',
            }}
          >
            The goal is simple: challenge yourself, elevate the story, and make your vision unforgettable within and 
            beyond the frame. (Do not forget to send a 16:9 version as it increases your chances of winning)
          </Typography>
        </Box>
      </Box>

      {/* Format Section */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          py: { xs: 6, md: 8 },
          px: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 } }}>
          {/* Format Text */}
          <Box sx={{ flex: '1' }}>
            {/* Format Pill */}
            <Box
              sx={{
                display: 'inline-block',
                border: '1px solid #fff',
                borderRadius: '30px',
                px: 4,
                py: 1,
                mb: 5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Format
              </Typography>
            </Box>

            {/* Format Bullet Points */}
            <Box component="ul" sx={{ pl: 2, '& li': { mb: 2 } }}>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Good Hook (Visual, Sound, or text...)
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Video duration: 1–3 minutes.
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Format: 9:16 vertical, cinematic split-screen.
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Additional 16:9 version increases your chance of winning.
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Product must be visibly used and featured.
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Key selling points of selected chair must be demonstrated.
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                The core focus is cinematic call-to-action ad.
              </Typography>
              <Typography component="li" variant="h6" sx={{ fontWeight: 400 }}>
                Language: English.
              </Typography>
            </Box>
          </Box>

          {/* Format Example Images */}
          <Box sx={{ flex: '1', display: 'flex', gap: 2 }}>
            {/* First Example */}
            <Box
              sx={{
                flex: 1,
                borderRadius: 2,
                overflow: 'hidden',
                height: 500,
                bgcolor: '#111',
                position: 'relative',
                backgroundImage: "url('/images/contest-details01/banners/fr1.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Second Example */}
            <Box
              sx={{
                flex: 1,
                borderRadius: 2,
                overflow: 'hidden',
                height: 500,
                bgcolor: '#111',
                position: 'relative',
                backgroundImage: "url('/images/contest-details01/banners/fr2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          bgcolor: '#000',
        }}
      >
        {/* Image */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 300, sm: 400, md: 500 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/images/contest-details01/base.jpg"
            alt="What are you waiting for?"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>
        
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            py: 2,
            px: { xs: 2, sm: 4 },
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              maxWidth: 1200,
              mx: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Create Account Button */}
            <Button
              variant="contained"
              sx={{
                bgcolor: '#fff',
                color: '#000',
                borderRadius: 30,
                px: 4,
                py: 1.5,
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f0f0f0',
                },
                minWidth: { xs: '100%', sm: 220 },
              }}
              component={Link}
              to="/signup"
            >
              Create an account
            </Button>
            
            {/* Apply to Compete Button */}
            <Button
              variant="contained"
              sx={{
                bgcolor: '#00a550',
                color: '#fff',
                borderRadius: 30,
                px: 4,
                py: 1.5,
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#008040',
                },
                minWidth: { xs: '100%', sm: 220 },
              }}
              component={Link}
              to={`/contests/4/apply`}
            >
              Apply to Compete
            </Button>
          </Box>
        </Box>
        {/* Add spacing at the bottom to prevent content from being hidden */}
        <Box sx={{ height: { xs: '160px', sm: '100px' }, width: '100%' }} />
      </Box>
      {/* Add padding to the bottom of the page to prevent content from being hidden behind the fixed buttons */}
      <Box sx={{ height: { xs: '160px', sm: '100px' }, width: '100%' }} />
    </Box>
  );
};

export default ContestDetails;
