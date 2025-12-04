// ========================================
// FICHIER : src/screens/exams/ExamsScreen.js
// ========================================

/**
 * Écran de gestion des examens
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { COLORS, EXAM_TYPES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

export default function ExamsScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, upcoming, completed

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Données d'exemple
  const exams = [
    {
      id: '1',
      title: 'Examen Mathématiques',
      subject: 'Mathématiques',
      type: 'Examen',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      location: 'Salle A101',
      status: 'upcoming',
      description: 'Examen final de mathématiques',
    },
    {
      id: '2',
      title: 'Contrôle Français',
      subject: 'Français',
      type: 'Contrôle',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      location: 'Salle B202',
      status: 'upcoming',
      description: 'Contrôle de littérature',
    },
    {
      id: '3',
      title: 'Examen Physique-Chimie',
      subject: 'Physique-Chimie',
      type: 'Examen',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      location: 'Salle D404',
      status: 'completed',
      score: 16,
      maxScore: 20,
      description: 'Examen de physique-chimie',
    },
  ];

  const filteredExams = exams.filter((exam) => {
    if (selectedFilter === 'upcoming') return exam.status === 'upcoming';
    if (selectedFilter === 'completed') return exam.status === 'completed';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return COLORS.warning;
      case 'completed':
        return COLORS.success;
      default:
        return COLORS.primary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'completed':
        return 'Complété';
      default:
        return 'Inconnu';
    }
  };

  const getDaysUntil = (date) => {
    const now = new Date();
    const examDate = new Date(date);
    const diff = examDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const renderExamCard = ({ item }) => {
    const daysUntil = getDaysUntil(item.date);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={[styles.examCard, { borderLeftColor: statusColor }]}
        onPress={() => navigation.navigate('ExamDetail', { examId: item.id })}
      >
        <View style={styles.examHeader}>
          <View style={styles.examTitleContainer}>
            <Text style={styles.examTitle}>{item.title}</Text>
            <Text style={styles.examSubject}>{item.subject}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>

        <View style={styles.examDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📅</Text>
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(item.date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏱️</Text>
            <View>
              <Text style={styles.detailLabel}>Durée</Text>
              <Text style={styles.detailValue}>{item.duration} min</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <View>
              <Text style={styles.detailLabel}>Lieu</Text>
              <Text style={styles.detailValue}>{item.location}</Text>
            </View>
          </View>
        </View>

        {item.status === 'upcoming' && daysUntil > 0 && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              {daysUntil === 0 ? 'Aujourd\'hui' : `Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`}
            </Text>
          </View>
        )}

        {item.status === 'completed' && item.score !== undefined && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>
              {item.score}/{item.maxScore}
            </Text>
            <Text style={styles.scorePercentage}>
              {((item.score / item.maxScore) * 100).toFixed(0)}%
            </Text>
          </View>
        )}

        <View style={styles.examActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ExamSimulator', { examId: item.id })}
          >
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Simuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ExamDetail', { examId: item.id })}
          >
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Détails</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Examens</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExam')}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'all' && styles.filterTextActive,
            ]}
          >
            Tous ({exams.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'upcoming' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'upcoming' && styles.filterTextActive,
            ]}
          >
            À venir ({exams.filter((e) => e.status === 'upcoming').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'completed' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('completed')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'completed' && styles.filterTextActive,
            ]}
          >
            Complétés ({exams.filter((e) => e.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des examens */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredExams.length > 0 ? (
        <FlatList
          data={filteredExams}
          renderItem={renderExamCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✏️</Text>
          <Text style={styles.emptyTitle}>Aucun examen</Text>
          <Text style={styles.emptyText}>
            Vous n'avez pas d'examen dans cette catégorie
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddExam')}
          >
            <Text style={styles.emptyButtonText}>Ajouter un examen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  examCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examTitleContainer: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  examSubject: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  examDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  countdownContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
  scoreContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scorePercentage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  examActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
