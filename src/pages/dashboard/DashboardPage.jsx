import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import axios from '../../api/axios';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [expiringLots, setExpiringLots] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Produits en stock', value: 1245, icon: <InventoryIcon fontSize="large" />, route: '/products' },
    { title: 'Alertes de stock', value: 23, icon: <WarningIcon fontSize="large" />, route: '/products?alert=1' },
    { title: 'Mouvements aujourd\'hui', value: 56, icon: <TrendingUpIcon fontSize="large" />, route: '/stock' },
    { title: 'Fournisseurs actifs', value: 12, icon: <PeopleIcon fontSize="large" />, route: '/suppliers' },
  ]);

  useEffect(() => {
    const fetchExpiringProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        const products = response.data;
        // Filtrer les produits alimentaires qui expirent dans 10 jours
        const now = new Date();
        const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
        const expiring = products.filter(
          p => p.category === 'Food' && p.expiryDate && new Date(p.expiryDate) <= inTenDays && new Date(p.expiryDate) >= now
        );
        setExpiringLots(expiring);
      } catch (err) {
        setExpiringLots([]);
      }
    };
    fetchExpiringProducts();
  }, []);

  return (
    <Box>
      {expiringLots.length > 0 && (
        <Card sx={{ mb: 3, backgroundColor: '#fffbe6', border: '1px solid #ffe082' }}>
          <CardContent>
            <Typography variant="h6" color="warning.main">
              {expiringLots.length} lots de produits alimentaires vont expirer dans 10 jours. Pensez à les mettre en promo.
            </Typography>
          </CardContent>
        </Card>
      )}
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(stat.route)}
            >
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