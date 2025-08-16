import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  Typography,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  Slide,
  Fade,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const UsersPage = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <GroupIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography color="error" variant="h6">Accès réservé aux administrateurs.</Typography>
      </Box>
    );
  }

  const handleAddUser = async () => {
    if (!formValues.firstName.trim() || !formValues.lastName.trim() || !formValues.email.trim() || !formValues.password.trim()) {
      setFormError('Tous les champs sont obligatoires');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const response = await axios.post('/users', formValues);
      setUsers(prev => [...prev, response.data]);
      setOpenModal(false);
      setFormValues({ firstName: '', lastName: '', email: '', role: 'Utilisateur', password: '' });
    } catch (err) {
      setFormError("Erreur lors de l'ajout de l'utilisateur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 1 : 4 }}>
      <Paper elevation={4} sx={{ borderRadius: 4, p: isMobile ? 2 : 4, background: theme.palette.background.paper, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: isMobile ? 2 : 4, flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GroupIcon sx={{ fontSize: isMobile ? 32 : 44, color: theme.palette.primary.main, filter: 'drop-shadow(0 2px 8px #67dffa44)' }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} letterSpacing={1} sx={{ background: 'linear-gradient(90deg,#67dffa,#96f5f9,#bdfcf4,#edfeec)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Utilisateurs</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              px: 3,
              py: 1.2,
              fontSize: isMobile ? 14 : 16,
              boxShadow: '0 2px 12px 0 #67dffa33',
              background: 'linear-gradient(90deg,#67dffa,#96f5f9)',
              color: '#222',
              transition: 'all .2s',
              '&:hover': { background: 'linear-gradient(90deg,#96f5f9,#67dffa)', color: '#111' }
            }}
            onClick={() => setOpenModal(true)}
          >
            Ajouter un utilisateur
          </Button>
        </Box>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} TransitionComponent={Slide} fullScreen={isMobile}>
          <DialogTitle sx={{ fontWeight: 700, letterSpacing: 1, color: theme.palette.primary.main }}>Ajouter un utilisateur</DialogTitle>
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
            {formError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{formError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="inherit">Annuler</Button>
            <Button onClick={handleAddUser} variant="contained" color="primary" sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1.2 }} disabled={submitting}>
              {submitting ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Box sx={{ width: '100%', overflowX: 'auto', mt: isMobile ? 2 : 4 }}>
            {users.length === 0 ? (
              <Typography sx={{ mt: 4 }} color="text.secondary">Aucun utilisateur trouvé.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 16px 0 #67dffa22', minWidth: 320 }}>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(90deg,#67dffa22,#edfeec22)' }}>
                      <TableCell sx={{ fontWeight: 700, letterSpacing: 1 }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 700, letterSpacing: 1 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, letterSpacing: 1 }}>Rôle</TableCell>
                      <TableCell sx={{ fontWeight: 700, letterSpacing: 1 }}>Permissions</TableCell>
                      <TableCell sx={{ fontWeight: 700, letterSpacing: 1 }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 700, letterSpacing: 1 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, idx) => (
                      <Fade in timeout={400 + idx * 80} key={user.id || idx}>
                        <TableRow hover sx={{ transition: 'all .2s', '&:hover': { background: '#67dffa11' } }}>
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
                            {user.role === 'Admin' ? <Chip label="Admin" color="primary" size="small" /> : <Chip label="Utilisateur" size="small" />}
                          </TableCell>
                          <TableCell>
                            {user.role === 'Admin' ? <Chip label="Gestion complète" color="success" size="small" /> : <Chip label="Accès limité" color="default" size="small" />}
                          </TableCell>
                          <TableCell>
                            <Chip label={user.isActive ? 'Actif' : 'Inactif'} color={user.isActive ? 'success' : 'default'} size="small" />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 500 }}>Modifier</Button>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UsersPage;
