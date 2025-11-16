import React from 'react';
import { Paper, Box } from '@mui/material';
import { glassmorphism, gradients } from '../../styles/globalStyles';

export const GlassCard = ({ children, variant = 'medium', gradient, ...props }) => {
  const glassStyle = glassmorphism[variant] || glassmorphism.medium;
  
  return (
    <Paper
      elevation={0}
      {...props}
      sx={{
        ...glassStyle,
        borderRadius: 3,
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': gradient ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: gradients[gradient] || gradients.primary,
        } : {},
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Paper>
  );
};

export const StatCard = ({ icon, label, value, gradient = 'primary', delay = 0 }) => {
  const gradientsMap = {
    primary: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
    accent: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
  };

  const topGradients = {
    primary: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)',
    success: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)',
    accent: 'linear-gradient(90deg, #F59E0B 0%, #8B5CF6 100%)',
  };

  const valueGradients = {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    accent: 'linear-gradient(135deg, #F59E0B 0%, #8B5CF6 100%)',
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: gradientsMap[gradient] || gradientsMap.primary,
        backdropFilter: 'blur(20px)',
        p: 3,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: topGradients[gradient] || topGradients.primary,
          opacity: 0,
          transition: 'opacity 0.3s',
        },
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)',
          borderColor: 'rgba(139, 92, 246, 0.4)',
          '&::before': {
            opacity: 1,
          },
        },
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box
        component="span"
        sx={{
          color: '#8CA0B3',
          fontSize: 13,
          mb: 1.5,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </Box>
      <Box
        component="span"
        sx={{
          fontWeight: 800,
          fontSize: 42,
          background: valueGradients[gradient] || valueGradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {value}
      </Box>
    </Paper>
  );
};

