// ========================================
// FICHIER : src/screens/home/DashboardScreen.js
// ========================================

/**
 * Écran du Dashboard principal
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useGrades from '../../hooks/useGrades';
import useGamification from '../../hooks/useGamification';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { grades } = useGrades(user?.id);
  const { gamificationInfo } = useGamification(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* En-tête avec salutation */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user.firstName}! 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Carte de gamification */}
      {gamificationInfo && (
        <View style={styles.gamificationCard}>
          <View style={styles.gamificationHeader}>
            <Text style={styles.gamificationTitle}>Votre Progression</Text>
            <Text style={styles.levelBadge}>
              {gamificationInfo.levelInfo?.icon} Niveau {gamificationInfo.level}
            </Text>
          </View>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Points</Text>
              <Text style={styles.pointsValue}>{gamificationInfo.totalPoints}</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (gamificationInfo.currentLevelPoints /
                        (gamificationInfo.nextLevel?.minPoints || 100)) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Subjects')}
        >
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Matières</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Grades')}
        >
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statValue}>{grades?.length || 0}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Cours</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Exams')}
        >
          <Text style={styles.statIcon}>✏️</Text>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Examens</Text>
        </TouchableOpacity>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddGrade')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Ajouter une note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('GravBot')}
          >
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionText}>GravBot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Courses')}
          >
            <Text style={styles.actionIcon}>🎓</Text>
            <Text style={styles.actionText}>Cours</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Prochains cours */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prochains Cours</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
            <Text style={styles.seeAllLink}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.courseCard}>
          <View style={styles.courseTime}>
            <Text style={styles.courseTimeText}>08:00</Text>
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseName}>Mathématiques</Text>
            <Text style={styles.courseTeacher}>M. Dupont</Text>
            <Text style={styles.courseRoom}>Salle A101</Text>
          </View>
          <Text style={styles.courseIcon}>📐</Text>
        </View>

        <View style={styles.courseCard}>
          <View style={styles.courseTime}>
            <Text style={styles.courseTimeText}>10:00</Text>
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseName}>Français</Text>
            <Text style={styles.courseTeacher}>Mme Martin</Text>
            <Text style={styles.courseRoom}>Salle B202</Text>
          </View>
          <Text style={styles.courseIcon}>📖</Text>
        </View>
      </View>

      {/* Recommandations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommandations</Text>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationIcon}>💡</Text>
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Réviser les dérivées</Text>
            <Text style={styles.recommendationText}>
              Vous avez eu 14/20 en Maths. Pratiquez les dérivées pour améliorer votre score.
            </Text>
          </View>
        </View>
      </View>

      {/* Espace vide en bas */}
      <View style={styles.spacer} />
    </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  gamificationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  gamificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gamificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  levelBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsContainer: {
    marginTop: 12,
  },
  pointsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAllLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  courseTime: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  courseTeacher: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  courseRoom: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  courseIcon: {
    fontSize: 24,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  recommendationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  spacer: {
    height: 40,
  },
});
