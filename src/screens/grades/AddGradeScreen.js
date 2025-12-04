// ========================================
// FICHIER : src/screens/grades/AddGradeScreen.js
// ========================================

/**
 * Écran d'ajout de note
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Picker,
} from 'react-native';
import { COLORS, GRADE_TYPES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useGrades from '../../hooks/useGrades';
import useSubjects from '../../hooks/useSubjects';

export default function AddGradeScreen({ navigation }) {
  const { user } = useAuth();
  const { addGrade, loading: gradesLoading } = useGrades(user?.id);
  const { subjects, loading: subjectsLoading } = useSubjects(user?.id);

  const [subjectId, setSubjectId] = useState('');
  const [value, setValue] = useState('');
  const [maxValue, setMaxValue] = useState('20');
  const [coefficient, setCoefficient] = useState('1');
  const [type, setType] = useState('Devoir');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subjects && subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects]);

  const handleAddGrade = async () => {
    if (!subjectId) {
      setError('Veuillez sélectionner une matière');
      return;
    }

    if (!value || isNaN(value) || parseFloat(value) < 0) {
      setError('La note doit être un nombre positif');
      return;
    }

    if (!maxValue || isNaN(maxValue) || parseFloat(maxValue) <= 0) {
      setError('La note maximale doit être un nombre positif');
      return;
    }

    if (parseFloat(value) > parseFloat(maxValue)) {
      setError('La note ne peut pas dépasser la note maximale');
      return;
    }

    try {
      setError('');
      await addGrade({
        subjectId,
        value: parseFloat(value),
        maxValue: parseFloat(maxValue),
        coefficient: parseFloat(coefficient),
        type,
        comment: comment.trim() || '',
      });
      Alert.alert('Succès', 'Note ajoutée avec succès');
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout de la note');
    }
  };

  const loading = gradesLoading || subjectsLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Retour</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Ajouter une Note</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Matière */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Matière *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={subjectId}
                  onValueChange={setSubjectId}
                  style={styles.picker}
                  enabled={!loading && subjects && subjects.length > 0}
                >
                  {subjects && subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <Picker.Item
                        key={subject.id}
                        label={subject.name}
                        value={subject.id}
                      />
                    ))
                  ) : (
                    <Picker.Item label="Aucune matière" value="" />
                  )}
                </Picker>
              </View>
            </View>

            {/* Note */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 18"
                placeholderTextColor="#999"
                value={value}
                onChangeText={setValue}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            {/* Note maximale */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note Maximale *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 20"
                placeholderTextColor="#999"
                value={maxValue}
                onChangeText={setMaxValue}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            {/* Coefficient */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Coefficient</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 1"
                placeholderTextColor="#999"
                value={coefficient}
                onChangeText={setCoefficient}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            {/* Type de note */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type de Note *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={styles.picker}
                  enabled={!loading}
                >
                  {GRADE_TYPES.map((gradeType) => (
                    <Picker.Item key={gradeType} label={gradeType} value={gradeType} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Commentaire */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Commentaire</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ajouter un commentaire..."
                placeholderTextColor="#999"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>

            {/* Aperçu */}
            {value && maxValue && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Aperçu</Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewLeft}>
                    <Text style={styles.previewValue}>{value}/{maxValue}</Text>
                    <Text style={styles.previewPercentage}>
                      {((parseFloat(value) / parseFloat(maxValue)) * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.previewRight}>
                    <Text style={styles.previewType}>{type}</Text>
                    <Text style={styles.previewDate}>
                      {new Date().toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Message d'erreur */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
              </View>
            )}

            {/* Boutons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, loading && styles.addButtonDisabled]}
                onPress={handleAddGrade}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Ajouter</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
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
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.text,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  previewCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  previewLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  previewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  previewPercentage: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  previewRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  previewType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
