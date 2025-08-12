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
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const ProductFormModal = ({ open, onClose, product, onSave }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = React.useState({
    name: '',
    images: null,
    code: '',
    category: '',
    price: '',
    currentStock: '',
    alertLevel: '',
    description: '',
    expiryDate: '',
  });

  const [fileName, setFileName] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState(null);

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        images: null,
        code: product.code || '',
        category: product.category || '',
        price: product.price || '',
        currentStock: product.currentStock || '',
        alertLevel: product.alertLevel || '',
        description: product.description || '',
        expiryDate: product.expiryDate || '',
      });
      setFileName('');
      setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: file,
      }));
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ fontSize: '1.2rem' }}>
        {product ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          mt: 2, 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: 3 
        }}>
          {/* Section Image */}
          <Box sx={{ 
            width: isMobile ? '100%' : '40%', 
            border: '1px dashed #ccc', 
            p: 2, 
            borderRadius: 1 
          }}>
            <Typography variant="h6" gutterBottom>Image du Produit</Typography>
            
            <Box 
              sx={{ 
                border: '1px dashed #ccc', 
                p: 3, 
                textAlign: 'center',
                mb: 2,
                backgroundColor: '#f9f9f9',
                borderRadius: 1,
                minHeight: isMobile ? 'auto' : '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body2" gutterBottom>
                Glissez-déposez votre image ici
                <br />
                ou cliquez pour parcourir vos fichiers
              </Typography>
              
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="image-upload">
                <Button 
                  variant="outlined" 
                  component="span" 
                  sx={{ mt: 1, mx: 'auto' }}
                >
                  Parcourir
                </Button>
              </label>
              
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                PNG, JPG, GIF jusqu'à 10MB
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>Aperçu</Typography>
            <Box 
              sx={{ 
                height: 100, 
                border: '1px solid #eee', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%' }} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Aucune image sélectionnée
                </Typography>
              )}
            </Box>
          </Box>

          {/* Section Informations */}
          <Box sx={{ width: isMobile ? '100%' : '60%' }}>
            <Typography variant="h6" gutterBottom>Informations du Produit</Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nom du produit *"
              name="name"
              placeholder="Entrez le nom du produit"
              value={formData.name}
              onChange={handleChange}
              size="small"
            />
            
            <FormControl fullWidth margin="normal" required size="small">
              <InputLabel>Catégorie *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Catégorie *"
                onChange={handleChange}
                placeholder="Sélectionnez une catégorie"
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
              label="Prix (FCFA) *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              size="small"
              InputProps={{
                endAdornment: 'FCFA',
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row' 
            }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Stock actuel *"
                name="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={handleChange}
                size="small"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Stock minimum *"
                name="alertLevel"
                type="number"
                value={formData.alertLevel}
                onChange={handleChange}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ ml: 1 }}
        >
          Sauvegarder le produit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;