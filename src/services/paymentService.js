// ========================================
// FICHIER : src/services/paymentService.js
// ========================================

/**
 * Service de gestion des paiements
 * Intégration Orange Money, MTN Mobile Money, Express Union
 */

import axios from 'axios';
import { executeSql, getRecordById } from './database';
import { PAYMENT_METHODS, PAYMENT_STATUS, SUBSCRIPTION_PLANS } from '../utils/constants';

// Configuration des APIs (à remplacer par les vraies clés)
const PAYMENT_CONFIG = {
  ORANGE_MONEY: {
    apiUrl: 'https://api.orange.cm/payment',
    clientId: process.env.ORANGE_CLIENT_ID || 'demo_client_id',
    clientSecret: process.env.ORANGE_CLIENT_SECRET || 'demo_secret',
  },
  MTN_MONEY: {
    apiUrl: 'https://api.mtn.cm/payment',
    clientId: process.env.MTN_CLIENT_ID || 'demo_client_id',
    clientSecret: process.env.MTN_CLIENT_SECRET || 'demo_secret',
  },
};

/**
 * Crée une transaction de paiement
 */
export const createPayment = async (userId, amount, method, planId) => {
  try {
    const paymentId = `pay_${Date.now()}`;
    const now = new Date().toISOString();

    await executeSql(
      `INSERT INTO payments (id, userId, amount, method, status, description, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, userId, amount, method, PAYMENT_STATUS.PENDING, `Abonnement ${planId}`, now, now]
    );

    console.log('✅ Paiement créé:', paymentId);
    return { id: paymentId, status: PAYMENT_STATUS.PENDING };
  } catch (error) {
    console.error('❌ Erreur création paiement:', error);
    throw error;
  }
};

/**
 * Initie un paiement Orange Money
 */
export const initiateOrangeMoneyPayment = async (userId, amount, phoneNumber, planId) => {
  try {
    const payment = await createPayment(userId, amount, PAYMENT_METHODS.ORANGE_MONEY, planId);

    // Appel API Orange Money
    const response = await axios.post(
      `${PAYMENT_CONFIG.ORANGE_MONEY.apiUrl}/initiate`,
      {
        amount,
        phoneNumber,
        reference: payment.id,
        description: `Abonnement Anti-Gravity - ${planId}`,
        callbackUrl: 'https://api.anti-gravity.cm/webhooks/orange-money',
      },
      {
        headers: {
          'Authorization': `Bearer ${PAYMENT_CONFIG.ORANGE_MONEY.clientId}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Mettre à jour le paiement avec la référence
    await executeSql(
      'UPDATE payments SET reference = ?, status = ? WHERE id = ?',
      [response.data.transactionId, PAYMENT_STATUS.PROCESSING, payment.id]
    );

    console.log('✅ Paiement Orange Money initié:', payment.id);
    return {
      paymentId: payment.id,
      transactionId: response.data.transactionId,
      status: PAYMENT_STATUS.PROCESSING,
      redirectUrl: response.data.redirectUrl,
    };
  } catch (error) {
    console.error('❌ Erreur paiement Orange Money:', error);
    throw error;
  }
};

/**
 * Initie un paiement MTN Mobile Money
 */
export const initiateMTNMoneyPayment = async (userId, amount, phoneNumber, planId) => {
  try {
    const payment = await createPayment(userId, amount, PAYMENT_METHODS.MTN_MONEY, planId);

    // Appel API MTN
    const response = await axios.post(
      `${PAYMENT_CONFIG.MTN_MONEY.apiUrl}/initiate`,
      {
        amount,
        phoneNumber,
        reference: payment.id,
        description: `Abonnement Anti-Gravity - ${planId}`,
        callbackUrl: 'https://api.anti-gravity.cm/webhooks/mtn-money',
      },
      {
        headers: {
          'Authorization': `Bearer ${PAYMENT_CONFIG.MTN_MONEY.clientId}`,
          'Content-Type': 'application/json',
        },
      }
    );

    await executeSql(
      'UPDATE payments SET reference = ?, status = ? WHERE id = ?',
      [response.data.transactionId, PAYMENT_STATUS.PROCESSING, payment.id]
    );

    console.log('✅ Paiement MTN Money initié:', payment.id);
    return {
      paymentId: payment.id,
      transactionId: response.data.transactionId,
      status: PAYMENT_STATUS.PROCESSING,
      redirectUrl: response.data.redirectUrl,
    };
  } catch (error) {
    console.error('❌ Erreur paiement MTN Money:', error);
    throw error;
  }
};


/**
 * Vérifie le statut d'un paiement
 */
export const verifyPaymentStatus = async (paymentId) => {
  try {
    const payment = await getRecordById('payments', paymentId);
    if (!payment) {
      throw new Error('Paiement non trouvé');
    }

    // Vérifier auprès du fournisseur de paiement
    let response;
    switch (payment.method) {
      case PAYMENT_METHODS.ORANGE_MONEY:
        response = await verifyOrangeMoneyPayment(payment.reference);
        break;
      case PAYMENT_METHODS.MTN_MONEY:
        response = await verifyMTNMoneyPayment(payment.reference);
        break;
      default:
        throw new Error('Méthode de paiement non supportée');
    }

    // Mettre à jour le statut du paiement
    if (response.status === 'success') {
      await executeSql(
        'UPDATE payments SET status = ?, updatedAt = ? WHERE id = ?',
        [PAYMENT_STATUS.SUCCESS, new Date().toISOString(), paymentId]
      );

      // Activer l'abonnement
      await activateSubscription(payment.userId, payment.description);
    } else if (response.status === 'failed') {
      await executeSql(
        'UPDATE payments SET status = ?, updatedAt = ? WHERE id = ?',
        [PAYMENT_STATUS.FAILED, new Date().toISOString(), paymentId]
      );
    }

    return response;
  } catch (error) {
    console.error('❌ Erreur vérification paiement:', error);
    throw error;
  }
};

/**
 * Vérifie un paiement Orange Money
 */
const verifyOrangeMoneyPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `${PAYMENT_CONFIG.ORANGE_MONEY.apiUrl}/verify/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYMENT_CONFIG.ORANGE_MONEY.clientId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Erreur vérification Orange Money:', error);
    throw error;
  }
};

/**
 * Vérifie un paiement MTN Money
 */
const verifyMTNMoneyPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `${PAYMENT_CONFIG.MTN_MONEY.apiUrl}/verify/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYMENT_CONFIG.MTN_MONEY.clientId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Erreur vérification MTN Money:', error);
    throw error;
  }
};


