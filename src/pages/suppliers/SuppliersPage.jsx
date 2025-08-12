import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import axios from 'axios';
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
import AddIcon from '@mui/icons-material/Add';

const SuppliersPage = () => {
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

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('/suppliers');
        setSuppliers(response.data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Fournisseurs
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
          onClick={() => setOpenModal(true)}
        >
          Ajouter un fournisseur
        </Button>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Ajouter un fournisseur</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom du fournisseur"
              type="text"
              fullWidth
              value={formValues.name}
              onChange={e => setFormValues({ ...formValues, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Contact"
              type="text"
              fullWidth
              value={formValues.contactPerson}
              onChange={e => setFormValues({ ...formValues, contactPerson: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={formValues.email}
              onChange={e => setFormValues({ ...formValues, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Téléphone"
              type="text"
              fullWidth
              value={formValues.phone}
              onChange={e => setFormValues({ ...formValues, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Produit fourni"
              type="text"
              fullWidth
              value={formValues.product}
              onChange={e => setFormValues({ ...formValues, product: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ mr: 2 }}
              >
                Choisir une photo du produit
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {selectedFile && <Typography variant="body2">{selectedFile.name}</Typography>}
            </Box>
            {formError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>{formError}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="inherit">Annuler</Button>
            <Button 
              onClick={async () => {
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
              }}
              variant="contained"
              color="primary"
            >Ajouter</Button>
          </DialogActions>
        </Dialog>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson || '-'}</TableCell>
                    <TableCell>{supplier.email || '-'}</TableCell>
                    <TableCell>{supplier.phone || '-'}</TableCell>
                    <TableCell>
                      <Button size="small">Modifier</Button>
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

export default SuppliersPage;