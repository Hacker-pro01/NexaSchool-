// ========================================
// FICHIER : src/screens/profile/ProfileScreen.js
// ========================================

/**
 * Écran du profil utilisateur
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useGamification from '../../hooks/useGamification';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isLoading } = useAuth();
  const { gamificationInfo, badges } = useGamification(user?.id);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Déconnecter',
          onPress: async () => {
            try {
              setLoading(true);
              await logout();
            } catch (err) {
              Alert.alert('Erreur', 'Erreur lors de la déconnexion');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête avec profil */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImage}>👤</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profileSchool}>
            {user.schoolLevel} - {user.schoolSeries}
          </Text>
        </View>
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
              <Text style={styles.pointsLabel}>Points Totaux</Text>
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
            <Text style={styles.progressText}>
              {gamificationInfo.currentLevelPoints} /{' '}
              {gamificationInfo.nextLevel?.minPoints || 100} points
            </Text>
          </View>
        </View>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Badges Débloqués ({badges.length})</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badge.badgeInfo?.icon}</Text>
                <Text style={styles.badgeName}>{badge.badgeInfo?.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Statistiques */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Matières</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎓</Text>
            <Text style={styles.statValue}>16.5</Text>
            <Text style={styles.statLabel}>Moyenne</Text>
          </View>
        </View>
      </View>

      {/* Menu des paramètres */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Paramètres</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>✏️</Text>
            <Text style={styles.settingLabel}>Modifier le profil</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Preferences')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>⚙️</Text>
            <Text style={styles.settingLabel}>Préférences</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Subscription')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>💎</Text>
            <Text style={styles.settingLabel}>Abonnement</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Security')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingLabel}>Sécurité</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Help')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={styles.settingLabel}>Aide & Support</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('About')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingLabel}>À propos</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de déconnexion */}
      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 2.0.0</Text>
        <Text style={styles.footerText}>© 2024 SchoolMasterPlus</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImage: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  profileSchool: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  gamificationCard: {
    marginHorizontal: 20,
    marginTop: 20,
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
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  badgesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingArrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});
