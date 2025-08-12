import React, { useState } from 'react';
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
  Fade
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  CloudUpload,
  Delete,
  VerifiedUser
} from '@mui/icons-material';

const defaultAvatar = '/logo192.png';

const initialUser = {
  name: 'Vixente',
  email: 'vixente@example.com',
  role: 'Administrateur',
  avatar: defaultAvatar,
};

const Profile = () => {
  const [mode, setMode] = useState("view"); // "view" | "edit" | "settings"
  const [user, setUser] = useState(initialUser);
  const [formValues, setFormValues] = useState(initialUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialUser.avatar);
  const [avatarError, setAvatarError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <Box
      sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)', p: 3
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%', maxWidth: 700, borderRadius: 4, overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', position: 'relative',
          '&:before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0,
            height: 120, background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)', zIndex: 0
          }
        }}
      >
        <CardContent
          sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
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
              width: 140, height: 140, mt: 8, mb: 2,
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' }
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
                    size="small"
                    startIcon={<CloudUpload />}
                    sx={{ borderRadius: 20, textTransform: 'none', fontSize: '0.75rem' }}
                  >
                    Changer
                  </Button>
                </label>
                <Button
                  onClick={handleRemoveAvatar}
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  sx={{ borderRadius: 20, textTransform: 'none', fontSize: '0.75rem' }}
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
              size="small"
            />
          ) : (
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, px: 3 }}>
              {user.name}
            </Typography>
          )}

          <Chip
            label={user.role}
            color="primary"
            size="small"
            sx={{ mb: 3, px: 2, py: 1, fontSize: '0.8rem', fontWeight: 600, borderRadius: 1 }}
          />

          <Divider sx={{ width: '80%', my: 1 }} />

          {/* Email */}
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
                  size="small"
                />
              ) : (
                <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  {user.email}
                  <VerifiedUser color="success" sx={{ ml: 1, fontSize: '1rem' }} />
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Mode paramètres */}
          {mode === "settings" && (
            <Box sx={{ width: '100%', px: 3, pb: 3 }}>
              <Typography variant="h5" gutterBottom>Paramètres du compte</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Button variant="outlined">Changer le mot de passe</Button>
                <Button variant="outlined">Activer la double authentification</Button>
                <Button variant="outlined" color="error">Supprimer le compte</Button>
              </Stack>
              <Button variant="contained" sx={{ mt: 3 }} onClick={() => setMode("view")}>
                Retour
              </Button>
            </Box>
          )}

          {/* Boutons d'action selon le mode */}
          {mode === "edit" && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={isSaving ? <CircularProgress size={18} /> : <Save />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isSaving}
              >
                Annuler
              </Button>
            </Stack>
          )}

          {mode === "view" && (
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => setMode("edit")}
              >
                Modifier le profil
              </Button>
              <Button
                variant="outlined"
                onClick={() => setMode("settings")}
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
