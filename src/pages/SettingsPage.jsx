import React from 'react';
import { Box, Typography, Divider, Stack, Button } from '@mui/material';

const SettingsPage = () => (
  <Box sx={{ width: '100%', px: 3, py: 4 }}>
    <Typography variant="h5" gutterBottom>Paramètres du compte</Typography>
    <Divider sx={{ mb: 2 }} />
    <Stack spacing={2}>
      <Button variant="outlined">Changer le mot de passe</Button>
      <Button variant="outlined">Activer la double authentification</Button>
      <Button variant="outlined" color="error">Supprimer le compte</Button>
    </Stack>
  </Box>
);

export default SettingsPage;
