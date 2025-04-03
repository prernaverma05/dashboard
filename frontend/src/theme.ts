import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#607EAA',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#FFFFFF',
      paper: '#E3EAF5',
    },
    text: {
      primary: '#333333', // Set your desired primary text color here
      secondary: '#333333', // Optional: set a secondary text color
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#333333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#333333',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#333333',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#333333',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#333333',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#333333',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme; 