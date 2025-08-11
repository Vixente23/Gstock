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
  Typography 
} from '@mui/material';
import axios from '../../api/axios';

const StockMovementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get('/stock/movements');
        setMovements(response.data);
      } catch (err) {
        console.error('Error fetching stock movements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

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
          <div>Chargement...</div>
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
                    <TableCell>{new Date(movement.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{movement.product?.name}</TableCell>
                    <TableCell>{movement.movementType}</TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{movement.reference || '-'}</TableCell>
                    <TableCell>{movement.user?.firstName} {movement.user?.lastName}</TableCell>
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