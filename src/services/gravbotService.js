// ========================================
// FICHIER : src/services/gravbotService.js
// ========================================

/**
 * Service GravBot - Assistant IA personnel
 * Chatbot éducatif multilingue pour explications et exercices
 */

import axios from 'axios';
import { executeSql } from './database';

const GRAVBOT_API_URL = process.env.GRAVBOT_API_URL || 'https://api.anti-gravity.cm/gravbot';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'demo_key';

/**
 * Envoie un message à GravBot et reçoit une réponse
 */
export const sendMessageToGravBot = async (userId, message, language = 'fr', context = {}) => {
  try {
    const messageId = `msg_${Date.now()}`;
    const now = new Date().toISOString();

    // Sauvegarder le message
    await executeSql(
      `INSERT INTO messages (id, senderId, content, createdAt)
       VALUES (?, ?, ?, ?)`,
      [messageId, userId, message, now]
    );

    // Appeler l'API GravBot
    const response = await axios.post(
      `${GRAVBOT_API_URL}/chat`,
      {
        userId,
        message,
        language,
        context,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botResponse = response.data.response;
    const botMessageId = `msg_${Date.now() + 1}`;

    // Sauvegarder la réponse du bot
    await executeSql(
      `INSERT INTO messages (id, senderId, content, createdAt)
       VALUES (?, ?, ?, ?)`,
      [botMessageId, 'gravbot', botResponse, new Date().toISOString()]
    );

    console.log('✅ Message GravBot reçu');
    return {
      messageId: botMessageId,
      response: botResponse,
      suggestions: response.data.suggestions || [],
    };
  } catch (error) {
    console.error('❌ Erreur GravBot:', error);
    throw error;
  }
};

/**
 * Explique un concept éducatif
 */
export const explainConcept = async (userId, subject, concept, level = 'intermediate', language = 'fr') => {
  try {
    const prompt = `Explique le concept "${concept}" en ${subject} au niveau ${level} en ${language}. 
    Sois clair, concis et utilise des exemples concrets du contexte camerounais si possible.`;

    const response = await axios.post(
      `${GRAVBOT_API_URL}/explain`,
      {
        userId,
        subject,
        concept,
        level,
        language,
        prompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Explication générée');
    return {
      explanation: response.data.explanation,
      examples: response.data.examples || [],
      relatedConcepts: response.data.relatedConcepts || [],
    };
  } catch (error) {
    console.error('❌ Erreur explication concept:', error);
    throw error;
  }
};

/**
 * Génère des exercices personnalisés
 */
export const generateExercises = async (userId, subject, topic, difficulty = 'medium', count = 5, language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/generate-exercises`,
      {
        userId,
        subject,
        topic,
        difficulty,
        count,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Exercices générés');
    return {
      exercises: response.data.exercises || [],
      solutions: response.data.solutions || [],
      explanations: response.data.explanations || [],
    };
  } catch (error) {
    console.error('❌ Erreur génération exercices:', error);
    throw error;
  }
};

/**
 * Corrige un devoir automatiquement
 */
export const correctAssignment = async (userId, subject, assignmentText, maxScore = 20, language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/correct-assignment`,
      {
        userId,
        subject,
        assignmentText,
        maxScore,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Devoir corrigé');
    return {
      score: response.data.score,
      maxScore: response.data.maxScore,
      feedback: response.data.feedback,
      corrections: response.data.corrections || [],
      suggestions: response.data.suggestions || [],
    };
  } catch (error) {
    console.error('❌ Erreur correction devoir:', error);
    throw error;
  }
};

/**
 * Génère un résumé de cours
 */
export const generateCourseSummary = async (userId, subject, topic, courseContent, language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/summarize-course`,
      {
        userId,
        subject,
        topic,
        courseContent,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Résumé généré');
    return {
      summary: response.data.summary,
      keyPoints: response.data.keyPoints || [],
      mindMap: response.data.mindMap || {},
      flashcards: response.data.flashcards || [],
    };
  } catch (error) {
    console.error('❌ Erreur génération résumé:', error);
    throw error;
  }
};

/**
 * Crée une carte mentale interactive
 */
export const generateMindMap = async (userId, subject, topic, language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/generate-mindmap`,
      {
        userId,
        subject,
        topic,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Carte mentale générée');
    return response.data.mindMap;
  } catch (error) {
    console.error('❌ Erreur génération carte mentale:', error);
    throw error;
  }
};

/**
 * Génère des flashcards intelligentes
 */
export const generateFlashcards = async (userId, subject, topic, count = 10, language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/generate-flashcards`,
      {
        userId,
        subject,
        topic,
        count,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Flashcards générées');
    return response.data.flashcards || [];
  } catch (error) {
    console.error('❌ Erreur génération flashcards:', error);
    throw error;
  }
};

/**
 * Prédit les performances futures
 */
export const predictPerformance = async (userId, subject, historicalGrades = []) => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/predict-performance`,
      {
        userId,
        subject,
        historicalGrades,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Prédiction générée');
    return {
      predictedScore: response.data.predictedScore,
      confidence: response.data.confidence,
      recommendations: response.data.recommendations || [],
      riskFactors: response.data.riskFactors || [],
    };
  } catch (error) {
    console.error('❌ Erreur prédiction performance:', error);
    throw error;
  }
};

/**
 * Recommande des exercices basés sur les performances
 */
export const recommendExercises = async (userId, subject, recentGrades = []) => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/recommend-exercises`,
      {
        userId,
        subject,
        recentGrades,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Recommandations générées');
    return {
      exercises: response.data.exercises || [],
      difficulty: response.data.difficulty,
      estimatedTime: response.data.estimatedTime,
      focusAreas: response.data.focusAreas || [],
    };
  } catch (error) {
    console.error('❌ Erreur recommandations exercices:', error);
    throw error;
  }
};

/**
 * Génère un plan de révision personnalisé
 */
export const generateRevisionPlan = async (userId, subjects = [], examDate, language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/generate-revision-plan`,
      {
        userId,
        subjects,
        examDate,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Plan de révision généré');
    return {
      plan: response.data.plan || [],
      dailySchedule: response.data.dailySchedule || {},
      resources: response.data.resources || [],
      tips: response.data.tips || [],
    };
  } catch (error) {
    console.error('❌ Erreur génération plan révision:', error);
    throw error;
  }
};

/**
 * Fournit du soutien émotionnel et de la motivation
 */
export const getMotivationalSupport = async (userId, mood = 'neutral', language = 'fr') => {
  try {
    const response = await axios.post(
      `${GRAVBOT_API_URL}/motivational-support`,
      {
        userId,
        mood,
        language,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Soutien motivationnel fourni');
    return {
      message: response.data.message,
      tips: response.data.tips || [],
      resources: response.data.resources || [],
    };
  } catch (error) {
    console.error('❌ Erreur soutien motivationnel:', error);
    throw error;
  }
};

/**
 * Récupère l'historique des conversations
 */
export const getConversationHistory = async (userId, limit = 50) => {
  try {
    const result = await executeSql(
      `SELECT * FROM messages WHERE senderId = ? OR senderId = 'gravbot' ORDER BY createdAt DESC LIMIT ?`,
      [userId, limit]
    );

    return (result.rows._array || []).reverse();
  } catch (error) {
    console.error('❌ Erreur récupération historique:', error);
    return [];
  }
};

/**
 * Efface l'historique des conversations
 */
export const clearConversationHistory = async (userId) => {
  try {
    await executeSql(
      `DELETE FROM messages WHERE senderId = ? OR senderId = 'gravbot'`,
      [userId]
    );

    console.log('✅ Historique effacé');
    return true;
  } catch (error) {
    console.error('❌ Erreur effacement historique:', error);
    throw error;
  }
};
