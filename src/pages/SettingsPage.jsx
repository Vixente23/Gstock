import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import { 
  Box, 
  Typography, 
  Divider, 
  Stack, 
  Button, 
  useMediaQuery, 
  useTheme,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch
} from '@mui/material';
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

const SettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const settingsItems = [
    {
      icon: <PersonIcon />,
      primary: "Informations du compte",
      secondary: "Modifiez vos informations personnelles",
      action: <Button variant="outlined" size={isMobile ? 'small' : 'medium'}>Modifier</Button>
    },
    {
      icon: <LockIcon />,
      primary: "Mot de passe",
      secondary: "Changez votre mot de passe régulièrement",
      action: <Button variant="outlined" size={isMobile ? 'small' : 'medium'}>Changer</Button>
    },
    {
      icon: <SecurityIcon />,
      primary: "Authentification à deux facteurs",
      secondary: "Activez pour plus de sécurité",
      action: <Switch checked={false} onChange={() => {}} />
    },
    {
      icon: <NotificationsIcon />,
      primary: "Notifications",
      secondary: "Gérez vos préférences de notifications",
      action: <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
    },
    {
      icon: <LanguageIcon />,
      primary: "Langue",
      secondary: "Français",
      action: <Button variant="outlined" size={isMobile ? 'small' : 'medium'}>Changer</Button>
    },
    {
      icon: <DarkModeIcon />,
      primary: "Mode sombre",
      secondary: "Activer/désactiver le thème sombre",
      action: <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
    }
  ];

  const dangerZoneItems = [
    {
      icon: <DeleteIcon color="error" />,
      primary: "Supprimer le compte",
      secondary: "Cette action est irréversible",
      action: <Button variant="outlined" color="error" size={isMobile ? 'small' : 'medium'}>Supprimer</Button>
    }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 1, sm: 2, md: 4, lg: 6 },
        py: { xs: 1, sm: 2, md: 4 },
        maxWidth: {
          xs: '100%',
          sm: 500,
          md: 800,
          lg: 1000,
          xl: 1200
        },
        margin: '0 auto'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          borderRadius: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 }
        }}
      >
        <Typography
          variant={isMobile ? 'h6' : isTablet ? 'h5' : isLarge ? 'h4' : 'h5'}
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem', lg: '1.7rem' }
          }}
        >
          <SecurityIcon fontSize={isMobile ? 'medium' : isLarge ? 'inherit' : 'large'} />
          Paramètres du compte
        </Typography>
        <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

        <List sx={{ width: '100%' }}>
          {settingsItems.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={React.cloneElement(item.action, {
                size: isMobile ? 'small' : isTablet ? 'medium' : isLarge ? 'large' : 'medium'
              })}
              sx={{
                py: { xs: 1, sm: 2 },
                px: { xs: 0, sm: 1, md: 2 },
                alignItems: 'flex-start'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 }
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.primary}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                }}
                secondary={item.secondary}
                secondaryTypographyProps={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          borderRadius: { xs: 2, sm: 3 },
          border: '1px solid',
          borderColor: 'error.light',
          bgcolor: (theme) =>
            theme.palette.error.veryLight || theme.palette.error.lighter || '#fff5f5'
        }}
      >
        <Typography
          variant={isMobile ? 'h6' : isTablet ? 'h5' : isLarge ? 'h4' : 'h5'}
          gutterBottom
          sx={{
            color: 'error.main',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem', lg: '1.7rem' }
          }}
        >
          <WarningIcon color="error" fontSize={isMobile ? 'medium' : isLarge ? 'inherit' : 'large'} />
          Zone dangereuse
        </Typography>
        <Divider sx={{ mb: { xs: 2, sm: 3 }, borderColor: 'error.light' }} />

        <List sx={{ width: '100%' }}>
          {dangerZoneItems.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={React.cloneElement(item.action, {
                size: isMobile ? 'small' : isTablet ? 'medium' : isLarge ? 'large' : 'medium'
              })}
              sx={{
                py: { xs: 1, sm: 2 },
                px: { xs: 0, sm: 1, md: 2 },
                alignItems: 'flex-start'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: 'error.light',
                    color: 'error.contrastText',
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 }
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.primary}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: 'error.main',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                }}
                secondary={item.secondary}
                secondaryTypographyProps={{
                  color: 'error.main',
                  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SettingsPage;