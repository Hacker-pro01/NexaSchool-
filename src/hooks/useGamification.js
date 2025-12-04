// ========================================
// FICHIER : src/hooks/useGamification.js
// ========================================

/**
 * Hook personnalisé pour la gamification
 */

import { useState, useCallback, useEffect } from 'react';
import {
  addPoints,
  getGamificationInfo,
  unlockBadge,
  getUserBadges,
  checkAndUnlockBadges,
  createWeeklyChallenge,
  completeChallenge,
  getGlobalLeaderboard,
  getSubjectLeaderboard,
  getRegionalLeaderboard,
  getGamificationStats,
} from '../services/gamificationService';

export default function useGamification(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gamificationInfo, setGamificationInfo] = useState(null);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Charger les infos de gamification au démarrage
  useEffect(() => {
    loadGamificationInfo();
  }, [userId]);

  const loadGamificationInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const info = await getGamificationInfo(userId);
      setGamificationInfo(info);

      const userBadges = await getUserBadges(userId);
      setBadges(userBadges);

      const gamStats = await getGamificationStats(userId);
      setStats(gamStats);

      console.log('✅ Infos gamification chargées');
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du chargement des infos gamification';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const earnPoints = useCallback(async (points, reason = '') => {
    try {
      setIsLoading(true);
      setError(null);

      await addPoints(userId, points, reason);
      await loadGamificationInfo();

      console.log('✅ Points gagnés');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'ajout de points';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const unlockNewBadge = useCallback(async (badgeId) => {
    try {
      setIsLoading(true);
      setError(null);

      const unlocked = await unlockBadge(userId, badgeId);
      
      if (unlocked) {
        await loadGamificationInfo();
        console.log('✅ Badge déverrouillé');
      }

      return unlocked;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du déverrouillage du badge';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const checkBadges = useCallback(async (grades = []) => {
    try {
      setIsLoading(true);
      setError(null);

      const unlockedBadges = await checkAndUnlockBadges(userId, grades);
      
      if (unlockedBadges.length > 0) {
        await loadGamificationInfo();
        console.log('✅ Badges vérifiés et déverrouillés');
      }

      return unlockedBadges;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la vérification des badges';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createChallenge = useCallback(async (subject, challenge) => {
    try {
      setIsLoading(true);
      setError(null);

      const newChallenge = await createWeeklyChallenge(userId, subject, challenge);
      console.log('✅ Défi créé');
      return newChallenge;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la création du défi';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const finishChallenge = useCallback(async (challengeId) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await completeChallenge(userId, challengeId);
      await loadGamificationInfo();

      console.log('✅ Défi complété');
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la complétion du défi';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchGlobalLeaderboard = useCallback(async (limit = 100) => {
    try {
      setIsLoading(true);
      setError(null);

      const lb = await getGlobalLeaderboard(limit);
      setLeaderboard(lb);

      console.log('✅ Classement global chargé');
      return lb;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du chargement du classement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubjectLeaderboard = useCallback(async (subject, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);

      const lb = await getSubjectLeaderboard(subject, limit);
      setLeaderboard(lb);

      console.log('✅ Classement matière chargé');
      return lb;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du chargement du classement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRegionalLeaderboard = useCallback(async (region, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);

      const lb = await getRegionalLeaderboard(region, limit);
      setLeaderboard(lb);

      console.log('✅ Classement régional chargé');
      return lb;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du chargement du classement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    gamificationInfo,
    badges,
    stats,
    leaderboard,
    loadGamificationInfo,
    earnPoints,
    unlockBadge: unlockNewBadge,
    checkBadges,
    createChallenge,
    completeChallenge: finishChallenge,
    fetchGlobalLeaderboard,
    fetchSubjectLeaderboard,
    fetchRegionalLeaderboard,
  };
}
