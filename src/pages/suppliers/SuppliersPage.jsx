import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  Fade,
  Paper,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Avatar,
  Badge,
  Stack,           // ← ajouté
  TablePagination   // ← ajouté
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  LocalShipping as LocalShippingIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const SuppliersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    product: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formValues.name.trim()) {
      setFormError('Le nom du fournisseur est requis');
      return;
    }
    setFormError('');
    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (selectedFile) {
        formData.append('productImage', selectedFile);
      }
      const response = await axios.post('/suppliers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuppliers(prev => [...prev, response.data]);
      setOpenModal(false);
      setFormValues({ name: '', contactPerson: '', email: '', phone: '', product: '' });
      setSelectedFile(null);
    } catch (err) {
      setFormError("Erreur lors de l'ajout");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderContactCell = (supplier) => {
    return (
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {supplier.contactPerson || '-'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {supplier.email}
        </Typography>
      </Box>
    );
  };

  const renderPhoneCell = (phone) => {
    return (
      <Box sx={{ whiteSpace: 'nowrap' }}>
        {phone ? (
          <Button 
            variant="text" 
            size="small" 
            href={`tel:${phone}`}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500 
            }}
          >
            {phone}
          </Button>
        ) : '-'}
      </Box>
    );
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 3
      }}
    >
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: isMobile ? 2 : 3,
          borderRadius: 3,
          mb: 3,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalShippingIcon 
              sx={{ 
                fontSize: isMobile ? 32 : 40,
                color: 'primary.main'
              }} 
            />
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              fontWeight={700}
            >
              Fournisseurs
            </Typography>
            <Chip 
              label={`${suppliers.length} fournisseurs`} 
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Stack 
            direction="row" 
            spacing={1}
            sx={{
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 2 : 0
            }}
          >
            <Tooltip title="Filtrer">
              <IconButton 
                onClick={() => setFilterOpen(true)}
                sx={{ 
                  display: isMobile ? 'flex' : 'none',
                  bgcolor: 'background.default'
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Actualiser">
              <IconButton 
                onClick={fetchSuppliers}
                sx={{ bgcolor: 'background.default' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {isMobile ? 'Ajouter' : 'Nouveau fournisseur'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Table Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Table 
            size={isMobile ? 'small' : 'medium'}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>}
                <TableCell sx={{ fontWeight: 700 }}>Téléphone</TableCell>
                {!isTablet && <TableCell sx={{ fontWeight: 700 }}>Produit</TableCell>}
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Chargement des fournisseurs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2">
                      Aucun fournisseur trouvé
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={() => setOpenModal(true)}
                      sx={{ mt: 1 }}
                    >
                      Ajouter un fournisseur
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                suppliers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((supplier, idx) => (
                    <TableRow 
                      key={supplier.id} 
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        {supplier.name}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {renderContactCell(supplier)}
                        </TableCell>
                      )}
                      <TableCell>
                        {renderPhoneCell(supplier.phone)}
                      </TableCell>
                      {!isTablet && (
                        <TableCell>
                          {supplier.product || '-'}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Modifier" arrow>
                            <IconButton 
                              size="small"
                              color="primary"
                            >
                              <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer" arrow>
                            <IconButton 
                              size="small"
                              color="error"
                            >
                              <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </Tooltip>
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
          count={suppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? 'Lignes:' : 'Lignes par page:'}
          sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        />
      </Paper>

      {/* Add Supplier Dialog */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            Ajouter un fournisseur
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nom du fournisseur"
              fullWidth
              value={formValues.name}
              onChange={e => setFormValues({ ...formValues, name: e.target.value })}
              required
            />
            <TextField
              label="Personne de contact"
              fullWidth
              value={formValues.contactPerson}
              onChange={e => setFormValues({ ...formValues, contactPerson: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={formValues.email}
              onChange={e => setFormValues({ ...formValues, email: e.target.value })}
            />
            <TextField
              label="Téléphone"
              fullWidth
              value={formValues.phone}
              onChange={e => setFormValues({ ...formValues, phone: e.target.value })}
            />
            <TextField
              label="Produit"
              fullWidth
              value={formValues.product}
              onChange={e => setFormValues({ ...formValues, product: e.target.value })}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
            >
              {selectedFile ? selectedFile.name : 'Ajouter une image'}
              <input
                type="file"
                hidden
                onChange={e => setSelectedFile(e.target.files[0])}
              />
            </Button>
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuppliersPage;
