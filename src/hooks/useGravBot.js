// ========================================
// FICHIER : src/hooks/useGravBot.js
// ========================================

/**
 * Hook personnalisé pour l'interaction avec GravBot
 */

import { useState, useCallback } from 'react';
import {
  sendMessageToGravBot,
  explainConcept,
  generateExercises,
  correctAssignment,
  generateCourseSummary,
  generateMindMap,
  generateFlashcards,
  predictPerformance,
  recommendExercises,
  generateRevisionPlan,
  getMotivationalSupport,
  getConversationHistory,
  clearConversationHistory,
} from '../services/gravbotService';

export default function useGravBot(userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);

  const sendMessage = useCallback(async (message, language = 'fr', context = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ajouter le message utilisateur
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      const response = await sendMessageToGravBot(userId, message, language, context);
      
      // Ajouter la réponse du bot
      setMessages(prev => [...prev, { role: 'bot', content: response.response }]);
      setCurrentResponse(response);

      console.log('✅ Message envoyé à GravBot');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi du message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const explain = useCallback(async (subject, concept, level = 'intermediate', language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await explainConcept(userId, subject, concept, level, language);
      setCurrentResponse(response);

      console.log('✅ Explication reçue');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'explication';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const generateExercisesForTopic = useCallback(async (subject, topic, difficulty = 'medium', count = 5, language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await generateExercises(userId, subject, topic, difficulty, count, language);
      setCurrentResponse(response);

      console.log('✅ Exercices générés');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération d\'exercices';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const correctAssignmentText = useCallback(async (subject, assignmentText, maxScore = 20, language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await correctAssignment(userId, subject, assignmentText, maxScore, language);
      setCurrentResponse(response);

      console.log('✅ Devoir corrigé');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la correction';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const summarizeCourse = useCallback(async (subject, topic, courseContent, language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await generateCourseSummary(userId, subject, topic, courseContent, language);
      setCurrentResponse(response);

      console.log('✅ Résumé généré');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération du résumé';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createMindMap = useCallback(async (subject, topic, language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await generateMindMap(userId, subject, topic, language);
      setCurrentResponse(response);

      console.log('✅ Carte mentale générée');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération de la carte mentale';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createFlashcards = useCallback(async (subject, topic, count = 10, language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await generateFlashcards(userId, subject, topic, count, language);
      setCurrentResponse(response);

      console.log('✅ Flashcards générées');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération des flashcards';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const predictPerf = useCallback(async (subject, historicalGrades = []) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await predictPerformance(userId, subject, historicalGrades);
      setCurrentResponse(response);

      console.log('✅ Prédiction générée');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la prédiction';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const recommendExercisesForSubject = useCallback(async (subject, recentGrades = []) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await recommendExercises(userId, subject, recentGrades);
      setCurrentResponse(response);

      console.log('✅ Recommandations générées');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération des recommandations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createRevisionPlan = useCallback(async (subjects = [], examDate, language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await generateRevisionPlan(userId, subjects, examDate, language);
      setCurrentResponse(response);

      console.log('✅ Plan de révision généré');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération du plan de révision';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const getSupport = useCallback(async (mood = 'neutral', language = 'fr') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMotivationalSupport(userId, mood, language);
      setCurrentResponse(response);

      console.log('✅ Soutien motivationnel reçu');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la récupération du soutien';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadHistory = useCallback(async (limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);

      const history = await getConversationHistory(userId, limit);
      setMessages(history);

      console.log('✅ Historique chargé');
      return history;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du chargement de l\'historique';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const clearHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await clearConversationHistory(userId);
      setMessages([]);

      console.log('✅ Historique effacé');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'effacement de l\'historique';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    isLoading,
    error,
    messages,
    currentResponse,
    sendMessage,
    explain,
    generateExercises: generateExercisesForTopic,
    correctAssignment: correctAssignmentText,
    summarizeCourse,
    createMindMap,
    createFlashcards,
    predictPerformance: predictPerf,
    recommendExercises: recommendExercisesForSubject,
    generateRevisionPlan: createRevisionPlan,
    getMotivationalSupport: getSupport,
    loadHistory,
    clearHistory,
  };
}
