import React, { useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
  Chip,
  Stack,
  TextField,
  CircularProgress,
  Paper,
  Fade,
  useMediaQuery,
  useTheme,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  CloudUpload,
  Delete,
  VerifiedUser,
  Lock,
  Security,
  Notifications,
  Language,
  DarkMode,
  ArrowBack
} from '@mui/icons-material';

const defaultAvatar = '/logo192.png';

const initialUser = {
  name: 'Vixente',
  email: 'vixente@example.com',
  role: 'Administrateur',
  avatar: defaultAvatar,
};

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [mode, setMode] = useState("view"); // "view" | "edit" | "settings"
  const [user, setUser] = useState(initialUser);
  const [formValues, setFormValues] = useState(initialUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialUser.avatar);
  const [avatarError, setAvatarError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
      setAvatarError('Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.');
      return;
    }
    if (file.size > maxSize) {
      setAvatarError('Le fichier est trop volumineux (max 5 MB).');
      return;
    }

    setAvatarError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setPreviewImage(defaultAvatar);
  };

  const handleSave = () => {
    if (!formValues.name?.trim()) {
      alert('Le nom est requis.');
      return;
    }
    if (!formValues.email?.trim()) {
      alert("L'email est requis.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updatedUser = {
        ...formValues,
        avatar: previewImage || defaultAvatar,
      };
      setUser(updatedUser);
      setFormValues(updatedUser);
      setSelectedFile(null);
      setIsSaving(false);
      setMode("view");
    }, 1200);
  };

  const handleCancel = () => {
    setFormValues(user);
    setPreviewImage(user.avatar || defaultAvatar);
    setSelectedFile(null);
    setAvatarError('');
    setMode("view");
  };

  const settingsItems = [
    {
      icon: <Lock />,
      primary: "Changer le mot de passe",
      action: <Button variant="outlined" size="small">Modifier</Button>
    },
    {
      icon: <Security />,
      primary: "Authentification à deux facteurs",
      action: <Switch checked={false} onChange={() => {}} />
    },
    {
      icon: <Notifications />,
      primary: "Notifications",
      action: <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
    },
    {
      icon: <Language />,
      primary: "Langue",
      action: <Button variant="outlined" size="small">Français</Button>
    },
    {
      icon: <DarkMode />,
      primary: "Mode sombre",
      action: <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
    }
  ];

  const dangerZoneItems = [
    {
      icon: <Delete color="error" />,
      primary: "Supprimer le compte",
      action: <Button variant="outlined" color="error" size="small">Supprimer</Button>
    }
  ];

  return (
    <Box
      sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh', 
        p: isMobile ? 2 : 4,
        background: 'linear-gradient(135deg, #97bbf025 0%, #e4e8f040 100%)'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%', 
          maxWidth: isTablet ? 600 : 700, 
          borderRadius: 4, 
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', 
          position: 'relative',
          '&:before': {
            content: '""', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            height: isMobile ? 80 : 120, 
            background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)', 
            zIndex: 0
          }
        }}
      >
        <CardContent
          sx={{ 
            p: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            position: 'relative', 
            zIndex: 1 
          }}
        >
          {/* Bouton retour pour mobile en mode settings */}
          {mode === "settings" && isMobile && (
            <Box sx={{ alignSelf: 'flex-start', p: 2 }}>
              <IconButton onClick={() => setMode("view")}>
                <ArrowBack />
              </IconButton>
            </Box>
          )}

          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Avatar
            src={previewImage}
            alt={formValues.name}
            sx={{
              width: isMobile ? 100 : 140, 
              height: isMobile ? 100 : 140, 
              mt: isMobile ? 6 : 8, 
              mb: 2,
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': mode === "edit" ? { transform: 'scale(1.05)' } : {}
            }}
          />

          {/* Boutons avatar en mode édition */}
          {mode === "edit" && (
            <Fade in={mode === "edit"}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <label htmlFor="avatar-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    startIcon={<CloudUpload />}
                    sx={{ borderRadius: 20, textTransform: 'none' }}
                  >
                    Changer
                  </Button>
                </label>
                <Button
                  onClick={handleRemoveAvatar}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  color="error"
                  startIcon={<Delete />}
                  sx={{ borderRadius: 20, textTransform: 'none' }}
                >
                  Supprimer
                </Button>
              </Stack>
            </Fade>
          )}

          {avatarError && (
            <Typography color="error" variant="caption" sx={{ mb: 1 }}>
              {avatarError}
            </Typography>
          )}

          {/* Mode édition ou affichage du nom */}
          {mode === "edit" ? (
            <TextField
              name="name"
              label="Nom complet"
              value={formValues.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2, maxWidth: 400, px: 3 }}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
          ) : mode !== "settings" && (
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                px: 3,
                wordBreak: 'break-word'
              }}
            >
              {user.name}
            </Typography>
          )}

          {mode !== "settings" && (
            <Chip
              label={user.role}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                mb: 3, 
                px: 2, 
                py: 1, 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                borderRadius: 1 
              }}
            />
          )}

          {mode !== "settings" && (
            <Divider sx={{ width: '80%', my: 1 }} />
          )}

          {/* Email */}
          {mode !== "settings" && (
            <Stack spacing={2} sx={{ width: '100%', mb: 3, px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mode === "edit" ? (
                  <TextField
                    name="email"
                    label="Email"
                    value={formValues.email}
                    onChange={handleChange}
                    fullWidth
                    sx={{ maxWidth: 400 }}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                  />
                ) : (
                  <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    {user.email}
                    <VerifiedUser color="success" sx={{ ml: 1, fontSize: '1rem' }} />
                  </Typography>
                )}
              </Box>
            </Stack>
          )}

          {/* Mode paramètres */}
          {mode === "settings" && (
            <Box sx={{ width: '100%', px: isMobile ? 2 : 3, pb: 3 }}>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                gutterBottom 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 700,
                  mt: isMobile ? 0 : 2
                }}
              >
                <Security fontSize={isMobile ? 'medium' : 'large'} />
                Paramètres du compte
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List sx={{ width: '100%' }}>
                {settingsItems.map((item, index) => (
                  <ListItem 
                    key={index}
                    secondaryAction={item.action}
                    sx={{
                      py: 1,
                      px: 0,
                      alignItems: 'center'
                    }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                gutterBottom 
                sx={{ 
                  mt: 3,
                  color: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 700
                }}
              >
                <WarningIcon color="error" fontSize={isMobile ? 'medium' : 'large'} />
                Zone dangereuse
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'error.light' }} />
              
              <List sx={{ width: '100%' }}>
                {dangerZoneItems.map((item, index) => (
                  <ListItem 
                    key={index}
                    secondaryAction={item.action}
                    sx={{
                      py: 1,
                      px: 0,
                      alignItems: 'center'
                    }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      primaryTypographyProps={{ 
                        fontWeight: 500, 
                        color: 'error.main' 
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              {isMobile ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => setMode("view")}
                    startIcon={<ArrowBack />}
                  >
                    Retour
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="contained" 
                  sx={{ mt: 3 }} 
                  onClick={() => setMode("view")}
                >
                  Retour au profil
                </Button>
              )}
            </Box>
          )}

          {/* Boutons d'action selon le mode */}
          {mode === "edit" && (
            <Stack 
              direction={isMobile ? 'column' : 'row'} 
              spacing={2} 
              justifyContent="center" 
              sx={{ 
                mb: 3,
                width: '100%',
                px: 3
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                startIcon={isSaving ? <CircularProgress size={18} /> : <Save />}
                onClick={handleSave}
                disabled={isSaving}
                size={isMobile ? 'medium' : 'large'}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth={isMobile}
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isSaving}
                size={isMobile ? 'medium' : 'large'}
              >
                Annuler
              </Button>
            </Stack>
          )}

          {mode === "view" && (
            <Stack 
              direction={isMobile ? 'column' : 'row'} 
              spacing={2} 
              sx={{ 
                mb: 3,
                width: '100%',
                px: 3
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                startIcon={<Edit />}
                onClick={() => setMode("edit")}
                size={isMobile ? 'medium' : 'large'}
              >
                Modifier le profil
              </Button>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                onClick={() => setMode("settings")}
                size={isMobile ? 'medium' : 'large'}
              >
                Paramètres
              </Button>
            </Stack>
          )}
        </CardContent>
      </Paper>
    </Box>
  );
};

export default Profile;