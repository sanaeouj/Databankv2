import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#fff',
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#fff',
    },
    accent: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
    },
    background: {
      default: '#0F172A',
      paper: 'rgba(30, 41, 59, 0.6)',
      elevated: 'rgba(32, 41, 58, 0.8)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8CA0B3',
      disabled: '#64748B',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.1)',
    '0 4px 16px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.2)',
    '0 12px 32px rgba(0, 0, 0, 0.25)',
    '0 16px 48px rgba(0, 0, 0, 0.3)',
    '0 20px 64px rgba(0, 0, 0, 0.35)',
    '0 24px 80px rgba(0, 0, 0, 0.4)',
    '0 28px 96px rgba(0, 0, 0, 0.45)',
    '0 32px 112px rgba(0, 0, 0, 0.5)',
    '0 36px 128px rgba(0, 0, 0, 0.55)',
    '0 40px 144px rgba(0, 0, 0, 0.6)',
    '0 44px 160px rgba(0, 0, 0, 0.65)',
    '0 48px 176px rgba(0, 0, 0, 0.7)',
    '0 52px 192px rgba(0, 0, 0, 0.75)',
    '0 56px 208px rgba(0, 0, 0, 0.8)',
    '0 60px 224px rgba(0, 0, 0, 0.85)',
    '0 64px 240px rgba(0, 0, 0, 0.9)',
    '0 68px 256px rgba(0, 0, 0, 0.95)',
    '0 72px 272px rgba(0, 0, 0, 1)',
    '0 76px 288px rgba(0, 0, 0, 1)',
    '0 80px 304px rgba(0, 0, 0, 1)',
    '0 84px 320px rgba(0, 0, 0, 1)',
    '0 88px 336px rgba(0, 0, 0, 1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#8B5CF6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B5CF6',
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});

