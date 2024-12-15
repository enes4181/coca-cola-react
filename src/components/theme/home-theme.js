import { createTheme } from '@mui/material/styles';

const HomeTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ebebeb', // Arka plan rengini biraz daha açık bir ton yaptık
      paper: '#ffffff',
    },
  },
});

export default HomeTheme;