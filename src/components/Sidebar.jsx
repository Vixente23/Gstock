import React from 'react';
import { 
  Divider, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  MoveToInbox as StockIcon,
  People as PeopleIcon,
  ShoppingCart as SuppliersIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  // Palette métallique et hover animé
  const navItems = [
    { to: '/', icon: <DashboardIcon sx={{ fontSize: 28 }} />, label: 'Tableau de bord' },
    { to: '/products', icon: <InventoryIcon sx={{ fontSize: 28 }} />, label: 'Produits' },
    { to: '/stock', icon: <StockIcon sx={{ fontSize: 28 }} />, label: 'Mouvements de stock' },
    { to: '/suppliers', icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />, label: 'Fournisseurs' },
    { to: '/users', icon: <PeopleIcon sx={{ fontSize: 28 }} />, label: 'Utilisateurs' },
  ];
  const settingsItems = [
    { to: '/settings', icon: <SettingsIcon sx={{ fontSize: 26 }} />, label: 'Paramètres' },
  ];
  const drawer = (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#0e2148 0%,#483aa0 100%)', borderRight: '1.5px solid #7965c1', minHeight: '100vh' }}>
      <Toolbar sx={{ minHeight: 64 }} />
  <Divider sx={{ mb: 1, background: '#7965c1' }} />
      <List sx={{ flex: 1 }}>
        {navItems.map((item, idx) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                borderRadius: 3,
                mx: 1,
                my: 0.5,
                py: 1.2,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: 'linear-gradient(90deg,#483aa0 0%,#7965c1 100%)',
                boxShadow: '0 1px 8px 0 #483aa033',
                transition: 'all .18s',
                '&:hover': {
                  background: 'linear-gradient(90deg,#7965c1 0%,#483aa0 100%)',
                  boxShadow: '0 2px 16px 0 #7965c133',
                  transform: 'scale(1.04)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#7965c1', filter: 'drop-shadow(0 2px 8px #7965c144)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  <Divider sx={{ my: 1, background: '#7965c1' }} />
      <List>
        {settingsItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                borderRadius: 3,
                mx: 1,
                my: 0.5,
                py: 1.1,
                px: 2,
                background: 'linear-gradient(90deg,#483aa0 0%,#7965c1 100%)',
                boxShadow: '0 1px 8px 0 #483aa033',
                transition: 'all .18s',
                '&:hover': {
                  background: 'linear-gradient(90deg,#7965c1 0%,#483aa0 100%)',
                  boxShadow: '0 2px 16px 0 #7965c133',
                  transform: 'scale(1.04)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#7965c1', filter: 'drop-shadow(0 2px 8px #7965c144)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: 15, letterSpacing: 0.5 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, zIndex: 1200 }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(180deg,#0e2148 0%,#483aa0 100%)',
            borderRight: '1.5px solid #7965c1',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(180deg,#0e2148 0%,#483aa0 100%)',
            borderRight: '1.5px solid #7965c1',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;