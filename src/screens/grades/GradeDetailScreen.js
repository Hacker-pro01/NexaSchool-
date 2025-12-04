// ========================================
// FICHIER : src/screens/grades/GradeDetailScreen.js
// ========================================

/**
 * Écran de détail d'une note
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { getGradeColor, formatAverage } from '../../services/gradeCalculator';

export default function GradeDetailScreen({ navigation, route }) {
  const { gradeId } = route.params;
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les détails de la note
    // Simulé pour la démo
    setTimeout(() => {
      setGrade({
        id: gradeId,
        subject: 'Mathématiques',
        value: 18,
        maxValue: 20,
        coefficient: 1,
        type: 'Examen',
        date: new Date().toISOString(),
        comment: 'Très bon travail, continue comme ça !',
        teacher: 'M. Dupont',
      });
      setLoading(false);
    }, 500);
  }, [gradeId]);

  const handleDeleteGrade = () => {
    Alert.alert(
      'Supprimer la note',
      'Êtes-vous sûr de vouloir supprimer cette note ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: () => {
            Alert.alert('Succès', 'Note supprimée');
            navigation.goBack();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditGrade = () => {
    navigation.navigate('EditGrade', { gradeId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!grade) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Note non trouvée</Text>
      </View>
    );
  }

  const percentage = (grade.value / grade.maxValue) * 100;
  const color = getGradeColor((grade.value / grade.maxValue) * 20);
  const gradeDate = new Date(grade.date);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Détails de la Note</Text>
      </View>

      {/* Affichage principal de la note */}
      <View style={[styles.gradeCard, { borderLeftColor: color }]}>
        <View style={styles.gradeHeader}>
          <View>
            <Text style={styles.gradeName}>{grade.subject}</Text>
            <Text style={styles.gradeType}>{grade.type}</Text>
          </View>
          <View style={[styles.gradeCircle, { backgroundColor: color }]}>
            <Text style={styles.gradeValue}>{grade.value}</Text>
            <Text style={styles.gradeMax}>/{grade.maxValue}</Text>
          </View>
        </View>

        <View style={styles.gradeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pourcentage</Text>
            <Text style={[styles.statValue, { color }]}>
              {percentage.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Coefficient</Text>
            <Text style={styles.statValue}>{grade.coefficient}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Équivalent /20</Text>
            <Text style={styles.statValue}>
              {formatAverage((grade.value / grade.maxValue) * 20)}
            </Text>
          </View>
        </View>
      </View>

      {/* Informations détaillées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>📅 Date</Text>
          <Text style={styles.infoValue}>
            {gradeDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>👨‍🏫 Professeur</Text>
          <Text style={styles.infoValue}>{grade.teacher}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>📝 Type</Text>
          <Text style={styles.infoValue}>{grade.type}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>⏱️ Heure</Text>
          <Text style={styles.infoValue}>
            {gradeDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      {/* Commentaire */}
      {grade.comment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commentaire</Text>
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{grade.comment}</Text>
          </View>
        </View>
      )}

      {/* Analyse de la note */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analyse</Text>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>Performance</Text>
          <View style={styles.performanceBar}>
            <View
              style={[
                styles.performanceFill,
                { width: `${percentage}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={styles.analysisValue}>
            {percentage >= 80
              ? '🌟 Excellent'
              : percentage >= 60
              ? '✅ Bon'
              : percentage >= 40
              ? '⚠️ Moyen'
              : '❌ Faible'}
          </Text>
        </View>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>Impact sur la moyenne</Text>
          <Text style={styles.analysisValue}>
            +{((grade.value / grade.maxValue) * 20 * grade.coefficient).toFixed(2)} points
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditGrade}
        >
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteGrade}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  gradeCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  gradeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  gradeType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  gradeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  gradeMax: {
    fontSize: 12,
    color: COLORS.white,
  },
  gradeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  commentBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  analysisItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  performanceBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  performanceFill: {
    height: '100%',
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  editIcon: {
    fontSize: 18,
  },
  editText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  deleteIcon: {
    fontSize: 18,
  },
  deleteText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  spacer: {
    height: 40,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 20,
  },
});
