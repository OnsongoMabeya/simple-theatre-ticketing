'use client';

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#145da0', // Midnight Blue
      light: '#2e8bc0', // Blue
      dark: '#0c2d48', // Dark Blue
    },
    secondary: {
      main: '#b1d4e0', // Baby Blue
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#145da0', // Dark Blue
      secondary: '#2e8bc0', // Midnight Blue
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#2e8bc0', // Blue
          },
        },
        outlined: {
          borderColor: '#145da0', // Midnight Blue
          color: '#145da0', // Midnight Blue
          '&:hover': {
            borderColor: '#2e8bc0', // Blue
            backgroundColor: 'rgba(46, 139, 192, 0.1)', // Blue with transparency
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(20, 93, 160, 0.1)', // Midnight Blue shadow
          border: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(20, 93, 160, 0.15)', // Midnight Blue shadow
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0c2d48', // Dark Blue
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(20, 93, 160, 0.15)', // Midnight Blue shadow
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
  typography: {
    h1: {
      color: '#0c2d48', // Dark Blue
    },
    h2: {
      color: '#0c2d48', // Dark Blue
    },
    h3: {
      color: '#0c2d48', // Dark Blue
    },
    h4: {
      color: '#0c2d48', // Dark Blue
    },
    h5: {
      color: '#0c2d48', // Dark Blue
    },
    h6: {
      color: '#0c2d48', // Dark Blue
    },
  },
});

export default function ThemeProvider({ children }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
