import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Ajouter la constante drawerWidth ici
const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
  <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)', overflowX: 'hidden' }}>
      <CssBaseline />
  <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        drawerWidth={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 1, sm: 3, md: 5 },
          py: { xs: 1, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #483aa0 0%, #7965c1 100%)',
          borderTopLeftRadius: { sm: 32 },
          borderBottomLeftRadius: { sm: 32 },
          boxShadow: { sm: '0 8px 32px 0 #67dffa11' },
          transition: 'all .2s',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;