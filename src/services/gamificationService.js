// ========================================
// FICHIER : src/services/gamificationService.js
// ========================================

/**
 * Service de gamification et système de points
 * Gère les badges, niveaux, points et compétitions
 */

import { executeSql, getRecordById } from './database';
import { GAMIFICATION_LEVELS, BADGES } from '../utils/constants';

/**
 * Ajoute des points à un utilisateur
 */
export const addPoints = async (userId, points, reason = '') => {
  try {
    const gamification = await executeSql(
      'SELECT * FROM gamification_points WHERE userId = ?',
      [userId]
    );

    let currentGP = gamification.rows._array[0];
    if (!currentGP) {
      // Créer l'entrée si elle n'existe pas
      await executeSql(
        `INSERT INTO gamification_points (id, userId, totalPoints, level, currentLevelPoints, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`gp_${userId}`, userId, points, 1, points, new Date().toISOString()]
      );
      currentGP = { totalPoints: points, level: 1, currentLevelPoints: points };
    } else {
      const newTotalPoints = currentGP.totalPoints + points;
      const newCurrentLevelPoints = currentGP.currentLevelPoints + points;

      // Vérifier si l'utilisateur monte de niveau
      const currentLevel = GAMIFICATION_LEVELS.find(l => l.level === currentGP.level);
      const nextLevel = GAMIFICATION_LEVELS.find(l => l.level === currentGP.level + 1);

      let newLevel = currentGP.level;
      let newCurrentLevelPoints = newCurrentLevelPoints;

      if (nextLevel && newCurrentLevelPoints >= nextLevel.minPoints) {
        newLevel = nextLevel.level;
        newCurrentLevelPoints = newCurrentLevelPoints - currentLevel.maxPoints;
      }

      await executeSql(
        `UPDATE gamification_points SET totalPoints = ?, level = ?, currentLevelPoints = ?, updatedAt = ? WHERE userId = ?`,
        [newTotalPoints, newLevel, newCurrentLevelPoints, new Date().toISOString(), userId]
      );

      // Enregistrer l'activité
      await logActivity(userId, 'points_earned', 'gamification', userId, `${points} points gagnés: ${reason}`);
    }

    console.log('✅ Points ajoutés:', points);
    return { points, reason };
  } catch (error) {
    console.error('❌ Erreur ajout points:', error);
    throw error;
  }
};

/**
 * Récupère les informations de gamification d'un utilisateur
 */
export const getGamificationInfo = async (userId) => {
  try {
    const result = await executeSql(
      'SELECT * FROM gamification_points WHERE userId = ?',
      [userId]
    );

    if (result.rows.length === 0) {
      return {
        totalPoints: 0,
        level: 1,
        currentLevelPoints: 0,
        levelInfo: GAMIFICATION_LEVELS[0],
      };
    }

    const gp = result.rows._array[0];
    const levelInfo = GAMIFICATION_LEVELS.find(l => l.level === gp.level);

    return {
      totalPoints: gp.totalPoints,
      level: gp.level,
      currentLevelPoints: gp.currentLevelPoints,
      levelInfo,
      nextLevel: GAMIFICATION_LEVELS[gp.level] || null,
    };
  } catch (error) {
    console.error('❌ Erreur récupération gamification:', error);
    throw error;
  }
};

/**
 * Déverrouille un badge
 */
export const unlockBadge = async (userId, badgeId) => {
  try {
    // Vérifier si le badge est déjà déverrouillé
    const existing = await executeSql(
      'SELECT * FROM badges WHERE userId = ? AND badgeId = ?',
      [userId, badgeId]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️ Badge déjà déverrouillé');
      return false;
    }

    const badge = BADGES[badgeId];
    if (!badge) {
      throw new Error('Badge non trouvé');
    }

    const badgeRecordId = `badge_${userId}_${badgeId}`;
    const now = new Date().toISOString();

    await executeSql(
      `INSERT INTO badges (id, userId, badgeId, unlockedAt)
       VALUES (?, ?, ?, ?)`,
      [badgeRecordId, userId, badgeId, now]
    );

    // Ajouter des points bonus
    await addPoints(userId, badge.points, `Badge déverrouillé: ${badge.name}`);

    // Enregistrer l'activité
    await logActivity(userId, 'badge_unlocked', 'badge', badgeId, `Badge déverrouillé: ${badge.name}`);

    console.log('✅ Badge déverrouillé:', badgeId);
    return true;
  } catch (error) {
    console.error('❌ Erreur déverrouillage badge:', error);
    throw error;
  }
};

/**
 * Récupère tous les badges d'un utilisateur
 */
export const getUserBadges = async (userId) => {
  try {
    const result = await executeSql(
      'SELECT * FROM badges WHERE userId = ? ORDER BY unlockedAt DESC',
      [userId]
    );

    const userBadges = result.rows._array || [];
    return userBadges.map(b => ({
      ...b,
      badgeInfo: BADGES[b.badgeId],
    }));
  } catch (error) {
    console.error('❌ Erreur récupération badges:', error);
    return [];
  }
};

/**
 * Vérifie et déverrouille les badges automatiquement
 */
export const checkAndUnlockBadges = async (userId, grades = []) => {
  try {
    const unlockedBadges = [];

    // Badge: Premier 20/20
    const has20 = grades.some(g => g.value === 20 && g.maxValue === 20);
    if (has20) {
      const unlocked = await unlockBadge(userId, 'FIRST_20');
      if (unlocked) unlockedBadges.push('FIRST_20');
    }

    // Badge: Expert en Maths
    const mathGrades = grades.filter(g => g.subject === 'Mathématiques');
    const mathAverage = mathGrades.length > 0 
      ? mathGrades.reduce((sum, g) => sum + (g.value / g.maxValue * 20), 0) / mathGrades.length
      : 0;
    if (mathAverage >= 18) {
      const unlocked = await unlockBadge(userId, 'MATH_EXPERT');
      if (unlocked) unlockedBadges.push('MATH_EXPERT');
    }

    return unlockedBadges;
  } catch (error) {
    console.error('❌ Erreur vérification badges:', error);
    return [];
  }
};

/**
 * Crée un défi hebdomadaire
 */
export const createWeeklyChallenge = async (userId, subject, challenge) => {
  try {
    const challengeId = `challenge_${Date.now()}`;
    const now = new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    await executeSql(
      `INSERT INTO activity_log (id, userId, action, entityType, entityId, details, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [challengeId, userId, 'challenge_created', 'challenge', challengeId, JSON.stringify(challenge), now]
    );

    console.log('✅ Défi créé:', challengeId);
    return { id: challengeId, ...challenge, endDate };
  } catch (error) {
    console.error('❌ Erreur création défi:', error);
    throw error;
  }
};

/**
 * Complète un défi
 */
export const completeChallenge = async (userId, challengeId) => {
  try {
    const points = 50; // Points par défaut pour un défi
    await addPoints(userId, points, 'Défi complété');

    await logActivity(userId, 'challenge_completed', 'challenge', challengeId, 'Défi complété');

    console.log('✅ Défi complété');
    return { points };
  } catch (error) {
    console.error('❌ Erreur complétion défi:', error);
    throw error;
  }
};

/**
 * Récupère le classement global
 */
export const getGlobalLeaderboard = async (limit = 100) => {
  try {
    const result = await executeSql(
      `SELECT u.id, u.firstName, u.lastName, u.profileImage, gp.totalPoints, gp.level
       FROM gamification_points gp
       JOIN users u ON gp.userId = u.id
       ORDER BY gp.totalPoints DESC
       LIMIT ?`,
      [limit]
    );

    return result.rows._array || [];
  } catch (error) {
    console.error('❌ Erreur récupération classement:', error);
    return [];
  }
};

/**
 * Récupère le classement par matière
 */
export const getSubjectLeaderboard = async (subject, limit = 50) => {
  try {
    const result = await executeSql(
      `SELECT u.id, u.firstName, u.lastName, u.profileImage, 
              AVG((g.value / g.maxValue) * 20) as average, COUNT(g.id) as gradeCount
       FROM users u
       JOIN grades g ON u.id = g.userId
       JOIN subjects s ON g.subjectId = s.id
       WHERE s.name = ?
       GROUP BY u.id
       ORDER BY average DESC
       LIMIT ?`,
      [subject, limit]
    );

    return result.rows._array || [];
  } catch (error) {
    console.error('❌ Erreur récupération classement matière:', error);
    return [];
  }
};

/**
 * Récupère le classement régional
 */
export const getRegionalLeaderboard = async (region, limit = 50) => {
  try {
    const result = await executeSql(
      `SELECT u.id, u.firstName, u.lastName, u.school, gp.totalPoints, gp.level
       FROM gamification_points gp
       JOIN users u ON gp.userId = u.id
       WHERE u.school LIKE ?
       ORDER BY gp.totalPoints DESC
       LIMIT ?`,
      [`%${region}%`, limit]
    );

    return result.rows._array || [];
  } catch (error) {
    console.error('❌ Erreur récupération classement régional:', error);
    return [];
  }
};

/**
 * Enregistre une activité utilisateur
 */
export const logActivity = async (userId, action, entityType, entityId, details = '') => {
  try {
    const activityId = `activity_${Date.now()}`;
    const now = new Date().toISOString();

    await executeSql(
      `INSERT INTO activity_log (id, userId, action, entityType, entityId, details, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [activityId, userId, action, entityType, entityId, details, now]
    );

    return activityId;
  } catch (error) {
    console.error('❌ Erreur enregistrement activité:', error);
    throw error;
  }
};

/**
 * Récupère l'historique d'activité d'un utilisateur
 */
export const getUserActivityLog = async (userId, limit = 50) => {
  try {
    const result = await executeSql(
      `SELECT * FROM activity_log WHERE userId = ? ORDER BY createdAt DESC LIMIT ?`,
      [userId, limit]
    );

    return result.rows._array || [];
  } catch (error) {
    console.error('❌ Erreur récupération historique activité:', error);
    return [];
  }
};

/**
 * Calcule les statistiques de gamification
 */
export const getGamificationStats = async (userId) => {
  try {
    const gp = await getGamificationInfo(userId);
    const badges = await getUserBadges(userId);
    const activities = await getUserActivityLog(userId, 100);

    const stats = {
      totalPoints: gp.totalPoints,
      level: gp.level,
      badgesCount: badges.length,
      activitiesCount: activities.length,
      levelProgress: {
        current: gp.currentLevelPoints,
        next: gp.nextLevel ? gp.nextLevel.minPoints : 0,
      },
    };

    return stats;
  } catch (error) {
    console.error('❌ Erreur calcul statistiques gamification:', error);
    throw error;
  }
};
