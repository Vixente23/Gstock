import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  Divider,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack
} from '@mui/material';
import { Edit, Save, Cancel, Visibility, VisibilityOff, CloudUpload } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Mock user data
const currentUser = {
  name: 'Vixente',
  email: 'vixente@example.com',
  role: 'Administrateur',
  avatar: '/logo192.png',
  phone: '+1234567890',
  address: '123 Rue du Stock, Paris'
};

const ProfileEdit = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(currentUser.avatar);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Le nom est obligatoire'),
    email: Yup.string().email('Email invalide').required('Email obligatoire'),
    phone: Yup.string().matches(/^\+?[0-9]+$/, 'Numéro de téléphone invalide'),
    address: Yup.string(),
    currentPassword: Yup.string().min(8, 'Minimum 8 caractères'),
    newPassword: Yup.string().when('currentPassword', {
      is: val => val && val.length > 0,
      then: Yup.string().required('Nouveau mot de passe requis').min(8, 'Minimum 8 caractères'),
      otherwise: Yup.string()
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      currentPassword: '',
      newPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Profile updated:', values);
      if (selectedFile) {
        console.log('New avatar uploaded:', selectedFile.name);
      }
      setIsSubmitting(false);
      // Show success message or redirect
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setSelectedFile(null);
    setPreviewImage(currentUser.avatar);
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: isMobile ? 2 : 3,
      width: '100%'
    }}>
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Modifier le profil
      </Typography>
      
      <Paper elevation={3} sx={{ 
        p: isMobile ? 2 : 4, 
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Grid container spacing={isMobile ? 2 : 4}>
          {/* Left Column - Avatar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: isMobile ? 3 : 0
            }}>
              <Avatar 
                src={previewImage} 
                sx={{ 
                  width: isMobile ? 100 : 150, 
                  height: isMobile ? 100 : 150, 
                  mb: 2,
                  border: '3px solid',
                  borderColor: 'primary.main'
                }}
              />
              
              <input
                accept="image/*"
                id="avatar-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              <label htmlFor="avatar-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                  size={isMobile ? 'small' : 'medium'}
                  fullWidth={isMobile}
                >
                  Changer la photo
                </Button>
              </label>
              
              <Typography 
                variant="body2" 
                color="textSecondary" 
                align="center"
                sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
              >
                Formats supportés: JPG, PNG
                <br />
                Taille max: 5MB
              </Typography>
            </Box>
          </Grid>
          
          {/* Right Column - Form */}
          <Grid item xs={12} md={8}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={isMobile ? 2 : 3}>
                {/* Personal Info Section */}
                <Grid item xs={12}>
                  <Typography 
                    variant={isMobile ? 'subtitle1' : 'h6'} 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                    Informations personnelles
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Nom complet"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Téléphone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Adresse"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                
                {/* Password Section */}
                <Grid item xs={12}>
                  <Typography 
                    variant={isMobile ? 'subtitle1' : 'h6'} 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                    Changer le mot de passe
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    Laissez vide si vous ne souhaitez pas changer le mot de passe
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="currentPassword"
                    name="currentPassword"
                    label="Mot de passe actuel"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size={isMobile ? 'small' : 'medium'}
                          >
                            {showPassword ? <VisibilityOff fontSize={isMobile ? 'small' : 'medium'} /> : <Visibility fontSize={isMobile ? 'small' : 'medium'} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="newPassword"
                    name="newPassword"
                    label="Nouveau mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                
                {/* Actions */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Stack 
                    direction={isMobile ? 'column-reverse' : 'row'} 
                    spacing={2} 
                    justifyContent="flex-end"
                    sx={{ width: '100%' }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      fullWidth={isMobile}
                      size={isMobile ? 'medium' : 'large'}
                    >
                      Annuler
                    </Button>
                    
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                      disabled={isSubmitting || !formik.dirty}
                      fullWidth={isMobile}
                      size={isMobile ? 'medium' : 'large'}
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;