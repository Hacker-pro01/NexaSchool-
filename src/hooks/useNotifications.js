// ========================================
// FICHIER : src/hooks/useNotifications.js
// ========================================

/**
 * Hook personnalisé pour la gestion des notifications
 */

import { useState, useCallback, useEffect } from 'react';
import {
  registerForPushNotifications,
  sendInAppNotification,
  sendPushNotification,
  sendCourseReminder,
  sendGradePublishedNotification,
  sendExamAlert,
  sendNewMessageNotification,
  sendAchievementNotification,
  sendPaymentSuccessNotification,
  sendSubscriptionExpiringNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  scheduleNotification,
} from '../services/notificationService';

export default function useNotifications(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushToken, setPushToken] = useState(null);

  // Enregistrer pour les notifications push au démarrage
  useEffect(() => {
    registerPushNotifications();
    loadNotifications();
  }, [userId]);

  const registerPushNotifications = useCallback(async () => {
    try {
      const token = await registerForPushNotifications(userId);
      setPushToken(token);
      console.log('✅ Notifications push enregistrées');
    } catch (err) {
      console.error('❌ Erreur enregistrement notifications:', err);
    }
  }, [userId]);

  const loadNotifications = useCallback(async (unreadOnly = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const notifs = await getUserNotifications(userId, 50, unreadOnly);
      setNotifications(notifs);

      const count = await getUnreadNotificationCount(userId);
      setUnreadCount(count);

      console.log('✅ Notifications chargées');
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du chargement des notifications';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const sendInApp = useCallback(async (type, title, message, data = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      await sendInAppNotification(userId, type, title, message, data);
      await loadNotifications();

      console.log('✅ Notification in-app envoyée');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi de la notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const sendPush = useCallback(async (title, message, data = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const sent = await sendPushNotification(userId, title, message, data);
      console.log('✅ Notification push envoyée');
      return sent;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi de la notification push';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const sendCourseReminderNotif = useCallback(async (courseName, startTime) => {
    try {
      await sendCourseReminder(userId, courseName, startTime);
      await loadNotifications();
      console.log('✅ Rappel de cours envoyé');
    } catch (err) {
      console.error('❌ Erreur envoi rappel:', err);
    }
  }, [userId]);

  const sendGradeNotif = useCallback(async (subject, grade, average) => {
    try {
      await sendGradePublishedNotification(userId, subject, grade, average);
      await loadNotifications();
      console.log('✅ Notification note envoyée');
    } catch (err) {
      console.error('❌ Erreur envoi notification note:', err);
    }
  }, [userId]);

  const sendExamAlertNotif = useCallback(async (examName, daysUntil) => {
    try {
      await sendExamAlert(userId, examName, daysUntil);
      await loadNotifications();
      console.log('✅ Alerte examen envoyée');
    } catch (err) {
      console.error('❌ Erreur envoi alerte examen:', err);
    }
  }, [userId]);

  const sendMessageNotif = useCallback(async (senderName, messagePreview) => {
    try {
      await sendNewMessageNotification(userId, senderName, messagePreview);
      await loadNotifications();
      console.log('✅ Notification message envoyée');
    } catch (err) {
      console.error('❌ Erreur envoi notification message:', err);
    }
  }, [userId]);

  const sendAchievementNotif = useCallback(async (badgeName, points) => {
    try {
      await sendAchievementNotification(userId, badgeName, points);
      await loadNotifications();
      console.log('✅ Notification accomplissement envoyée');
    } catch (err) {
      console.error('❌ Erreur envoi notification accomplissement:', err);
    }
  }, [userId]);

  const sendPaymentNotif = useCallback(async (planName, amount) => {
    try {
      await sendPaymentSuccessNotification(userId, planName, amount);
      await loadNotifications();
      console.log('✅ Notification paiement envoyée');
    } catch (err) {
      console.error('❌ Erreur envoi notification paiement:', err);
    }
  }, [userId]);

  const sendSubscriptionNotif = useCallback(async (planName, daysLeft) => {
    try {
      await sendSubscriptionExpiringNotification(userId, planName, daysLeft);
      await loadNotifications();
      console.log('✅ Notification abonnement envoyée');
    } catch (err) {
      console.error('❌ Erreur envoi notification abonnement:', err);
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setIsLoading(true);
      setError(null);

      await markNotificationAsRead(notificationId);
      await loadNotifications();

      console.log('✅ Notification marquée comme lue');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du marquage de la notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const markAllAsRead = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await markAllNotificationsAsRead(userId);
      await loadNotifications();

      console.log('✅ Toutes les notifications marquées comme lues');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du marquage des notifications';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const deleteNotif = useCallback(async (notificationId) => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteNotification(notificationId);
      await loadNotifications();

      console.log('✅ Notification supprimée');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la suppression de la notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const scheduleNotif = useCallback(async (title, message, delayMinutes, data = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const scheduled = await scheduleNotification(userId, title, message, delayMinutes, data);
      console.log('✅ Notification planifiée');
      return scheduled;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la planification de la notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    isLoading,
    error,
    notifications,
    unreadCount,
    pushToken,
    loadNotifications,
    sendInAppNotification: sendInApp,
    sendPushNotification: sendPush,
    sendCourseReminder: sendCourseReminderNotif,
    sendGradeNotification: sendGradeNotif,
    sendExamAlert: sendExamAlertNotif,
    sendMessageNotification: sendMessageNotif,
    sendAchievementNotification: sendAchievementNotif,
    sendPaymentNotification: sendPaymentNotif,
    sendSubscriptionNotification: sendSubscriptionNotif,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotif,
    scheduleNotification: scheduleNotif,
  };
}
