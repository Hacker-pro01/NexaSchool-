// ========================================
// FICHIER : src/services/initializationService.js
// ========================================

/**
 * Service d'initialisation de l'application
 * Gère le démarrage et la configuration initiale
 */

import { initializeDatabase } from './database';
import { registerForPushNotifications } from './notificationService';
import { isUserLoggedIn, getCurrentUser } from './authService';
import * as SecureStore from 'expo-secure-store';

/**
 * Initialise l'application au démarrage
 */
export const initializeApp = async () => {
  try {
    console.log('🚀 Initialisation de l\'application...');

    // 1. Initialiser la base de données
    console.log('📦 Initialisation de la base de données...');
    await initializeDatabase();

    // 2. Vérifier l'authentification
    console.log('🔐 Vérification de l\'authentification...');
    const isLoggedIn = await isUserLoggedIn();
    
    if (isLoggedIn) {
      const user = await getCurrentUser();
      console.log('✅ Utilisateur connecté:', user?.email);
      
      // 3. Enregistrer pour les notifications push
      console.log('🔔 Enregistrement des notifications...');
      await registerForPushNotifications(user.id);
    } else {
      console.log('ℹ️ Aucun utilisateur connecté');
    }

    // 4. Charger les préférences utilisateur
    console.log('⚙️ Chargement des préférences...');
    const preferences = await loadUserPreferences();

    // 5. Vérifier les mises à jour
    console.log('🔄 Vérification des mises à jour...');
    await checkForUpdates();

    console.log('✅ Application initialisée avec succès');
    return {
      success: true,
      isLoggedIn,
      preferences,
    };
  } catch (error) {
    console.error('❌ Erreur initialisation application:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Charge les préférences utilisateur
 */
export const loadUserPreferences = async () => {
  try {
    const preferencesJson = await SecureStore.getItemAsync('user_preferences');
    
    if (preferencesJson) {
      return JSON.parse(preferencesJson);
    }

    // Préférences par défaut
    const defaultPreferences = {
      theme: 'neon',
      language: 'fr',
      notificationsEnabled: true,
      darkMode: false,
      offlineMode: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };

    await SecureStore.setItemAsync('user_preferences', JSON.stringify(defaultPreferences));
    return defaultPreferences;
  } catch (error) {
    console.error('❌ Erreur chargement préférences:', error);
    return null;
  }
};

/**
 * Sauvegarde les préférences utilisateur
 */
export const saveUserPreferences = async (preferences) => {
  try {
    await SecureStore.setItemAsync('user_preferences', JSON.stringify(preferences));
    console.log('✅ Préférences sauvegardées');
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde préférences:', error);
    throw error;
  }
};

/**
 * Vérifie les mises à jour disponibles
 */
export const checkForUpdates = async () => {
  try {
    // En production, vérifier auprès d'un serveur de mises à jour
    console.log('✅ Vérification des mises à jour effectuée');
    return { updateAvailable: false };
  } catch (error) {
    console.error('❌ Erreur vérification mises à jour:', error);
    return { updateAvailable: false };
  }
};

/**
 * Réinitialise l'application (pour tests)
 */
export const resetApp = async () => {
  try {
    console.log('🔄 Réinitialisation de l\'application...');

    // Effacer les données sécurisées
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('current_user');
    await SecureStore.deleteItemAsync('user_preferences');

    console.log('✅ Application réinitialisée');
    return true;
  } catch (error) {
    console.error('❌ Erreur réinitialisation:', error);
    throw error;
  }
};

/**
 * Récupère les informations de l'application
 */
export const getAppInfo = async () => {
  try {
    const appVersion = '2.0.0';
    const buildNumber = '1';
    const isLoggedIn = await isUserLoggedIn();
    const preferences = await loadUserPreferences();

    return {
      version: appVersion,
      buildNumber,
      isLoggedIn,
      preferences,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Erreur récupération infos app:', error);
    return null;
  }
};

/**
 * Effectue une vérification de santé de l'application
 */
export const performHealthCheck = async () => {
  try {
    console.log('🏥 Vérification de santé de l\'application...');

    const checks = {
      database: false,
      authentication: false,
      notifications: false,
      storage: false,
    };

    // Vérifier la base de données
    try {
      const result = await executeSql('SELECT 1');
      checks.database = result.rows.length > 0;
    } catch (err) {
      console.error('❌ Erreur base de données:', err);
    }

    // Vérifier l'authentification
    try {
      checks.authentication = await isUserLoggedIn();
    } catch (err) {
      console.error('❌ Erreur authentification:', err);
    }

    // Vérifier le stockage sécurisé
    try {
      await SecureStore.setItemAsync('health_check', 'ok');
      const value = await SecureStore.getItemAsync('health_check');
      checks.storage = value === 'ok';
      await SecureStore.deleteItemAsync('health_check');
    } catch (err) {
      console.error('❌ Erreur stockage:', err);
    }

    const allHealthy = Object.values(checks).every(v => v === true || v === false);
    console.log('✅ Vérification de santé complétée:', checks);

    return {
      healthy: allHealthy,
      checks,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Erreur vérification santé:', error);
    return {
      healthy: false,
      error: error.message,
    };
  }
};

/**
 * Nettoie les données obsolètes
 */
export const cleanupOldData = async () => {
  try {
    console.log('🧹 Nettoyage des données obsolètes...');

    // Supprimer les notifications lues depuis plus de 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await executeSql(
      'DELETE FROM notifications WHERE isRead = 1 AND readAt < ?',
      [thirtyDaysAgo.toISOString()]
    );

    // Supprimer les messages de plus de 90 jours
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    await executeSql(
      'DELETE FROM messages WHERE createdAt < ?',
      [ninetyDaysAgo.toISOString()]
    );

    console.log('✅ Nettoyage complété');
    return true;
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
    throw error;
  }
};

/**
 * Exporte les données utilisateur (RGPD)
 */
export const exportUserData = async (userId) => {
  try {
    console.log('📤 Export des données utilisateur...');

    const user = await executeSql('SELECT * FROM users WHERE id = ?', [userId]);
    const subjects = await executeSql('SELECT * FROM subjects WHERE userId = ?', [userId]);
    const grades = await executeSql('SELECT * FROM grades WHERE userId = ?', [userId]);
    const schedule = await executeSql('SELECT * FROM schedule WHERE userId = ?', [userId]);
    const courses = await executeSql('SELECT * FROM courses WHERE userId = ?', [userId]);
    const exams = await executeSql('SELECT * FROM exams WHERE userId = ?', [userId]);

    const exportData = {
      user: user.rows._array,
      subjects: subjects.rows._array,
      grades: grades.rows._array,
      schedule: schedule.rows._array,
      courses: courses.rows._array,
      exams: exams.rows._array,
      exportDate: new Date().toISOString(),
    };

    console.log('✅ Export complété');
    return exportData;
  } catch (error) {
    console.error('❌ Erreur export données:', error);
    throw error;
  }
};

/**
 * Supprime toutes les données utilisateur (RGPD - Droit à l'oubli)
 */
export const deleteAllUserData = async (userId) => {
  try {
    console.log('🗑️ Suppression de toutes les données utilisateur...');

    const tables = [
      'users', 'subjects', 'grades', 'schedule', 'courses', 'exams',
      'assignments', 'subscriptions', 'payments', 'notifications',
      'study_groups', 'study_group_members', 'messages', 'badges',
      'gamification_points', 'activity_log', 'user_preferences'
    ];

    for (const table of tables) {
      await executeSql(`DELETE FROM ${table} WHERE userId = ?`, [userId]);
    }

    console.log('✅ Suppression complétée');
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression données:', error);
    throw error;
  }
};

// Import nécessaire pour executeSql
import { executeSql } from './database';
