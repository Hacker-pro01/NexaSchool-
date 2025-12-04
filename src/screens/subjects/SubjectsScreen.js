// ========================================
// FICHIER : src/screens/subjects/SubjectsScreen.js
// ========================================

/**
 * Écran de gestion des matières
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
import { COLORS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useSubjects from '../../hooks/useSubjects';

export default function SubjectsScreen({ navigation }) {
  const { user } = useAuth();
  const { subjects, loading, addSubject, deleteSubject, refreshSubjects } = useSubjects(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshSubjects();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refreshSubjects]);

  const handleDeleteSubject = (subjectId) => {
    Alert.alert(
      'Supprimer la matière',
      'Êtes-vous sûr de vouloir supprimer cette matière ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: () => deleteSubject(subjectId),
          style: 'destructive',
        },
      ]
    );
  };

  const renderSubjectCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.subjectCard, { borderLeftColor: item.color || COLORS.primary }]}
      onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
    >
      <View style={styles.subjectHeader}>
        <View>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={styles.subjectTeacher}>{item.teacher || 'Non assigné'}</Text>
        </View>
        <View style={styles.subjectCoefficient}>
          <Text style={styles.coefficientLabel}>Coeff</Text>
          <Text style={styles.coefficientValue}>{item.coefficient}</Text>
        </View>
      </View>

      <View style={styles.subjectFooter}>
        <Text style={styles.subjectRoom}>{item.room || 'Salle non assignée'}</Text>
        <View style={styles.subjectActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditSubject', { subjectId: item.id })}
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteSubject(item.id)}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Matières</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddSubject')}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des matières */}
      {subjects && subjects.length > 0 ? (
        <FlatList
          data={subjects}
          renderItem={renderSubjectCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Aucune matière</Text>
          <Text style={styles.emptyText}>
            Commencez par ajouter vos matières pour suivre vos notes
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddSubject')}
          >
            <Text style={styles.emptyButtonText}>Ajouter une matière</Text>
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  subjectTeacher: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  subjectCoefficient: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  coefficientLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  coefficientValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subjectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectRoom: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  subjectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
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
