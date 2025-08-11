import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const fakeUsersDB = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    password: 'azerty123', // mot de passe en clair pour simplifier
  },
  // tu peux ajouter d'autres utilisateurs ici
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // On simule un "checkAuth" local, par ex. avec localStorage
  useEffect(() => {
    setLoading(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Recherche utilisateur dans fakeUsersDB
    const foundUser = fakeUsersDB.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) {
      setLoading(false);
      throw new Error('Identifiants incorrects');
    }
    setUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(foundUser));
    setLoading(false);
    navigate('/');
  };

  const register = async (userData) => {
    setLoading(true);
    // Vérifie si email déjà pris
    const exists = fakeUsersDB.find((u) => u.email === userData.email);
    if (exists) {
      setLoading(false);
      throw new Error('Cet email est déjà utilisé');
    }
    // Simule création utilisateur avec un id unique
    const newUser = {
      id: fakeUsersDB.length + 1,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    };
    fakeUsersDB.push(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
    navigate('/');
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
