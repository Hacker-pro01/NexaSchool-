// ========================================
// FICHIER : src/screens/grades/GradesScreen.js
// ========================================

/**
 * Écran de suivi des notes
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
  Dimensions,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useGrades from '../../hooks/useGrades';
import { calculateSubjectAverage, getGradeColor, formatAverage } from '../../services/gradeCalculator';

const { width } = Dimensions.get('window');

export default function GradesScreen({ navigation }) {
  const { user } = useAuth();
  const { grades, loading, deleteGrade, refreshGrades } = useGrades(user?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshGrades();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refreshGrades]);

  const handleDeleteGrade = (gradeId) => {
    Alert.alert(
      'Supprimer la note',
      'Êtes-vous sûr de vouloir supprimer cette note ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: () => deleteGrade(gradeId),
          style: 'destructive',
        },
      ]
    );
  };

  // Grouper les notes par matière
  const groupedGrades = grades?.reduce((acc, grade) => {
    const subject = grade.subjectId;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(grade);
    return acc;
  }, {});

  const renderGradeCard = ({ item }) => {
    const percentage = (item.value / item.maxValue) * 100;
    const color = getGradeColor((item.value / item.maxValue) * 20);

    return (
      <View style={styles.gradeCard}>
        <View style={styles.gradeLeft}>
          <View style={[styles.gradeCircle, { backgroundColor: color }]}>
            <Text style={styles.gradeValue}>{item.value}</Text>
            <Text style={styles.gradeMax}>/{item.maxValue}</Text>
          </View>
          <View style={styles.gradeInfo}>
            <Text style={styles.gradeType}>{item.type}</Text>
            <Text style={styles.gradeDate}>
              {new Date(item.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>
        <View style={styles.gradeRight}>
          <Text style={[styles.gradePercentage, { color }]}>
            {percentage.toFixed(0)}%
          </Text>
          <TouchableOpacity
            style={styles.deleteGradeButton}
            onPress={() => handleDeleteGrade(item.id)}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSubjectSection = ({ item: [subjectId, subjectGrades] }) => {
    const average = calculateSubjectAverage(subjectGrades);
    const color = getGradeColor(average);

    return (
      <View style={styles.subjectSection}>
        <TouchableOpacity
          style={[styles.subjectHeader, { borderLeftColor: color }]}
          onPress={() => setSelectedSubject(selectedSubject === subjectId ? null : subjectId)}
        >
          <View style={styles.subjectHeaderLeft}>
            <Text style={styles.subjectName}>Matière {subjectId}</Text>
            <Text style={styles.gradeCount}>{subjectGrades.length} note(s)</Text>
          </View>
          <View style={styles.subjectHeaderRight}>
            <View style={[styles.averageBadge, { backgroundColor: color }]}>
              <Text style={styles.averageText}>{formatAverage(average)}</Text>
            </View>
            <Text style={styles.expandIcon}>
              {selectedSubject === subjectId ? '▼' : '▶'}
            </Text>
          </View>
        </TouchableOpacity>

        {selectedSubject === subjectId && (
          <View style={styles.gradesContainer}>
            {subjectGrades.map((grade) => (
              <View key={grade.id}>
                {renderGradeCard({ item: grade })}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const subjectEntries = groupedGrades ? Object.entries(groupedGrades) : [];

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddGrade')}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques globales */}
      {grades && grades.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{grades.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Moyenne</Text>
            <Text style={styles.statValue}>
              {formatAverage(
                grades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) / grades.length
              )}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Meilleure</Text>
            <Text style={styles.statValue}>
              {Math.max(...grades.map((g) => (g.value / g.maxValue) * 20)).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Liste des notes */}
      {subjectEntries.length > 0 ? (
        <FlatList
          data={subjectEntries}
          renderItem={renderSubjectSection}
          keyExtractor={([subjectId]) => subjectId}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Aucune note</Text>
          <Text style={styles.emptyText}>
            Commencez par ajouter vos notes pour suivre votre progression
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddGrade')}
          >
            <Text style={styles.emptyButtonText}>Ajouter une note</Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subjectSection: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  subjectHeaderLeft: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  gradeCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  subjectHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  averageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  averageText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  expandIcon: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  gradesContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },
  gradeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gradeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  gradeMax: {
    fontSize: 10,
    color: COLORS.white,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeType: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  gradeDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  gradeRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  gradePercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteGradeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
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
    lineHeight: 20,
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
