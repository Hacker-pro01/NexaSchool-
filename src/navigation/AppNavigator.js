// ========================================
// FICHIER : src/navigation/AppNavigator.js
// ========================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../utils/constants';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import GradesScreen from '../screens/GradesScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import CoursesScreen from '../screens/CoursesScreen';

const Tab = createBottomTabNavigator();

/**
 * Navigateur principal avec onglets
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.dark,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.light,
            borderTopWidth: 1,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Accueil"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Matières"
          component={SubjectsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📚</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Notes"
          component={GradesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📊</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Emploi du temps"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📅</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Cours"
          component={CoursesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🎓</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Import Text pour les icônes (temporaire, à remplacer par des icônes réelles)
import { Text } from 'react-native';
