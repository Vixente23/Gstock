import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

import theme from './theme';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box } from '@mui/material';
import Profile from './components/profile';
import SettingsPage from './pages/SettingsPage';



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;