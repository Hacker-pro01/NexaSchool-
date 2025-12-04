// ========================================
// FICHIER : src/services/authService.js
// ========================================

/**
 * Service d'authentification et gestion des utilisateurs
 */

import * as SecureStore from 'expo-secure-store';
import { executeSql, getRecordById } from './database';
import { VALIDATION } from '../utils/constants';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'current_user';

/**
 * Valide un email
 */
export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Valide un mot de passe
 */
export const validatePassword = (password) => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH &&
         password.length <= VALIDATION.MAX_PASSWORD_LENGTH;
};

/**
 * Valide un numéro de téléphone camerounais
 */
export const validatePhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Hash simple du mot de passe (en production, utiliser bcrypt côté serveur)
 */
const hashPassword = (password) => {
  // Ceci est une implémentation simple pour la démo
  // En production, utiliser une vraie fonction de hash côté serveur
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

/**
 * Crée un nouvel utilisateur
 */
export const registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, phone, password, schoolLevel, schoolSeries } = userData;

    // Validations
    if (!firstName || firstName.length < VALIDATION.MIN_NAME_LENGTH) {
      throw new Error('Le prénom doit contenir au moins 2 caractères');
    }
    if (!lastName || lastName.length < VALIDATION.MIN_NAME_LENGTH) {
      throw new Error('Le nom doit contenir au moins 2 caractères');
    }
    if (!validateEmail(email)) {
      throw new Error('Email invalide');
    }
    if (!validatePassword(password)) {
      throw new Error(`Le mot de passe doit contenir entre ${VALIDATION.MIN_PASSWORD_LENGTH} et ${VALIDATION.MAX_PASSWORD_LENGTH} caractères`);
    }
    if (phone && !validatePhone(phone)) {
      throw new Error('Numéro de téléphone camerounais invalide');
    }

    // Vérifier si l'email existe déjà
    const existingUser = await executeSql(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer l'utilisateur
    const userId = `user_${Date.now()}`;
    const now = new Date().toISOString();
    const hashedPassword = hashPassword(password);

    await executeSql(
      `INSERT INTO users (id, firstName, lastName, email, phone, password, schoolLevel, schoolSeries, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, email, phone || '', hashedPassword, schoolLevel || '', schoolSeries || '', now, now]
    );

    // Créer les préférences utilisateur
    await executeSql(
      `INSERT INTO user_preferences (id, userId, updatedAt)
       VALUES (?, ?, ?)`,
      [`pref_${userId}`, userId, now]
    );

    // Créer les points de gamification
    await executeSql(
      `INSERT INTO gamification_points (id, userId, updatedAt)
       VALUES (?, ?, ?)`,
      [`gp_${userId}`, userId, now]
    );

    console.log('✅ Utilisateur créé:', email);
    return { id: userId, email, firstName, lastName };
  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    throw error;
  }
};

/**
 * Connecte un utilisateur
 */
export const loginUser = async (email, password) => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Email invalide');
    }

    const result = await executeSql(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const user = result.rows._array[0];
    const hashedPassword = hashPassword(password);

    if (user.password !== hashedPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Sauvegarder les tokens
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

    // Mettre à jour lastLogin
    const now = new Date().toISOString();
    await executeSql(
      'UPDATE users SET lastLogin = ? WHERE id = ?',
      [now, user.id]
    );

    console.log('✅ Connexion réussie:', email);
    return { user, token, refreshToken };
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur
 */
export const logoutUser = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    console.log('✅ Déconnexion réussie');
  } catch (error) {
    console.error('❌ Erreur déconnexion:', error);
    throw error;
  }
};

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = async () => {
  try {
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    return null;
  }
};

/**
 * Récupère le token d'authentification
 */
export const getAuthToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('❌ Erreur récupération token:', error);
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est connecté
 */
export const isUserLoggedIn = async () => {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    return false;
  }
};

/**
 * Génère un JWT simple (en production, utiliser une vraie librairie JWT)
 */
const generateToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 heures
  }));
  const signature = btoa(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Génère un refresh token
 */
const generateRefreshToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 jours
  }));
  const signature = btoa(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Met à jour le profil utilisateur
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const now = new Date().toISOString();
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), now, userId];

    await executeSql(
      `UPDATE users SET ${fields}, updatedAt = ? WHERE id = ?`,
      values
    );

    // Mettre à jour le cache local
    const user = await getRecordById('users', userId);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

    console.log('✅ Profil mis à jour');
    return user;
  } catch (error) {
    console.error('❌ Erreur mise à jour profil:', error);
    throw error;
  }
};

/**
 * Change le mot de passe
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    if (!validatePassword(newPassword)) {
      throw new Error(`Le mot de passe doit contenir entre ${VALIDATION.MIN_PASSWORD_LENGTH} et ${VALIDATION.MAX_PASSWORD_LENGTH} caractères`);
    }

    const user = await getRecordById('users', userId);
    const hashedOldPassword = hashPassword(oldPassword);

    if (user.password !== hashedOldPassword) {
      throw new Error('Ancien mot de passe incorrect');
    }

    const hashedNewPassword = hashPassword(newPassword);
    await executeSql(
      'UPDATE users SET password = ?, updatedAt = ? WHERE id = ?',
      [hashedNewPassword, new Date().toISOString(), userId]
    );

    console.log('✅ Mot de passe changé');
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    throw error;
  }
};

/**
 * Réinitialise le mot de passe (envoi d'email)
 */
export const resetPassword = async (email) => {
  try {
    const result = await executeSql(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Aucun utilisateur trouvé avec cet email');
    }

    // En production, envoyer un email avec un lien de réinitialisation
    console.log('✅ Email de réinitialisation envoyé à:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur réinitialisation mot de passe:', error);
    throw error;
  }
};

/**
 * Récupère les informations d'un utilisateur
 */
export const getUserInfo = async (userId) => {
  try {
    const user = await getRecordById('users', userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  } catch (error) {
    console.error('❌ Erreur récupération infos utilisateur:', error);
    throw error;
  }
};
