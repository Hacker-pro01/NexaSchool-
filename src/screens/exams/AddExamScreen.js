// ========================================
// FICHIER : src/screens/exams/AddExamScreen.js
// ========================================

/**
 * Écran d'ajout d'examen
 */

import React, { useState } from 'react';
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
import { COLORS, EXAM_TYPES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

export default function AddExamScreen({ navigation }) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('Examen');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExam = async () => {
    if (!title.trim() || !subject.trim() || !date.trim() || !duration.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (isNaN(duration) || parseFloat(duration) <= 0) {
      setError('La durée doit être un nombre positif');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Simuler l'ajout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Succès', 'Examen ajouté avec succès');
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout de l\'examen');
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Ajouter un Examen</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Titre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Titre de l'examen *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Examen Mathématiques"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                editable={!loading}
              />
            </View>

            {/* Matière */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Matière *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Mathématiques"
                placeholderTextColor="#999"
                value={subject}
                onChangeText={setSubject}
                editable={!loading}
              />
            </View>

            {/* Type d'examen */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type d'examen *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={styles.picker}
                  enabled={!loading}
                >
                  {Object.values(EXAM_TYPES).map((examType) => (
                    <Picker.Item key={examType} label={examType} value={examType} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/YYYY"
                placeholderTextColor="#999"
                value={date}
                onChangeText={setDate}
                editable={!loading}
              />
            </View>

            {/* Durée */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Durée (minutes) *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 120"
                placeholderTextColor="#999"
                value={duration}
                onChangeText={setDuration}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            {/* Lieu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lieu</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Salle A101"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
                editable={!loading}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ajouter une description..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>

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
                onPress={handleAddExam}
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
