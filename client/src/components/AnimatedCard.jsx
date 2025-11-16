import React from 'react';
import { Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

export const AnimatedCard = ({ children, delay = 0, ...props }) => {
  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      {...props}
    >
      {children}
    </MotionPaper>
  );
};

export const GradientCard = ({ children, gradient = 'primary', ...props }) => {
  const gradients = {
    primary: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
    accent: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: gradients[gradient] || gradients.primary,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

