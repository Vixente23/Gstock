import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const AuthLayoutContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));


const CardContainer = styled(Container)(({ theme }) => ({
  maxWidth: 420,
  background: 'linear-gradient(120deg, #483aa0 0%, #7965c1 100%)',
  boxShadow: '0 6px 24px 0 rgba(72,58,160,0.10), 0 1.5px 0 #7965c1 inset',
  border: '1px solid #7965c1',
  borderRadius: 18,
  boxShadow: '0 8px 32px 0 rgba(103,223,250,0.10)',
  padding: theme.spacing(4, 3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
  minHeight: 0,
  margin: 'auto',
  transition: 'box-shadow .2s',
}));




const AppName = () => (
  <Typography
    variant="h5"
    sx={{
      fontWeight: 800,
      letterSpacing: 1.5,
  color: 'transparent',
  background: 'linear-gradient(90deg,#0e2148,#483aa0,#7965c1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
      userSelect: 'none',
      textAlign: 'left',
      mb: 3,
    }}
  >
    Gstock
  </Typography>
);

const AuthLayout = () => {
  return (
    <>
      <CssBaseline />
      <AuthLayoutContainer>
        <CardContainer>
          <AppName />
          <Outlet />
        </CardContainer>
      </AuthLayoutContainer>
    </>
  );
};

export default AuthLayout;