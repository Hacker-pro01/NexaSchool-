// ========================================
// FICHIER : src/screens/courses/CoursesScreen.js
// ========================================

/**
 * Écran de la bibliothèque de cours
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useCourses from '../../hooks/useCourses';

export default function CoursesScreen({ navigation }) {
  const { user } = useAuth();
  const { courses, loading } = useCourses(user?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Données d'exemple
  const allCourses = [
    {
      id: '1',
      title: 'Introduction aux Dérivées',
      subject: 'Mathématiques',
      category: 'math',
      duration: 45,
      difficulty: 'Moyen',
      videoUrl: 'https://youtube.com/watch?v=...',
      thumbnail: '📐',
      description: 'Comprendre les bases des dérivées',
      views: 1250,
      rating: 4.5,
    },
    {
      id: '2',
      title: 'Grammaire Française Avancée',
      subject: 'Français',
      category: 'french',
      duration: 60,
      difficulty: 'Difficile',
      videoUrl: 'https://youtube.com/watch?v=...',
      thumbnail: '📖',
      description: 'Maîtriser la grammaire française',
      views: 890,
      rating: 4.8,
    },
    {
      id: '3',
      title: 'Physique Quantique Expliquée',
      subject: 'Physique-Chimie',
      category: 'science',
      duration: 90,
      difficulty: 'Difficile',
      videoUrl: 'https://youtube.com/watch?v=...',
      thumbnail: '⚛️',
      description: 'Les principes de la physique quantique',
      views: 2100,
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Histoire du Cameroun',
      subject: 'Histoire-Géographie',
      category: 'history',
      duration: 75,
      difficulty: 'Facile',
      videoUrl: 'https://youtube.com/watch?v=...',
      thumbnail: '🗺️',
      description: 'L\'histoire riche du Cameroun',
      views: 1560,
      rating: 4.6,
    },
  ];

  const categories = [
    { id: 'all', label: 'Tous', icon: '📚' },
    { id: 'math', label: 'Maths', icon: '🔢' },
    { id: 'french', label: 'Français', icon: '📖' },
    { id: 'science', label: 'Sciences', icon: '🔬' },
    { id: 'history', label: 'Histoire', icon: '🗺️' },
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseThumbnail}>{item.thumbnail}</Text>
        <View style={styles.courseHeaderInfo}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseSubject}>{item.subject}</Text>
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>

      <Text style={styles.courseDescription}>{item.description}</Text>

      <View style={styles.courseStats}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statText}>{item.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>👁️</Text>
          <Text style={styles.statText}>{item.views}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.courseActions}>
        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => navigation.navigate('VideoPlayer', { courseId: item.id })}
        >
          <Text style={styles.watchButtonIcon}>▶️</Text>
          <Text style={styles.watchButtonText}>Regarder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonIcon}>⬇️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Bibliothèque de Cours</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un cours..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Catégories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === item.id && styles.categoryLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Liste des cours */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredCourses.length > 0 ? (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎓</Text>
          <Text style={styles.emptyTitle}>Aucun cours trouvé</Text>
          <Text style={styles.emptyText}>
            Essayez une autre recherche ou catégorie
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryLabelActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseThumbnail: {
    fontSize: 40,
    marginRight: 12,
  },
  courseHeaderInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  courseSubject: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  difficultyBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  courseDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  watchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  watchButtonIcon: {
    fontSize: 16,
  },
  watchButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonIcon: {
    fontSize: 18,
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
  },
});
