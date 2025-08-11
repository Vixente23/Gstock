import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          404 - Page non trouvée
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Retour à l'accueil
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;