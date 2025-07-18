import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import CommunityMemberCard from './CommunityMemberCard';

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  padding: '24px 0',
  [theme.breakpoints.down('sm')]: {
    padding: '16px 0',
  },
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  overflowX: 'hidden',
  width: '100%',
  padding: '0 40px',
  scrollbarWidth: 'none', // Hide scrollbar for Firefox
  msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
  '&::-webkit-scrollbar': {
    display: 'none', // Hide scrollbar for Chrome/Safari
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 30px',
  },
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#FFFFFF',
  width: '48px',
  height: '48px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  transition: 'all 0.2s ease-in-out',
  zIndex: 1,
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  },
  '&.Mui-disabled': {
    opacity: 0.3,
  },
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.75rem',
    },
  },
}));

const CommunityBoard = () => {
  const [openCardId, setOpenCardId] = useState(null);

  const handleToggleReason = (cardId) => {
    setOpenCardId(openCardId === cardId ? null : cardId);
  };
  // Sample data - replace with actual data later
 const members = [
    {
      id: 1,
      instagram: "masterclipz",
      name: 'Isaac Unciano',
      email: 'Masterclipz@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Isaac-Unciano-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Isaac-Unciano.jpg',
      contestName: 'So Now You Win!',
      reason: 'I know I would kill it with this project, it\'s so simple "a chair" however a chair can convey so much emotion. The posture, the positioning and location, everything.. I would love to be considered I already have a crazy idea depending on what color chair I get',
      youtube: 'https://www.youtube.com/@MasterClipz'
    },
    {
      id: 2,
      name: 'Malik Gillum',
      instagram: "realmalikbaker",
      email: 'malikshaqgillum@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Malik-Gillum-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Malik-Gillum.jpg',
      contestName: 'So Now You Win!',
      reason: 'I want to participate in this contest because I get the opportunity to challenge myself creating a project with a prompt to follow with limited to complete.',
      youtube: 'https://www.youtube.com/@MalikBaker'
    },
    {
      id: 3,
      name: 'Danny Chandia',
      instagram: "Desert Cactus Films",
      email: 'danny@desertcactusfilms.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/danny-chadia-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/danny-chadia.png',
      contestName: 'So Now You Win!',
      reason: 'Hi there, thanks for the consideration in taking part in this contest. "The Power is Your Color" tag line I feel like is a really bold statement and there are a lot of things creatively I can do to showcase not only the chair but combine my style of filmmaking. I feel like this challenge would be an awesome way to combine VFX and virtual production while also making a bold statement for the ergonomics of the chair itself. I\'ve mostly done short films and music videos and I feel like getting the opportunity to do a spec commercial with my team in Las Vegas would be a great way to highlight the product and also the amazing filmmakers out in my city. Also, as an editor, I\'m constantly in front of my computer so having a chair that is sleek, function and ergonomic is very important to me. Thanks for your time!',
      youtube: 'https://www.youtube.com/@DesertCactusFilms'
    },
    {
      id: 4,
      name: 'William Alexander Stewart',
      instagram: "_artstew__",
      email: 'artstewpro@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/William-Alexander-Stewar-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/William-Alexander-Stewart.jpg',
      contestName: 'So Now You Win!',
      reason: 'Whether it\'s theater, photography or filmmaking, my whole life has been dedicated to creating. And this seems like another fun reason to continue that',
      youtube: 'https://www.youtube.com/@ArtStew_'
    },
    {
      id: 5,
      name: 'Josh Harter',
      instagram: "_jhvisuals_",
      email: 'Joshhartervisuals@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Josh-Harter-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Josh-Harter.jpg',
      contestName: 'So Now You Win!',
      reason: 'I want to participate to expand my portfolio and also to genuinely try to create a short film for the first time. I always try to deliver a meaningful message through content on my personal pages. And truly think I could put a project together that could relate to others and also deliver the impact the brand is looking for.',
      youtube: 'https://www.youtube.com/@joshharter1511'
    },
    {
      id: 6,
      name: 'Gracey Goncalves',
      instagram: "Gracey_mg",
      email: 'gracemginfl@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Gracey-Goncalves-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Gracey-Goncalves.jpg',
      contestName: 'So Now You Win!',
      reason: 'I am a recent SCAD graduate with a major in film and television, with a concentration in cinematography. I would love the opportunity to showcase the skills I have learned and put to work as the Director of Photography on a multitude of short films, music videos, and short series. I have recently created a DP Reel to showcase my work and would love to share it. I am truly passionate about uniquely storytelling through a lens with an amazing team and would be so grateful to participate in this opportunity!',
      youtube: 'https://www.youtube.com/@GraceyMariana'
    },
    {
      id: 7,
      name: 'Daniel Oshodi Alagoa',
      instagram: "Officialbils",
      email: 'Bookofficialbils@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Daniel-Oshodi-Alagoa-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Daniel-Oshodi-Alagoa.jpg',
      contestName: 'So Now You Win!',
      reason: 'I\'m excited to participate in this contest because it aligns perfectly with my passion for storytelling, creativity, and visual artistry. As an artist and content creator, I see this challenge as an opportunity to push my cinematic vision while bringing emotion, and depth.\n\nAlso, beyond the competition, I love merging narrative with aesthetics, and this project allows me to create something compelling while showcasing my skills on a global platform.',
      youtube: 'https://www.youtube.com/@OfficialBils'
    },
    {
      id: 8,
      name: 'Jonah Etheridge',
      instagram: "Fgtv_studios",
      email: 'joether321@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Jonah-Etheridge-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Jonah-Etheridge.jpg',
      contestName: 'So Now You Win!',
      reason: 'I want become a filmmaker and YouTuber as my career, and I think this could be the stopping stone into that journey.',
      youtube: 'https://www.youtube.com/@FroggyTv_Yt'
    },
    {
      id: 9,
      name: 'Andrew reid',
      instagram: "mrjimmyblanco",
      email: 'Jimmyblancovisionz@yahoo.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/jimmy-blanco-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/jimmy-blanco.jpg',
      contestName: 'So Now You Win!',
      reason: 'I Was recently in a car accident and haven\'t been able to get back to shooting on big sets again, I think this is something that could get me out of my depression and back to what I love to do',
      youtube: 'https://www.youtube.com/@JimmyBlanco'
    },
    {
      id: 10,
      name: 'Paul Koliadych',
      instagram: "reddiamond.studio",
      email: 'paul@reddiamond.film',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Paul-Koliadych-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Paul-Koliadych.jpg',
      contestName: 'So Now You Win!',
      reason: 'It\'s great to be a part of the community of like-minded people. Cool to share my work with everyone. And the prizes are nice haha',
      youtube: 'https://www.youtube.com/@reddiamond.studio'
    },
    {
      id: 11,
      name: 'Khalief Harjono',
      instagram: "khaliefharjono",
      email: 'khalief165@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Khalief-Harjono-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Khalief-Harjono.jpg',
      contestName: 'So Now You Win!',
      reason: 'I want to participate because I want to invest more on my craft. I am an Indonesian filmmaker trying to make my way here in LA. The money received will be circled back for me to continue to getting more equipments and funding my next indie projects.',
      youtube: ''
    },
    {
      id: 12,
      name: 'Luke Ostermiller',
      instagram: "lukeostermiller",
      email: 'luke@lostefilms.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Luke-Ostermiller-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Luke-Ostermiller.jpg',
      contestName: 'So Now You Win!',
      reason: 'I want to participate in this contest because it\'s a great opportunity to showcase my filmmaking skills while creatively highlighting the design and functionality of the chair. As a filmmaker with a strong background in music videos and feature films, I enjoy bringing objects to life through storytelling, composition, and lighting. This challenge allows me to merge my passion for visual storytelling with product-focused filmmaking, pushing me to think outside the box and create something visually compelling. Plus, it\'s a chance to gain exposure, connect with like-minded creatives, and put my skills to the test in a unique and exciting way.',
      youtube: 'https://www.youtube.com/@LosteFilms'
    },
    {
      id: 13,
      name: 'Stepan Dmytriv',
      instagram: "stephan_dmytriv",
      email: 'Stephan@film28.me',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Stepan-Dmytriv-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Stepan-Dmytriv.png',
      contestName: 'So Now You Win!',
      reason: 'I love filmmaking and creating stories that resonate with people. I believe this project will push the boundaries of artistic storytelling. There are many different narratives to explore, along with lighting techniques and color grading processes that can transform a product - such as a chair - into a multilayered story that viewers can connect with. I would love to be a part of this project to dive deeper into my creative freedom and create something truly unique.',
      youtube: ''
    },
    {
      id: 14,
      name: 'Zain assad',
      instagram: "Assadzman",
      email: 'zmandabest101@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Zain-Assad-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Zain-Assad.jpg',
      contestName: 'So Now You Win!',
      reason: 'I would love to create something inspiring',
      youtube: 'https://www.youtube.com/@ASSADZMANFILMS'
    },
    {
      id: 15,
      name: 'Shauntay Pitts',
      instagram: "fillenoire",
      email: 'Filtayrich@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Shauntay-Pitts-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Shauntay-Pitts.jpg',
      contestName: 'So Now You Win!',
      reason: 'I would love to participate because this such an interesting task! To make a short film about this chair would be so fun and challenging and I love storytelling! Along with the full production I would make something that is creative and brand driven!',
      youtube: 'https://www.youtube.com/@Filtayrichproductions'
    },
    {
      id: 16,
      name: 'Andrew Phothirath',
      instagram: "Phoboya",
      email: 'apho988@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Andrew-Phothirath-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Andrew-Phothirath.jpg',
      contestName: 'So Now You Win!',
      reason: 'I would love to participate because I simply want to create. Whether I am chosen or not I want to take a chance at driving myself towards the creation of art',
      youtube: 'https://www.youtube.com/@phoboya'
    },
    {
      id: 17,
      name: 'Elliot Herzog',
      instagram: "patioproduction",
      email: 'Elliot.Herzog1@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/patio-production-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/patio-production.jpg',
      contestName: 'So Now You Win!',
      reason: 'We are whole heartedly dedicated to crafting unique visual and conceptual narratives. Creating a project for a simple object like a chair I feel is a perfect fit for us, we make the ordinary extraordinary!!',
      youtube: 'https://www.youtube.com/@PatioProduction'
    },
    {
      id: 18,
      name: 'Rizwan Sanaullah',
      instagram: "rizghumro",
      email: 'rizwan.sanaullah@gmail.com',
      image: '/images/homepage-images/COMMUNITY-BOARD-PICS/Rizwan-Sanaullah-pfp.png',
      memberImage: '/images/homepage-images/COMMUNITY-BOARD-PICS/Rizwan-Sanaullah.jpg',
      contestName: 'So Now You Win!',
      reason: 'I\'m a creative visual story-teller and cinematographer. I believe I can create a video that can highlight the features of the chair while keeping it visually interesting for today\'s world',
      youtube: 'https://www.youtube.com/@RizGhumro'
    }
  ];

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 300; // Approximate width of each card + gap
    const scrollAmount = cardWidth * 2; // Scroll by 2 cards at a time
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(maxScroll, currentScroll + scrollAmount);
    
    // Use requestAnimationFrame for smoother animation
    const startTime = performance.now();
    const duration = 400; // Animation duration in ms
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
      
      container.scrollLeft = currentScroll + (targetScroll - currentScroll) * easeInOutCubic;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <ScrollContainer>
        <ArrowButton 
          onClick={() => handleScroll('left')} 
          disabled={!showLeftArrow}
          sx={{ left: 0 }}
          aria-label="scroll left"
        >
          <ChevronLeft />
        </ArrowButton>
        
        <CardsContainer 
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
        >
          {members.map((member) => (
            <CommunityMemberCard
              key={member.id}
              name={member.name}
              image={member.image}
              memberImage={member.memberImage}
              contestName={member.contestName}
              reason={member.reason}
              isOpen={openCardId === member.id}
              onToggle={() => handleToggleReason(member.id)}
              instagram={member.instagram}
              youtube={member.youtube}
            />

          ))}
        </CardsContainer>
        
        <ArrowButton 
          onClick={() => handleScroll('right')} 
          disabled={!showRightArrow}
          sx={{ right: 0 }}
          aria-label="scroll right"
        >
          <ChevronRight />
        </ArrowButton>
      </ScrollContainer>
    </Box>
  );
};

export default CommunityBoard;

