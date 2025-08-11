import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const AuthLayoutContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const AuthLayout = () => {
  return (
    <>
      <CssBaseline />
      <AuthLayoutContainer>
        <Container maxWidth="sm">
          <Outlet />
        </Container>
      </AuthLayoutContainer>
    </>
  );
};

export default AuthLayout;