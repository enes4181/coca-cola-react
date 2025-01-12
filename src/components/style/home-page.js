import { IconButton } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled('div')(({ theme }) => ({
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  height: '400px', // Sabit yükseklik
  width: '250px', // Sabit genişlik
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  margin: 'auto',
  boxShadow: 'none',
  position: 'relative',
  '&:hover .arrow': {
    display: 'block',
  },
  '&:hover .favorite-icon': {
    display: 'block',
  },
}));

const StyledCardMedia = styled('img')(({ theme }) => ({
  height: '85%',
  width: '100%',
  objectFit: 'cover',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  backgroundColor: theme.palette.background.default,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledCardContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  flexGrow: 1,
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.875rem',
  height: '15%',
}));

const FavoriteIconStyled = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 1,
  display: 'none',
  '&.favorite-icon': {
    display: 'block',
  },
}));

export { StyledCard, StyledCardMedia, StyledCardContent, FavoriteIconStyled };