// ========================================
// FICHIER : src/services/notificationService.js
// ========================================

/**
 * Service de gestion des notifications
 * Notifications push, email, SMS et in-app
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { executeSql } from './database';
import { NOTIFICATION_TYPES, NOTIFICATION_CONFIG } from '../utils/constants';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Enregistre le token de notification push
 */
export const registerForPushNotifications = async (userId) => {
  try {
    if (!Device.isDevice) {
      console.log('⚠️ Les notifications push ne fonctionnent que sur les appareils physiques');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('⚠️ Permission de notification refusée');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('✅ Token de notification obtenu:', token);

    // Sauvegarder le token
    await executeSql(
      `UPDATE users SET pushToken = ? WHERE id = ?`,
      [token, userId]
    );

    return token;
  } catch (error) {
    console.error('❌ Erreur enregistrement notifications:', error);
    return null;
  }
};

/**
 * Envoie une notification in-app
 */
export const sendInAppNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notificationId = `notif_${Date.now()}`;
    const now = new Date().toISOString();

    await executeSql(
      `INSERT INTO notifications (id, userId, type, title, message, data, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [notificationId, userId, type, title, message, JSON.stringify(data), now]
    );

    console.log('✅ Notification in-app créée:', notificationId);
    return { id: notificationId, type, title, message };
  } catch (error) {
    console.error('❌ Erreur création notification in-app:', error);
    throw error;
  }
};

/**
 * Envoie une notification push
 */
export const sendPushNotification = async (userId, title, message, data = {}) => {
  try {
    const user = await executeSql(
      'SELECT pushToken FROM users WHERE id = ?',
      [userId]
    );

    if (user.rows.length === 0 || !user.rows._array[0].pushToken) {
      console.log('⚠️ Pas de token de notification pour cet utilisateur');
      return false;
    }

    const token = user.rows._array[0].pushToken;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        data,
        sound: true,
        badge: 1,
      },
      trigger: null, // Immédiat
    });

    console.log('✅ Notification push envoyée');
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi notification push:', error);
    return false;
  }
};

/**
 * Envoie une notification de rappel de cours
 */
export const sendCourseReminder = async (userId, courseName, startTime) => {
  try {
    const title = '📚 Rappel de cours';
    const message = `${courseName} commence dans 10 minutes`;
    const type = NOTIFICATION_TYPES.COURSE_REMINDER;

    await sendInAppNotification(userId, type, title, message, { courseName, startTime });
    await sendPushNotification(userId, title, message, { courseName, startTime });

    console.log('✅ Rappel de cours envoyé');
  } catch (error) {
    console.error('❌ Erreur envoi rappel cours:', error);
  }
};

/**
 * Envoie une notification de note publiée
 */
export const sendGradePublishedNotification = async (userId, subject, grade, average) => {
  try {
    const title = '📊 Nouvelle note';
    const message = `Vous avez reçu ${grade}/20 en ${subject}. Moyenne: ${average.toFixed(2)}/20`;
    const type = NOTIFICATION_TYPES.GRADE_PUBLISHED;

    await sendInAppNotification(userId, type, title, message, { subject, grade, average });
    await sendPushNotification(userId, title, message, { subject, grade, average });

    console.log('✅ Notification note publiée envoyée');
  } catch (error) {
    console.error('❌ Erreur envoi notification note:', error);
  }
};

/**
 * Envoie une alerte d'examen
 */
export const sendExamAlert = async (userId, examName, daysUntil) => {
  try {
    let title = '⚠️ Alerte examen';
    let message = '';

    if (daysUntil === 7) {
      message = `${examName} dans 7 jours. Commencez vos révisions!`;
    } else if (daysUntil === 3) {
      message = `${examName} dans 3 jours. Intensifiez vos révisions!`;
    } else if (daysUntil === 1) {
      message = `${examName} demain! Dernière révision avant l'examen.`;
    } else if (daysUntil === 0) {
      message = `${examName} aujourd'hui! Bonne chance!`;
    }

    const type = NOTIFICATION_TYPES.EXAM_ALERT;

    await sendInAppNotification(userId, type, title, message, { examName, daysUntil });
    await sendPushNotification(userId, title, message, { examName, daysUntil });

    console.log('✅ Alerte examen envoyée');
  } catch (error) {
    console.error('❌ Erreur envoi alerte examen:', error);
  }
};

/**
 * Envoie une notification de nouveau message
 */
export const sendNewMessageNotification = async (userId, senderName, messagePreview) => {
  try {
    const title = '💬 Nouveau message';
    const message = `${senderName}: ${messagePreview}`;
    const type = NOTIFICATION_TYPES.NEW_MESSAGE;

    await sendInAppNotification(userId, type, title, message, { senderName, messagePreview });
    await sendPushNotification(userId, title, message, { senderName });

    console.log('✅ Notification nouveau message envoyée');
  } catch (error) {
    console.error('❌ Erreur envoi notification message:', error);
  }
};

