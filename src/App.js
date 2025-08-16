import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as CustomThemeProvider, ThemeContext } from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import Profile from './components/profile'; // adapte le chemin exact
import SettingsPage from './pages/SettingsPage'; // adapte le chemin exact


// import theme from './theme';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import Products from './pages/products/ProductsPage';
import ProductDetailPage from './pages/auth/ProductDetailPage';
import StockMovementsPage from './pages/stock/StockMovementsPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import UsersPage from './pages/users/UsersPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import ProductFormModal from './components/product/ProductFormModal';
import ConfirmationDialog from './components/common/ConfirmationDialog';
import { useAuth } from './contexts/AuthContext';
import ProductsPage from './pages/products/ProductsPage';

import { GlobalStyles } from '@mui/material';


function ThemeGlobalStyles({ theme }) {
  const textColor = theme.palette.mode === 'light' ? '#222' : '#fff';
  const bgColor = theme.palette.background.default;
    return (
      <GlobalStyles
        styles={{
          'body, #root': {
            minHeight: '100vh',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #edfeec 0%, #bdfcf4 40%, #96f5f9 100%)'
              : 'linear-gradient(135deg, #222 0%, #67dffa 100%)',
            color: textColor,
            transition: 'background 0.5s, color 0.3s',
          },
          'main, .MuiPaper-root, .MuiCard-root': {
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(120deg, #edfeec 0%, #bdfcf4 100%)'
              : 'linear-gradient(120deg, #222 0%, #67dffa 100%)',
            color: textColor,
          },
          'a': {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            fontWeight: 600,
          },
          'h1, h2, h3, h4, h5, h6, p, span, label, .MuiTypography-root': {
            color: textColor,
          },
          '.MuiButton-root': {
            color: '#222',
          },
          '.MuiTableCell-root': {
            color: textColor,
          },
          '*': {
            color: textColor,
          },
          ...(theme.palette.mode === 'dark' ? {
            '[style*="background-color: #fff"], .MuiPaper-root[style*="background-color: #fff"], .MuiCard-root[style*="background-color: #fff"]': {
              color: '#222 !important',
            },
          } : {}),
        }}
      />
  );
}



function App() {
  return (
    <CustomThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
              styles={{
                body: {
                  margin: 0,
                  padding: 0,
                  minHeight: '100vh',
                  background: 'linear-gradient(120deg, #0e2148 0%, #483aa0 60%, #7965c1 100%)',
                  color: theme.palette.text.primary,
                  transition: 'background 0.3s',
                  fontFamily: 'Montserrat, Lato, Poppins, Arial, sans-serif',
                },
                '#root': {
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: 'Montserrat, Lato, Poppins, Arial, sans-serif',
                  background: 'none',
                },
                '*': {
                  fontFamily: 'Montserrat, Lato, Poppins, Arial, sans-serif',
                },
              }}
            />

            

            <SnackbarProvider maxSnack={3}>
              <Routes>
                {/* Auth routes */}
                <Route element={<AuthLayout />}> 
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<PrivateRoute />}> 
                  <Route element={<MainLayout />}> 
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/stock" element={<StockMovementsPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </SnackbarProvider>
          </MuiThemeProvider>
        )}
      </ThemeContext.Consumer>
    </CustomThemeProvider>
  );
}

export default App;