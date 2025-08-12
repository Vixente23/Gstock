import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
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
  Chip, 
  Tooltip 
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddIcon from '@mui/icons-material/Add';

const UsersPage = () => {
  // Toujours appeler les hooks en premier, sans condition
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Utilisateur',
    password: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Puis conditionnellement retourner un message d'erreur si pas admin
  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Accès réservé aux administrateurs.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Utilisateurs
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
          onClick={() => setOpenModal(true)}
        >
          Ajouter un utilisateur
        </Button>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Prénom"
              type="text"
              fullWidth
              value={formValues.firstName}
              onChange={e => setFormValues({ ...formValues, firstName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Nom"
              type="text"
              fullWidth
              value={formValues.lastName}
              onChange={e => setFormValues({ ...formValues, lastName: e.target.value })}
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="role-label">Rôle</InputLabel>
              <Select
                labelId="role-label"
                label="Rôle"
                value={formValues.role}
                onChange={e => setFormValues({ ...formValues, role: e.target.value })}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Utilisateur">Utilisateur</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Mot de passe"
              type="password"
              fullWidth
              value={formValues.password}
              onChange={e => setFormValues({ ...formValues, password: e.target.value })}
              sx={{ mb: 2 }}
            />
            {formError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>{formError}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="inherit">Annuler</Button>
            <Button 
              onClick={async () => {
                if (!formValues.firstName.trim() || !formValues.lastName.trim() || !formValues.email.trim() || !formValues.password.trim()) {
                  setFormError('Tous les champs sont obligatoires');
                  return;
                }
                setFormError('');
                try {
                  const response = await axios.post('/users', formValues);
                  setUsers(prev => [...prev, response.data]);
                  setOpenModal(false);
                  setFormValues({ firstName: '', lastName: '', email: '', role: 'Utilisateur', password: '' });
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
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.role === 'Admin' ? (
                        <Tooltip title="Administrateur">
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <AdminPanelSettingsIcon color="primary" fontSize="small" style={{ marginRight: 4 }} />
                            {user.firstName} {user.lastName}
                          </span>
                        </Tooltip>
                      ) : (
                        `${user.firstName} ${user.lastName}`
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'Admin' ? (
                        <Chip label="Admin" color="primary" size="small" />
                      ) : (
                        <Chip label="Utilisateur" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role === 'Admin' ? (
                        <Chip label="Gestion complète" color="success" size="small" />
                      ) : (
                        <Chip label="Accès limité" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{user.isActive ? 'Actif' : 'Inactif'}</TableCell>
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

export default UsersPage;
