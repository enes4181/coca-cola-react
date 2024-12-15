import { Box, Card, CardMedia, styled, Typography } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "row", // Yatay bölmek yerine dikey bölmek için
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  position: "relative",
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: "100%", // Resmin genişliğini %50 olarak ayarladık
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledCardContent = styled(Box)(({ theme }) => ({
  width: "50%", // İçeriğin genişliğini %50 olarak ayarladık
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  wordWrap: 'break-word', // Uzun kelimelerin taşmasını önlemek için
  overflowWrap: 'break-word', // Uzun kelimelerin taşmasını önlemek için
  whiteSpace: 'pre-wrap', // Uzun kelimelerin taşmasını önlemek için
  wordBreak: 'break-word', // Uzun kelimelerin taşmasını önlemek için
}));

export { StyledCard, StyledCardMedia, StyledCardContent, StyledTypography };