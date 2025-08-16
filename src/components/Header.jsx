import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Hook pour récupérer les notifications de stock
function useStockNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notifs = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
    setNotifications(notifs);
  }, []);

  return notifications;
}

const Header = ({ onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const notifications = useStockNotifications();
  const [notifAnchor, setNotifAnchor] = useState(null);
  const { themeName, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNotifOpen = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  const notifOpen = Boolean(notifAnchor);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
        boxShadow: '0 4px 24px 0 rgba(72, 58, 160, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1, sm: 2, md: 3 },
          justifyContent: 'space-between'
        }}
      >
        {/* Partie gauche */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{
              mr: { xs: 1, sm: 2 },
              display: { md: 'none' },
              borderRadius: '12px',
              p: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <MenuIcon
              sx={{
                color: '#fff',
                fontSize: { xs: 24, sm: 26 }
              }}
            />
          </IconButton>

          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              userSelect: 'none',
              textShadow: '0 2px 8px rgba(72, 58, 160, 0.2)',
              background: 'linear-gradient(90deg, #fff, #d1cbf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mr: { xs: 0, sm: 2 }
            }}
          >
            Gstock
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Partie droite */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 } }}>
          {/* Bouton thème */}
          <Button
            color="inherit"
            variant="text"
            onClick={toggleTheme}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              minWidth: 'auto',
              px: { sm: 1.5, md: 2.5 },
              py: 1,
              borderRadius: '12px',
              fontWeight: 500,
              color: '#fff',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {themeName === 'light' ? '🌙 Sombre' : '☀️ Clair'}
          </Button>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotifOpen}
            sx={{
              borderRadius: '12px',
              p: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <Badge
              badgeContent={notifications.length}
              color="error"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  top: 6,
                  right: 6
                }
              }}
            >
              <NotificationsIcon sx={{ color: '#fff', fontSize: { xs: 22, sm: 24 } }} />
            </Badge>
          </IconButton>

          <Popover
            open={notifOpen}
            anchorEl={notifAnchor}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                width: { xs: '280px', sm: '320px' },
                bgcolor: 'background.paper',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                mt: 1
              }
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                p: 2,
                fontWeight: 600,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              Notifications
            </Typography>
            <List dense sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Aucune notification" />
                </ListItem>
              ) : (
                notifications.map((notif, idx) => (
                  <ListItem
                    key={idx}
                    divider
                    sx={{
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <ListItemText
                      primary={notif.message || notif}
                      primaryTypographyProps={{
                        fontSize: '0.875rem'
                      }}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Popover>

          {/* Profil */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{
                  mr: 1.5,
                  color: '#fff',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>
            )}

            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                borderRadius: '12px',
                p: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: { xs: '200px', sm: '240px' },
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                mt: 1,
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  py: 1.5
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
            >
              Mon profil
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/settings');
              }}
            >
              Paramètres
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: 'error.main'
              }}
            >
              Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
