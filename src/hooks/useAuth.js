// ========================================
// FICHIER : src/hooks/useAuth.js
// ========================================

/**
 * Hook personnalisé pour la gestion de l'authentification
 */

import { useState, useEffect, useCallback } from 'react';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserLoggedIn,
  updateUserProfile,
  changePassword,
} from '../services/authService';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie si l'utilisateur est connecté au démarrage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const loggedIn = await isUserLoggedIn();
      
      if (loggedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('❌ Erreur vérification auth:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const newUser = await registerUser(userData);
      console.log('✅ Inscription réussie');
      return newUser;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: loggedInUser } = await loginUser(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      console.log('✅ Connexion réussie');
      return loggedInUser;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Déconnexion réussie');
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la déconnexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedUser = await updateUserProfile(user.id, updates);
      setUser(updatedUser);
      console.log('✅ Profil mis à jour');
      return updatedUser;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const changePass = useCallback(async (oldPassword, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);
      await changePassword(user.id, oldPassword, newPassword);
      console.log('✅ Mot de passe changé');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword: changePass,
    checkAuthStatus,
  };
}
