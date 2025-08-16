import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  CircularProgress
} from '@mui/material';
import axios from '../../api/axios';

const StockMovementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get('/stock/movements');
        setMovements(response.data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des mouvements de stock:', err);
        setError("Impossible de charger les mouvements de stock.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return '-';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mouvements de stock
        </Typography>
        
        <Button variant="contained" sx={{ mb: 3 }}>
          Ajouter un mouvement
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        ) : movements.length === 0 ? (
          <Typography sx={{ mt: 2 }}>Aucun mouvement de stock trouvé.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Produit</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Référence</TableCell>
                  <TableCell>Utilisateur</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{formatDate(movement.createdAt)}</TableCell>
                    <TableCell>{movement.product?.name || '-'}</TableCell>
                    <TableCell>{movement.movementType || '-'}</TableCell>
                    <TableCell>{movement.quantity ?? '-'}</TableCell>
                    <TableCell>{movement.reference || '-'}</TableCell>
                    <TableCell>
                      {movement.user 
                        ? `${movement.user.firstName || ''} ${movement.user.lastName || ''}`.trim()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default StockMovementsPage;
