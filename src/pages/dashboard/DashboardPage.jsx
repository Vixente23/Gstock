import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const DashboardPage = () => {
  // These would normally come from API calls
  const stats = [
    { title: 'Produits en stock', value: 1245, icon: <InventoryIcon fontSize="large" /> },
    { title: 'Alertes de stock', value: 23, icon: <WarningIcon fontSize="large" /> },
    { title: 'Mouvements aujourd\'hui', value: 56, icon: <TrendingUpIcon fontSize="large" /> },
    { title: 'Fournisseurs actifs', value: 12, icon: <PeopleIcon fontSize="large" /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <div>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </div>
                  <Box
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;