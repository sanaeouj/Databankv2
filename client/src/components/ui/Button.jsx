import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { gradients } from '../../styles/globalStyles';

export const PrimaryButton = ({ children, ...props }) => {
  return (
    <MuiButton
      variant="contained"
      {...props}
      sx={{
        background: gradients.primary,
        color: '#fff',
        fontWeight: 700,
        px: 4,
        py: 1.5,
        borderRadius: 3,
        fontSize: '1rem',
        textTransform: 'none',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover': {
          background: gradients.secondary,
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
          '&::before': {
            left: '100%',
          },
        },
        '&:active': {
          transform: 'translateY(-2px) scale(0.98)',
        },
        ...props.sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

export const SecondaryButton = ({ children, ...props }) => {
  return (
    <MuiButton
      variant="outlined"
      {...props}
      sx={{
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        color: '#fff',
        textTransform: 'none',
        px: 4,
        py: 1.5,
        borderRadius: 3,
        fontSize: '1rem',
        fontWeight: 600,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s',
        },
        '&:hover': {
          borderColor: '#8B5CF6',
          color: '#8B5CF6',
          background: 'rgba(139, 92, 246, 0.15)',
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 15px 40px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)',
          '&::before': {
            opacity: 1,
          },
        },
        '&:active': {
          transform: 'translateY(-2px) scale(0.98)',
        },
        ...props.sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

