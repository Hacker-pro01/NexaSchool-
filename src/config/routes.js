// ========================================
// FICHIER : src/config/routes.js
// ========================================

/**
 * Configuration des routes de navigation
 */

export const ROUTES = {
  // ========== AUTHENTIFICATION ==========
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
    RESET_PASSWORD: 'ResetPassword',
  },

  // ========== NAVIGATION PRINCIPALE ==========
  MAIN: {
    HOME: 'Home',
    DASHBOARD: 'Dashboard',
    SUBJECTS: 'Subjects',
    GRADES: 'Grades',
    SCHEDULE: 'Schedule',
    EXAMS: 'Exams',
    COURSES: 'Courses',
    GRAVBOT: 'GravBot',
    PROFILE: 'Profile',
    NOTIFICATIONS: 'Notifications',
  },

  // ========== DÉTAILS ==========
  DETAILS: {
    SUBJECT_DETAIL: 'SubjectDetail',
    GRADE_DETAIL: 'GradeDetail',
    EXAM_DETAIL: 'ExamDetail',
    COURSE_DETAIL: 'CourseDetail',
    COURSE_VIDEO: 'CourseVideo',
  },

  // ========== FORMULAIRES ==========
  FORMS: {
    ADD_SUBJECT: 'AddSubject',
    EDIT_SUBJECT: 'EditSubject',
    ADD_GRADE: 'AddGrade',
    EDIT_GRADE: 'EditGrade',
    ADD_EXAM: 'AddExam',
    EDIT_EXAM: 'EditExam',
    ADD_COURSE: 'AddCourse',
  },

  // ========== PAIEMENTS ==========
  PAYMENT: {
    PAYMENT_METHODS: 'PaymentMethods',
    ORANGE_MONEY: 'OrangeMoney',
    MTN_MONEY: 'MTNMoney',
    EXPRESS_UNION: 'ExpressUnion',
    PAYMENT_CONFIRMATION: 'PaymentConfirmation',
    PAYMENT_HISTORY: 'PaymentHistory',
  },

  // ========== ABONNEMENTS ==========
  SUBSCRIPTION: {
    PLANS: 'SubscriptionPlans',
    UPGRADE: 'Upgrade',
    MANAGE: 'ManageSubscription',
  },

  // ========== GAMIFICATION ==========
  GAMIFICATION: {
    BADGES: 'Badges',
    LEADERBOARD: 'Leaderboard',
    ACHIEVEMENTS: 'Achievements',
    CHALLENGES: 'Challenges',
  },

  // ========== PARAMÈTRES ==========
  SETTINGS: {
    PROFILE: 'ProfileSettings',
    PREFERENCES: 'Preferences',
    SECURITY: 'Security',
    NOTIFICATIONS: 'NotificationSettings',
    ABOUT: 'About',
    HELP: 'Help',
  },

  // ========== MODAL ==========
  MODAL: {
    CONFIRM: 'ConfirmModal',
    ALERT: 'AlertModal',
    LOADING: 'LoadingModal',
  },
};

/**
 * Configuration des paramètres de navigation
 */
export const NAVIGATION_CONFIG = {
  // Options par défaut pour les écrans
  screenOptions: {
    headerShown: true,
    headerStyle: {
      backgroundColor: '#0A0A0F',
      borderBottomColor: '#00F0FF',
      borderBottomWidth: 1,
    },
    headerTintColor: '#00F0FF',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    cardStyle: {
      backgroundColor: '#0A0A0F',
    },
  },

  // Options pour les onglets
  tabBarOptions: {
    activeTintColor: '#00F0FF',
    inactiveTintColor: '#808080',
    style: {
      backgroundColor: '#1A1A2E',
      borderTopColor: '#00F0FF',
      borderTopWidth: 1,
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
  },

  // Options pour les transitions
  transitionConfig: {
    duration: 300,
    easing: 'ease-in-out',
  },
};

/**
 * Liens profonds (Deep Linking)
 */
export const DEEP_LINKS = {
  // Format: 'anti-gravity://path/to/screen'
  HOME: 'anti-gravity://home',
  DASHBOARD: 'anti-gravity://dashboard',
  SUBJECT: 'anti-gravity://subject/:id',
  GRADE: 'anti-gravity://grade/:id',
  EXAM: 'anti-gravity://exam/:id',
  COURSE: 'anti-gravity://course/:id',
  PAYMENT: 'anti-gravity://payment/:paymentId',
  PROFILE: 'anti-gravity://profile/:userId',
  NOTIFICATION: 'anti-gravity://notification/:notificationId',
};

/**
 * Icônes pour les onglets
 */
export const TAB_ICONS = {
  HOME: 'home',
  SUBJECTS: 'book',
  GRADES: 'chart-bar',
  SCHEDULE: 'calendar',
  EXAMS: 'clipboard-list',
  COURSES: 'play-circle',
  GRAVBOT: 'robot',
  PROFILE: 'user-circle',
  NOTIFICATIONS: 'bell',
  SETTINGS: 'cog',
};

/**
 * Ordre des onglets
 */
export const TAB_ORDER = [
  'Home',
  'Subjects',
  'Grades',
  'Schedule',
  'Exams',
  'Courses',
  'GravBot',
  'Profile',
];

/**
 * Écrans sans header
 */
export const SCREENS_WITHOUT_HEADER = [
  'Login',
  'Register',
  'ForgotPassword',
  'Splash',
];

/**
 * Écrans avec header personnalisé
 */
export const SCREENS_WITH_CUSTOM_HEADER = [
  'Dashboard',
  'GravBot',
  'PaymentMethods',
];

/**
 * Écrans modaux
 */
export const MODAL_SCREENS = [
  'ConfirmModal',
  'AlertModal',
  'LoadingModal',
];

/**
 * Écrans de transition
 */
export const TRANSITION_SCREENS = {
  FADE: ['Login', 'Register'],
  SLIDE: ['Dashboard', 'Subjects', 'Grades'],
  NONE: ['Splash'],
};

/**
 * Récupère la configuration d'un écran
 */
export const getScreenConfig = (screenName) => {
  const config = { ...NAVIGATION_CONFIG.screenOptions };

  if (SCREENS_WITHOUT_HEADER.includes(screenName)) {
    config.headerShown = false;
  }

  if (SCREENS_WITH_CUSTOM_HEADER.includes(screenName)) {
    config.headerShown = true;
  }

  return config;
};

/**
 * Récupère l'icône d'un onglet
 */
export const getTabIcon = (tabName) => {
  return TAB_ICONS[tabName] || 'circle';
};

/**
 * Vérifie si un écran est un modal
 */
export const isModalScreen = (screenName) => {
  return MODAL_SCREENS.includes(screenName);
};

/**
 * Récupère le type de transition pour un écran
 */
export const getTransitionType = (screenName) => {
  for (const [type, screens] of Object.entries(TRANSITION_SCREENS)) {
    if (screens.includes(screenName)) {
      return type;
    }
  }
  return 'SLIDE';
};
