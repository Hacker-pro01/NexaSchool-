// ========================================
// FICHIER : src/hooks/usePayment.js
// ========================================

/**
 * Hook personnalisé pour la gestion des paiements
 */

import { useState, useCallback } from 'react';
import {
  initiateOrangeMoneyPayment,
  initiateMTNMoneyPayment,
  initiateExpressUnionPayment,
  verifyPaymentStatus,
  getActiveSubscription,
  getPaymentHistory,
  cancelSubscription,
} from '../services/paymentService';
import { PAYMENT_METHODS } from '../utils/constants';

export default function usePayment(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const initiatePayment = useCallback(async (amount, method, phoneNumber, planId) => {
    try {
      setIsLoading(true);
      setError(null);

      let result;
      switch (method) {
        case PAYMENT_METHODS.ORANGE_MONEY:
          result = await initiateOrangeMoneyPayment(userId, amount, phoneNumber, planId);
          break;
        case PAYMENT_METHODS.MTN_MONEY:
          result = await initiateMTNMoneyPayment(userId, amount, phoneNumber, planId);
          break;
        case PAYMENT_METHODS.EXPRESS_UNION:
          result = await initiateExpressUnionPayment(userId, amount, phoneNumber, planId);
          break;
        default:
          throw new Error('Méthode de paiement non supportée');
      }

      setPaymentStatus(result);
      console.log('✅ Paiement initié');
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'initiation du paiement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const verifyPayment = useCallback(async (paymentId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await verifyPaymentStatus(paymentId);
      setPaymentStatus(result);
      console.log('✅ Paiement vérifié');
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la vérification du paiement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActiveSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const subscription = await getActiveSubscription(userId);
      setActiveSubscription(subscription);
      return subscription;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la récupération de l\'abonnement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchPaymentHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await getPaymentHistory(userId);
      setPaymentHistory(history);
      return history;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la récupération de l\'historique';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const cancel = useCallback(async (subscriptionId) => {
    try {
      setIsLoading(true);
      setError(null);
      await cancelSubscription(subscriptionId);
      setActiveSubscription(null);
      console.log('✅ Abonnement annulé');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'annulation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    paymentStatus,
    activeSubscription,
    paymentHistory,
    initiatePayment,
    verifyPayment,
    fetchActiveSubscription,
    fetchPaymentHistory,
    cancelSubscription: cancel,
  };
}
