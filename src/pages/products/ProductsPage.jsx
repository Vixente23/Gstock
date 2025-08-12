import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import MicIcon from '@mui/icons-material/Mic';
import { useAuth } from '../../contexts/AuthContext';
import ProductFormModal from '../../components/product/ProductFormModal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import axios from '../../api/axios';

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recognizing, setRecognizing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        // Update existing product
        await axios.put(`/api/products/${currentProduct.id}`, productData);
        setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...productData } : p));
      } else {
        // Create new product
        const response = await axios.post('/api/products', productData);
        setProducts([...products, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/api/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.start();
    setRecognizing(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      // Expressions régulières pour plusieurs phrases
      // Exemples reconnus : "ajoute 2 téléphones", "ajouter cinq stylos", "rajoute 10 souris"
      const regex = /(ajoute|rajoute|ajouter)\s+(\d+|\w+)\s+([\w\s]+)/;
      const match = transcript.match(regex);

      // Conversion des nombres écrits en lettres
      const numberWords = {
        'un': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5, 'six': 6, 'sept': 7,
        'huit': 8, 'neuf': 9, 'dix': 10, 'onze': 11, 'douze': 12, 'vingt': 20
      };

      if (match) {
        let qty = parseInt(match[2], 10);
        if (isNaN(qty)) {
          qty = numberWords[match[2]] || 1; // Par défaut 1 si non reconnu
        }
        const productName = match[3].trim();

        // Recherche du produit le plus proche (nom inclusif, insensible à la casse)
        const product = products.find(p =>
          p.name.toLowerCase().includes(productName) ||
          productName.includes(p.name.toLowerCase())
        );
        if (product) {
          const updatedProduct = { ...product, currentStock: Number(product.currentStock) + qty };
          try {
            await axios.put(`/api/products/${product.id}`, updatedProduct);
            setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
            alert(`Stock mis à jour : +${qty} ${product.name}`);
          } catch (err) {
            alert("Erreur lors de la mise à jour du stock.");
          }
        } else {
          alert(`Produit "${productName}" non trouvé.`);
        }
      } else {
        alert("Commande vocale non reconnue. Essayez : 'ajoute deux téléphones', 'rajoute cinq stylos'...");
      }
      setRecognizing(false);
    };

    recognition.onerror = () => {
      alert("Erreur de reconnaissance vocale.");
      setRecognizing(false);
    };
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search products..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              startIcon={<MicIcon />}
              onClick={handleVoiceInput}
              disabled={recognizing}
            >
              Saisie vocale
            </Button>
          </Box>
        </Box>
      </Box>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Alert Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.currentStock}</TableCell>
                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                    <TableCell>{product.alertLevel}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(product)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      {user?.role === 'admin' && (
                        <IconButton onClick={() => handleOpenDeleteDialog(product)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <ProductFormModal
        open={openModal}
        onClose={handleCloseModal}
        product={currentProduct}
        onSave={handleSaveProduct}
      />

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete ${productToDelete?.name}?`}
      />
    </Container>
  );
};

export default ProductsPage;