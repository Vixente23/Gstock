import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Avatar,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import axios from '../../api/axios';

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

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{
      minHeight: '100vh',
      px: { xs: 1, sm: 4 },
      py: { xs: 2, sm: 5 },
      background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}>
      {/* Notification lots expirants */}
      {expiringLots.length > 0 && (
        <Card sx={{ mb: 3, background: 'linear-gradient(90deg, #483aa0 0%, #7965c1 100%)', border: '1px solid #7965c1', boxShadow: 4, maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              {expiringLots.length} lots de produits alimentaires vont expirer dans 10 jours. Pensez à les mettre en promo.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 4, width: '100%', maxWidth: 1200 }}>
        <Box>
          <Typography variant={{ xs: 'h5', sm: 'h3' }} fontWeight={700} sx={{ color: '#fff', letterSpacing: '-1px' }}>
            Tableau de bord
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#7965c1', fontWeight: 500 }}>
            Vue synthétique de votre activité et de vos stocks
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={{ xs: 2, sm: 4 }} sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => navigate(stat.route)}
              sx={{
                cursor: 'pointer',
                borderRadius: 5,
                boxShadow: 6,
                background: 'linear-gradient(120deg, #483aa0 0%, #7965c1 100%)',
                p: 0,
                transition: 'transform 0.18s, box-shadow 0.18s',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: 12,
                  background: 'linear-gradient(120deg, #7965c1 0%, #483aa0 100%)',
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'linear-gradient(135deg, #0e2148 0%, #7965c1 100%)', color: '#fff', width: 56, height: 56, boxShadow: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#7965c1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>{stat.value}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;