/**
 * Envoie une notification d'accomplissement
 */
export const sendAchievementNotification = async (userId, badgeName, points) => {
  try {
    const title = '🏆 Accomplissement débloqué!';
    const message = `Vous avez déverrouillé le badge "${badgeName}" et gagné ${points} points!`;
    const type = NOTIFICATION_TYPES.ACHIEVEMENT;

    await sendInAppNotification(userId, type, title, message, { badgeName, points });
    await sendPushNotification(userId, title, message, { badgeName, points });

    console.log('✅ Notification accomplissement envoyée');
  } catch (error) {
    console.error('❌ Erreur envoi notification accomplissement:', error);
  }
};

/**
 * Envoie une notification de paiement réussi
 */
export const sendPaymentSuccessNotification = async (userId, planName, amount) => {
  try {
    const title = '✅ Paiement réussi';
    const message = `Votre abonnement ${planName} (${amount} FCFA) a été activé avec succès!`;
    const type = NOTIFICATION_TYPES.PAYMENT_SUCCESS;

    await sendInAppNotification(userId, type, title, message, { planName, amount });
    await sendPushNotification(userId, title, message, { planName, amount });

    console.log('✅ Notification paiement réussi envoyée');
  } catch (error) {
    console.error('❌ Erreur envoi notification paiement:', error);
  }
};

/**
 * Envoie une notification d'expiration d'abonnement
 */
export const sendSubscriptionExpiringNotification = async (userId, planName, daysLeft) => {
  try {
    const title = '⏰ Abonnement expire bientôt';
    const message = `Votre abonnement ${planName} expire dans ${daysLeft} jours.`;
    const type = NOTIFICATION_TYPES.SUBSCRIPTION_EXPIRING;

    await sendInAppNotification(userId, type, title, message, { planName, daysLeft });
    await sendPushNotification(userId, title, message, { planName, daysLeft });

    console.log('✅ Notification expiration abonnement envoyée');
  } catch (error) {
    console.error('❌ Erreur envoi notification expiration:', error);
  }
};

/**
 * Récupère les notifications d'un utilisateur
 */
export const getUserNotifications = async (userId, limit = 50, unreadOnly = false) => {
  try {
    let query = 'SELECT * FROM notifications WHERE userId = ?';
    const params = [userId];

    if (unreadOnly) {
      query += ' AND isRead = 0';
    }

    query += ' ORDER BY createdAt DESC LIMIT ?';
    params.push(limit);

    const result = await executeSql(query, params);
    return result.rows._array || [];
  } catch (error) {
    console.error('❌ Erreur récupération notifications:', error);
    return [];
  }
};

/**
 * Marque une notification comme lue
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const now = new Date().toISOString();
    await executeSql(
      'UPDATE notifications SET isRead = 1, readAt = ? WHERE id = ?',
      [now, notificationId]
    );

    console.log('✅ Notification marquée comme lue');
    return true;
  } catch (error) {
    console.error('❌ Erreur marquage notification:', error);
    throw error;
  }
};

/**
 * Marque toutes les notifications comme lues
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const now = new Date().toISOString();
    await executeSql(
      'UPDATE notifications SET isRead = 1, readAt = ? WHERE userId = ? AND isRead = 0',
      [now, userId]
    );

    console.log('✅ Toutes les notifications marquées comme lues');
    return true;
  } catch (error) {
    console.error('❌ Erreur marquage notifications:', error);
    throw error;
  }
};

/**
 * Supprime une notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    await executeSql(
      'DELETE FROM notifications WHERE id = ?',
      [notificationId]
    );

    console.log('✅ Notification supprimée');
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression notification:', error);
    throw error;
  }
};

/**
 * Récupère le nombre de notifications non lues
 */
export const getUnreadNotificationCount = async (userId) => {
  try {
    const result = await executeSql(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = 0',
      [userId]
    );

    return result.rows._array[0]?.count || 0;
  } catch (error) {
    console.error('❌ Erreur comptage notifications non lues:', error);
    return 0;
  }
};

/**
 * Planifie une notification pour plus tard
 */
export const scheduleNotification = async (userId, title, message, delayMinutes, data = {}) => {
  try {
    const trigger = new Date(Date.now() + delayMinutes * 60000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        data,
        sound: true,
      },
      trigger,
    });

    console.log('✅ Notification planifiée');
    return true;
  } catch (error) {
    console.error('❌ Erreur planification notification:', error);
    return false;
  }
};
