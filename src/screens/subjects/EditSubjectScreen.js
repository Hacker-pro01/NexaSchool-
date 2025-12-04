// ========================================
// FICHIER : src/screens/subjects/EditSubjectScreen.js
// ========================================

/**
 * Écran de modification de matière
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
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useSubjects from '../../hooks/useSubjects';

export default function EditSubjectScreen({ navigation, route }) {
  const { user } = useAuth();
  const { subjectId } = route.params;
  const { loading } = useSubjects(user?.id);

  const [name, setName] = useState('');
  const [coefficient, setCoefficient] = useState('1');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger les données de la matière
    // Simulé pour la démo
    setTimeout(() => {
      setName('Mathématiques');
      setCoefficient('4');
      setTeacher('M. Dupont');
      setRoom('A101');
      setDescription('Cours de mathématiques');
      setIsLoading(false);
    }, 500);
  }, [subjectId]);

  const handleUpdateSubject = async () => {
    if (!name.trim()) {
      setError('Le nom de la matière est obligatoire');
      return;
    }

    if (isNaN(coefficient) || parseFloat(coefficient) <= 0) {
      setError('Le coefficient doit être un nombre positif');
      return;
    }

    try {
      setError('');
      // Simuler la mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Succès', 'Matière mise à jour avec succès');
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
            <Text style={styles.title}>Modifier la Matière</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Nom de la matière */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom de la matière *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Mathématiques"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            {/* Coefficient */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Coefficient *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 4"
                placeholderTextColor="#999"
                value={coefficient}
                onChangeText={setCoefficient}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            {/* Professeur */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Professeur</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: M. Dupont"
                placeholderTextColor="#999"
                value={teacher}
                onChangeText={setTeacher}
                editable={!loading}
              />
            </View>

            {/* Salle */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Salle</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: A101"
                placeholderTextColor="#999"
                value={room}
                onChangeText={setRoom}
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
                style={[styles.updateButton, loading && styles.updateButtonDisabled]}
                onPress={handleUpdateSubject}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.updateButtonText}>Mettre à Jour</Text>
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
  updateButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