/**
 * Active un abonnement après paiement réussi
 */
export const activateSubscription = async (userId, planId) => {
  try {
    const subscriptionId = `sub_${Date.now()}`;
    const now = new Date().toISOString();
    const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];

    if (!plan) {
      throw new Error('Plan d\'abonnement non trouvé');
    }

    // Calculer la date d'expiration
    const endDate = new Date();
    if (plan.duration === 'month') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.duration === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Créer l'abonnement
    await executeSql(
      `INSERT INTO subscriptions (id, userId, planId, status, startDate, endDate, autoRenew, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [subscriptionId, userId, planId, 'active', now, endDate.toISOString(), 1, now, now]
    );

    console.log('✅ Abonnement activé:', subscriptionId);
    return { id: subscriptionId, status: 'active' };
  } catch (error) {
    console.error('❌ Erreur activation abonnement:', error);
    throw error;
  }
};

/**
 * Récupère l'abonnement actif d'un utilisateur
 */
export const getActiveSubscription = async (userId) => {
  try {
    const result = await executeSql(
      `SELECT * FROM subscriptions WHERE userId = ? AND status = 'active' AND endDate > datetime('now')`,
      [userId]
    );

    return result.rows.length > 0 ? result.rows._array[0] : null;
  } catch (error) {
    console.error('❌ Erreur récupération abonnement:', error);
    return null;
  }
};

/**
 * Récupère l'historique des paiements
 */
export const getPaymentHistory = async (userId) => {
  try {
    const result = await executeSql(
      `SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );

    return result.rows._array || [];
  } catch (error) {
    console.error('❌ Erreur récupération historique paiements:', error);
    return [];
  }
};

/**
 * Annule un abonnement
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const now = new Date().toISOString();
    await executeSql(
      'UPDATE subscriptions SET status = ?, updatedAt = ? WHERE id = ?',
      ['cancelled', now, subscriptionId]
    );

    console.log('✅ Abonnement annulé:', subscriptionId);
    return true;
  } catch (error) {
    console.error('❌ Erreur annulation abonnement:', error);
    throw error;
  }
};

/**
 * Renouvelle un abonnement
 */
export const renewSubscription = async (subscriptionId) => {
  try {
    const subscription = await getRecordById('subscriptions', subscriptionId);
    if (!subscription) {
      throw new Error('Abonnement non trouvé');
    }

    const now = new Date().toISOString();
    const newEndDate = new Date(subscription.endDate);
    const plan = SUBSCRIPTION_PLANS[subscription.planId.toUpperCase()];

    if (plan.duration === 'month') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (plan.duration === 'year') {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    await executeSql(
      'UPDATE subscriptions SET endDate = ?, updatedAt = ? WHERE id = ?',
      [newEndDate.toISOString(), now, subscriptionId]
    );

    console.log('✅ Abonnement renouvelé:', subscriptionId);
    return true;
  } catch (error) {
    console.error('❌ Erreur renouvellement abonnement:', error);
    throw error;
  }
};
