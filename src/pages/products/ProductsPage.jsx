import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
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
  Stack,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Badge,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mic as MicIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ProductFormModal from '../../components/product/ProductFormModal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import axios from '../../api/axios';

const ProductsPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // State management
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Data processing functions
  function getStockRecommendations(products) {
    return products
      .filter(p => Number(p.currentStock) <= Number(p.alertLevel))
      .map(p => ({
        product: p,
        message: `Stock faible: ${p.name}`,
        details: `Il reste ${p.currentStock} unités (seuil: ${p.alertLevel})`
      }));
  }

  function getAnomalyNotifications(products) {
    const anomalies = [];
    products.forEach(p => {
      if (p.lastOut && p.lastOut > 30 && !p.lastSale) {
        anomalies.push({
          product: p,
          message: `Anomalie: ${p.name}`,
          details: `Sortie de ${p.lastOut} unités sans vente enregistrée`
        });
      }
    });
    return anomalies;
  }

  const anomalyNotifications = getAnomalyNotifications(products);
  const stockRecommendations = getStockRecommendations(products);

  // Effects
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const allNotifs = [
      ...stockRecommendations.map(r => r.message),
      ...anomalyNotifications.map(a => a.message),
    ];
    if (allNotifs.length > 0) {
      localStorage.setItem('stock_notifications', JSON.stringify(allNotifs));
    } else {
      localStorage.removeItem('stock_notifications');
    }
  }, [stockRecommendations, anomalyNotifications]);

  // Handlers
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleSaveProduct = (savedProduct) => {
    if (savedProduct.id) {
      setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      setProducts([...products, savedProduct]);
    }
    setOpenModal(false);
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/api/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;

    setRecognizing(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
      setRecognizing(false);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.start();
  };

  // Render helpers
  const renderStockCell = (stock, alertLevel) => {
    const isLowStock = Number(stock) <= Number(alertLevel);
    return (
      <Chip 
        avatar={<Avatar>{stock}</Avatar>}
        label={isLowStock ? 'Faible' : 'OK'}
        color={isLowStock ? 'error' : 'success'}
        variant="outlined"
        size={isMobile ? 'small' : 'medium'}
        sx={{ fontWeight: 700 }}
      />
    );
  };

  const renderPriceCell = (price) => {
    return (
      <Box sx={{ fontWeight: 700, color: theme.palette.success.dark }}>
        ${price?.toFixed(2)}
      </Box>
    );
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: isMobile ? 1 : 3,
        px: isMobile ? 0.5 : 3,
        overflow: 'hidden'
      }}
    >
      {/* Notifications Section */}
      {(stockRecommendations.length > 0 || anomalyNotifications.length > 0) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Alertes et notifications
          </Typography>
          <Stack 
            spacing={1} 
            direction={isMobile ? 'column' : 'row'} 
            sx={{ 
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {stockRecommendations.map(({ product, message, details }) => (
              <Tooltip key={product.id} title={details} arrow>
                <Chip
                  label={isMobile ? message : `${message} - ${details}`}
                  color="warning"
                  icon={<InventoryIcon fontSize="small" />}
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: isMobile ? 12 : 14,
                    py: 1,
                    bgcolor: 'warning.light',
                    color: 'warning.contrastText'
                  }}
                />
              </Tooltip>
            ))}
            {anomalyNotifications.map(({ product, message, details }) => (
              <Tooltip key={product.id + '-anomaly'} title={details} arrow>
                <Chip
                  label={isMobile ? message : `${message} - ${details}`}
                  color="error"
                  icon={<WarningIcon fontSize="small" />}
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: isMobile ? 12 : 14,
                    py: 1,
                    bgcolor: 'error.light',
                    color: 'error.contrastText'
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        </Box>
      )}

      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 3, 
          p: isMobile ? 2 : 3,
          borderRadius: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'} 
              fontWeight={700} 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <InventoryIcon color="primary" />
              Gestion des produits
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredProducts.length} produits trouvés
            </Typography>
          </Box>

          <Stack 
            direction={isMobile ? 'column-reverse' : 'row'} 
            spacing={1} 
            sx={{ 
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 2 : 0
            }}
          >
            <TextField
              fullWidth={isMobile}
              variant="outlined"
              placeholder="Rechercher..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: isMobile && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleVoiceInput} 
                      disabled={recognizing}
                      size="small"
                    >
                      <Badge color="error" variant="dot" invisible={!recognizing}>
                        <MicIcon fontSize="small" />
                      </Badge>
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ 
                width: isMobile ? '100%' : 300,
                bgcolor: 'background.default'
              }}
            />

            {!isMobile && (
              <Tooltip title="Recherche vocale" arrow>
                <IconButton 
                  onClick={handleVoiceInput} 
                  disabled={recognizing}
                  sx={{ 
                    bgcolor: 'background.default',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Badge color="error" variant="dot" invisible={!recognizing}>
                    <MicIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{
                minWidth: 'auto',
                px: isMobile ? 1 : 2,
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? <AddIcon fontSize="small" /> : 'Nouveau'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Products Table Section */}
      <Card 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 2
        }}
      >
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table 
            size={isMobile ? 'small' : 'medium'}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>}
                {!isTablet && <TableCell sx={{ fontWeight: 700 }}>Catégorie</TableCell>}
                <TableCell align="center" sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Prix</TableCell>
                {!isMobile && <TableCell align="center" sx={{ fontWeight: 700 }}>Alerte</TableCell>}
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Chargement des produits...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2">
                      Aucun produit trouvé
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={() => handleOpenModal()}
                      sx={{ mt: 1 }}
                    >
                      Ajouter un produit
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow 
                      key={product.id} 
                      hover 
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>{product.code}</TableCell>
                      {!isMobile && (
                        <TableCell sx={{ fontWeight: 600 }}>
                          <Tooltip title={product.description || 'Aucune description'} arrow>
                            <span>{product.name}</span>
                          </Tooltip>
                        </TableCell>
                      )}
                      {!isTablet && <TableCell>{product.category}</TableCell>}
                      <TableCell align="center">
                        {renderStockCell(product.currentStock, product.alertLevel)}
                      </TableCell>
                      <TableCell align="center">
                        {renderPriceCell(product.price)}
                      </TableCell>
                      {!isMobile && (
                        <TableCell align="center">
                          <Chip 
                            label={product.alertLevel} 
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Modifier" arrow>
                            <IconButton 
                              onClick={() => handleOpenModal(product)} 
                              size="small"
                              color="primary"
                            >
                              <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </Tooltip>
                          {user?.role === 'admin' && (
                            <Tooltip title="Supprimer" arrow>
                              <IconButton 
                                onClick={() => handleOpenDeleteDialog(product)} 
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
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
          sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default'
          }}
        />
      </Card>

      {/* Filter Dialog for Mobile */}
      <Dialog 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)} 
        fullScreen={isMobile}
      >
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
          {/* Additional filters can be added here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Fermer</Button>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterOpen(false);
            }}
            color="error"
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
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
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer "${productToDelete?.name}" ?`}
      />
    </Container>
  );
}

export default ProductsPage;