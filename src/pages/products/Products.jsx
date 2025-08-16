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
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ProductFormModal from '../../components/products/ProductFormModal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import axios from '../../api/axios';

const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
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
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
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
        await axios.put(`/products/${currentProduct.id}`, productData);
        setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...productData } : p));
      } else {
        const response = await axios.post('/products', productData);
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
      await axios.delete(`/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const renderTableCellContent = (content) => {
    return (
      <Typography variant="body2" noWrap sx={{ maxWidth: isMobile ? '100px' : 'none' }}>
        {content}
      </Typography>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 1 : 3, px: isMobile ? 1 : 3 }}>
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
          Gestion des Produits
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: isMobile && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setFilterOpen(true)}>
                      <FilterIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            {user?.role === 'admin' && (
              <Button
                fullWidth={isMobile}
                variant="contained"
                color="primary"
                startIcon={!isMobile && <AddIcon />}
                onClick={() => handleOpenModal()}
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? <AddIcon /> : 'Ajouter Produit'}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ overflow: 'auto' }}>
        <TableContainer>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                {!isMobile && <TableCell>Nom</TableCell>}
                {!isTablet && <TableCell>Catégorie</TableCell>}
                <TableCell>Stock</TableCell>
                <TableCell>Prix</TableCell>
                {!isMobile && <TableCell>Alerte</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2">Aucun produit trouvé</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{renderTableCellContent(product.code)}</TableCell>
                      {!isMobile && (
                        <TableCell>{renderTableCellContent(product.name)}</TableCell>
                      )}
                      {!isTablet && (
                        <TableCell>{renderTableCellContent(product.category)}</TableCell>
                      )}
                      <TableCell>{product.currentStock}</TableCell>
                      <TableCell>{product.price?.toFixed(2)} €</TableCell>
                      {!isMobile && (
                        <TableCell>{product.alertLevel}</TableCell>
                      )}
                      <TableCell>
                        <Tooltip title="Modifier">
                          <IconButton 
                            size={isMobile ? 'small' : 'medium'}
                            onClick={() => handleOpenModal(product)}
                          >
                            <EditIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </Tooltip>
                        {user?.role === 'admin' && (
                          <Tooltip title="Supprimer">
                            <IconButton 
                              size={isMobile ? 'small' : 'medium'}
                              onClick={() => handleOpenDeleteDialog(product)}
                            >
                              <DeleteIcon color="error" fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? 'Lignes:' : 'Lignes par page:'}
          labelDisplayedRows={({ from, to, count }) => 
            isMobile ? `${from}-${to}` : `${from}-${to} sur ${count}`
          }
        />
      </Card>

      {/* Filtres mobiles */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Filtrer les produits</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Rechercher"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* Ajouter d'autres filtres ici si nécessaire */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

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
        title="Supprimer Produit"
        message={`Êtes-vous sûr de vouloir supprimer ${productToDelete?.name} ?`}
      />
    </Container>
  );
};

export default ProductsPage;