import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Grid, 
  Typography 
} from '@mui/material';
import axios from '../../api/axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Détails du produit
        </Typography>
        <Card>
          <Grid container>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                height="300"
                image={product.imageUrl || '/placeholder-product.png'}
                alt={product.name}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Code: {product.code}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Catégorie: {product.category}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Stock actuel: {product.currentStock}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Niveau d'alerte: {product.alertLevel}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Prix: ${product.price?.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {product.description || 'Aucune description disponible'}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button variant="contained" color="primary">
                    Modifier
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;