import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const ProductFormModal = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    code: '',
    category: '',
    price: '',
    currentStock: '',
    alertLevel: '',
    description: '',
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        code: product.code || '',
        category: product.category || '',
        price: product.price || '',
        currentStock: product.currentStock || '',
        alertLevel: product.alertLevel || '',
        description: product.description || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nom du produit"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Code produit"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Catégorie"
              onChange={handleChange}
            >
              <MenuItem value="Electronics">Électronique</MenuItem>
              <MenuItem value="Clothing">Vêtements</MenuItem>
              <MenuItem value="Food">Alimentation</MenuItem>
              <MenuItem value="Other">Autre</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Prix"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Stock actuel"
            name="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Niveau d'alerte"
            name="alertLevel"
            type="number"
            value={formData.alertLevel}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;