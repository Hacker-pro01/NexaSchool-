// ========================================
// FICHIER : src/screens/schedule/ScheduleScreen.js
// ========================================

/**
 * Écran de l'emploi du temps
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS, DAYS_OF_WEEK } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

export default function ScheduleScreen({ navigation }) {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Lundi
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Données d'exemple
  const schedule = {
    0: [ // Lundi
      { id: '1', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', startTime: '08:00', endTime: '09:30' },
      { id: '2', subject: 'Français', teacher: 'Mme Martin', room: 'B202', startTime: '10:00', endTime: '11:30' },
      { id: '3', subject: 'Anglais', teacher: 'M. Johnson', room: 'C303', startTime: '13:00', endTime: '14:30' },
    ],
    1: [ // Mardi
      { id: '4', subject: 'Physique-Chimie', teacher: 'M. Leclerc', room: 'D404', startTime: '08:00', endTime: '09:30' },
      { id: '5', subject: 'Histoire-Géographie', teacher: 'Mme Dubois', room: 'E505', startTime: '10:00', endTime: '11:30' },
    ],
    2: [ // Mercredi
      { id: '6', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', startTime: '08:00', endTime: '09:30' },
      { id: '7', subject: 'Biologie', teacher: 'Mme Petit', room: 'F606', startTime: '14:00', endTime: '15:30' },
    ],
    3: [ // Jeudi
      { id: '8', subject: 'Français', teacher: 'Mme Martin', room: 'B202', startTime: '09:00', endTime: '10:30' },
      { id: '9', subject: 'Anglais', teacher: 'M. Johnson', room: 'C303', startTime: '11:00', endTime: '12:30' },
      { id: '10', subject: 'Informatique', teacher: 'M. Moreau', room: 'G707', startTime: '14:00', endTime: '15:30' },
    ],
    4: [ // Vendredi
      { id: '11', subject: 'Physique-Chimie', teacher: 'M. Leclerc', room: 'D404', startTime: '08:00', endTime: '09:30' },
      { id: '12', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', startTime: '10:00', endTime: '11:30' },
    ],
    5: [], // Samedi
    6: [], // Dimanche
  };

  const currentDaySchedule = schedule[selectedDay] || [];

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.startTime}>{item.startTime}</Text>
        <View style={styles.timeDivider} />
        <Text style={styles.endTime}>{item.endTime}</Text>
      </View>

      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.subject}</Text>
        <View style={styles.courseDetails}>
          <Text style={styles.courseDetail}>👨‍🏫 {item.teacher}</Text>
          <Text style={styles.courseDetail}>📍 {item.room}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreIcon}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Emploi du Temps</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCourse')}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Sélecteur de jour */}
      <View style={styles.daySelector}>
        <FlatList
          data={DAYS_OF_WEEK}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === index && styles.dayButtonTextActive,
                ]}
              >
                {item.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorContent}
        />
      </View>

      {/* Cours du jour */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : currentDaySchedule.length > 0 ? (
        <FlatList
          data={currentDaySchedule}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>Aucun cours</Text>
          <Text style={styles.emptyText}>
            Vous n'avez pas de cours le {DAYS_OF_WEEK[selectedDay].toLowerCase()}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddCourse')}
          >
            <Text style={styles.emptyButtonText}>Ajouter un cours</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vue hebdomadaire */}
      <View style={styles.weeklyViewContainer}>
        <Text style={styles.weeklyViewTitle}>Vue Hebdomadaire</Text>
        <View style={styles.weeklyGrid}>
          {DAYS_OF_WEEK.map((day, index) => (
            <View key={index} style={styles.weeklyDay}>
              <Text style={styles.weeklyDayName}>{day.substring(0, 3)}</Text>
              <Text style={styles.weeklyCourseCount}>
                {schedule[index]?.length || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
  daySelector: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    minWidth: 50,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  timeContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  startTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timeDivider: {
    width: 2,
    height: 8,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  endTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  courseDetails: {
    gap: 4,
  },
  courseDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
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
  weeklyViewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  weeklyViewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyDay: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  weeklyDayName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  weeklyCourseCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
