// ========================================
// FICHIER : src/screens/auth/ForgotPasswordScreen.js
// ========================================

/**
 * Écran de réinitialisation du mot de passe
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
} from 'react-native';
import { COLORS } from '../../utils/constants';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      Alert.alert(
        'Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre email',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Réinitialiser le Mot de Passe</Text>
          <Text style={styles.subtitle}>
            Entrez votre email pour recevoir un lien de réinitialisation
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>🔐</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          {/* Message d'erreur */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}

          {/* Message de succès */}
          {success && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>✅ Email envoyé avec succès</Text>
            </View>
          )}

          {/* Bouton d'envoi */}
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Envoyer le Lien</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Lien retour */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous vous souvenez de votre mot de passe ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  illustration: {
    alignItems: 'center',
    marginVertical: 40,
  },
  illustrationIcon: {
    fontSize: 80,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
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
  successContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  successText: {
    color: COLORS.success,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
