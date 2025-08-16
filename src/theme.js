import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#483aa0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7965c1',
      contrastText: '#fff',
    },
    background: {
      default: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
      paper: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
    },
    info: {
      main: '#7965c1',
      contrastText: '#fff',
    },
    success: {
      main: '#483aa0',
      contrastText: '#fff',
    },
    error: {
      main: '#0e2148',
      contrastText: '#fff',
    },
    warning: {
      main: '#7965c1',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#7965c1',
      disabled: '#483aa0',
      hint: '#7965c1',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Lato, Poppins, Arial, sans-serif',
    h1: { fontSize: '2.7rem', fontWeight: 700, letterSpacing: '-1px' },
    h2: { fontSize: '2.2rem', fontWeight: 600 },
    h3: { fontSize: '1.7rem', fontWeight: 600 },
    h4: { fontSize: '1.3rem', fontWeight: 500 },
    h5: { fontSize: '1.1rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    button: { fontWeight: 600, letterSpacing: '0.5px' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 22px',
          background: 'linear-gradient(90deg, #483aa0 0%, #7965c1 100%)',
          color: '#fff',
          boxShadow: '0 2px 8px 0 rgba(72,58,160,0.15), 0 1.5px 0 #7965c1 inset',
          border: '1px solid #7965c1',
          transition: 'background 0.3s, box-shadow 0.3s',
          '&:hover': {
            background: 'linear-gradient(90deg, #7965c1 0%, #483aa0 100%)',
            boxShadow: '0 4px 16px 0 rgba(72,58,160,0.25), 0 1.5px 0 #7965c1 inset',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          boxShadow: '0 6px 24px 0 rgba(72,58,160,0.10), 0 1.5px 0 #7965c1 inset',
          border: '1px solid #7965c1',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          boxShadow: '0 2px 8px 0 rgba(72,58,160,0.10)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 8px 0 rgba(72,58,160,0.10)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          background: 'rgba(14,33,72,0.7)',
          color: '#fff',
          borderBottom: '1px solid #483aa0',
        },
        head: {
          background: 'linear-gradient(90deg, #483aa0 0%, #7965c1 100%)',
          color: '#fff',
          fontWeight: 700,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          color: '#fff',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#483aa0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7965c1',
      contrastText: '#fff',
    },
    background: {
      default: '#0e2148',
      paper: '#483aa0',
    },
    info: {
      main: '#7965c1',
      contrastText: '#fff',
    },
    success: {
      main: '#483aa0',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#7965c1',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Lato, Poppins, Arial, sans-serif',
    h1: { fontSize: '2.7rem', fontWeight: 700, letterSpacing: '-1px' },
    h2: { fontSize: '2.2rem', fontWeight: 600 },
    h3: { fontSize: '1.7rem', fontWeight: 600 },
    h4: { fontSize: '1.3rem', fontWeight: 500 },
    h5: { fontSize: '1.1rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    button: { fontWeight: 600, letterSpacing: '0.5px' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 22px',
          background: 'linear-gradient(90deg, #483aa0 0%, #7965c1 100%)',
          color: '#fff',
          boxShadow: '0 2px 8px 0 rgba(72,58,160,0.15), 0 1.5px 0 #7965c1 inset',
          border: '1px solid #7965c1',
          transition: 'background 0.3s, box-shadow 0.3s',
          '&:hover': {
            background: 'linear-gradient(90deg, #7965c1 0%, #483aa0 100%)',
            boxShadow: '0 4px 16px 0 rgba(72,58,160,0.25), 0 1.5px 0 #7965c1 inset',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          boxShadow: '0 6px 24px 0 rgba(72,58,160,0.10), 0 1.5px 0 #7965c1 inset',
          border: '1px solid #7965c1',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          boxShadow: '0 2px 8px 0 rgba(72,58,160,0.10)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 8px 0 rgba(72,58,160,0.10)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          background: 'rgba(14,33,72,0.7)',
          color: '#fff',
          borderBottom: '1px solid #483aa0',
        },
        head: {
          background: 'linear-gradient(90deg, #483aa0 0%, #7965c1 100%)',
          color: '#fff',
          fontWeight: 700,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #483aa0 0%, #7965c1 100%)',
          color: '#fff',
        },
      },
    },
  },
});

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;