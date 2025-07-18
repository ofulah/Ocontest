import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  Collapse,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Instagram, YouTube, ExpandMore, ExpandLess } from '@mui/icons-material';

const MemberCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  minWidth: '280px',
  margin: theme.spacing(0, 1.5),
  '&:first-of-type': {
    marginLeft: 0,
  },
  '&:last-of-type': {
    marginRight: 0,
  },
}));

const ProfileSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
});

const ProfileImage = styled(Avatar)({
  width: '50px',
  height: '50px',
  border: '2px solid #FFFFFF',
  flexShrink: 0,
});

const NameText = styled(Typography)({
  flexGrow: 1,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
});

const SocialLinks = styled(Box)({
  display: 'flex',
  gap: '8px',
  '& svg': {
    color: '#FFFFFF',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 0.8,
    },
  },
});

const MemberImage = styled('img')({
  width: '100%',
  height: '140px',
  objectFit: 'cover',
  borderRadius: '8px',
  margin: '12px 0',
});

const ReasonButton = styled(Button)(({ theme }) => ({
  marginTop: '8px',
  padding: '4px 16px',
  backgroundColor: 'transparent',
  color: '#FFFFFF',
  borderRadius: '20px',
  textTransform: 'none',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: '1px solid #FFFFFF',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const ReasonContent = styled(Paper)(({ theme }) => ({
  marginTop: '8px',
  padding: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  maxHeight: '150px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

const CommunityMemberCard = ({   name, 
  image, 
  memberImage, 
  contestName, 
  reason, 
  isOpen, 
  onToggle, 
  instagram, 
  youtube 
 }) => {

  return (
  <MemberCard>
    <ProfileSection>
      <ProfileImage 
        src={memberImage} 
        alt={name}
      />
      <NameText>{name}</NameText>
      <SocialLinks>
  {instagram && (
    <a 
      href={`https://instagram.com/${instagram}`} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <Instagram />
    </a>
  )}
  {youtube && (
    <a 
      href={youtube} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <YouTube />
    </a>
  )}
</SocialLinks>

    </ProfileSection>

    <MemberImage 
      src={name} 
      alt={`${name}'s work`}
    />
    <Typography variant="body1" sx={{ color: 'white', mt: 1 }}>
      Contest: {contestName}
    </Typography>

    {reason && (
      <Box sx={{ mt: 1 }}>
        <ReasonButton 
          onClick={onToggle}
          endIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
        >
          Reason for Application
        </ReasonButton>
        <Collapse in={isOpen}>
          <ReasonContent elevation={0}>
            {reason}
          </ReasonContent>
        </Collapse>
      </Box>
    )}
  </MemberCard>
);

};

export default CommunityMemberCard;

