// ========================================
// FICHIER : src/utils/constants.js
// ========================================

/**
 * Constantes globales de l'application
 * Application pour élèves du lycée au Cameroun
 */

// ID utilisateur par défaut
export const DEFAULT_USER_ID = "user123";

// ========== CONFIGURATION GÉNÉRALE ==========
export const APP_VERSION = "2.0.0";
export const API_BASE_URL = "https://api.schoolmasterplus.cm";
export const SUPPORT_EMAIL = "support@schoolmasterplus.cm";

// ========== JOURS ET DATES ==========
export const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// ========== TYPES DE NOTES ==========
export const GRADE_TYPES = ["Devoir", "Contrôle", "Examen", "Oral", "Projet", "Participation"];

// ========== NIVEAUX SCOLAIRES ==========
export const SCHOOL_LEVELS = {
  SECONDE: "Seconde",
  PREMIERE: "Première",
  TERMINALE: "Terminale",
};

// ========== SÉRIES SCOLAIRES (CAMEROUN) ==========
export const SCHOOL_SERIES = {
  A: "Série A (Littéraire)",
  C: "Série C (Scientifique)",
  D: "Série D (Technique)",
};

// ========== MATIÈRES PAR SÉRIE ==========
export const SUBJECTS_BY_SERIES = {
  A: ["Français", "Anglais", "Histoire-Géographie", "Philosophie", "Littérature", "Éducation Civique"],
  C: ["Mathématiques", "Physique-Chimie", "Sciences Naturelles", "Français", "Anglais", "Philosophie"],
  D: ["Mathématiques", "Technologie", "Dessin Technique", "Français", "Anglais", "Éducation Civique"],
};

// ========== TYPES D'EXAMENS ==========
export const EXAM_TYPES = {
  BEPC: "BEPC",
  PROBATOIRE: "Probatoire",
  BACCALAUREAT: "Baccalauréat",
  CONTROLE: "Contrôle Continu",
};

// ========== PALETTE DE COULEURS - DESIGN FUTURISTE NÉON ==========
export const COLORS_NEON = {
  // Couleurs principales
  primary: '#00F0FF',      // Cyan néon
  secondary: '#FF00FF',    // Magenta néon
  accent: '#00FF41',       // Vert néon
  background: '#0A0A0F',   // Noir profond
  surface: '#1A1A2E',      // Gris foncé
  white: '#FFFFFF',
  
  // Couleurs de statut
  success: '#00FF41',      // Vert néon
  warning: '#FFD700',      // Or
  danger: '#FF0055',       // Rose néon
  info: '#00F0FF',         // Cyan néon
  
  // Couleurs pour matières
  subject1: '#00F0FF',     // Cyan
  subject2: '#FF00FF',     // Magenta
  subject3: '#00FF41',     // Vert
  subject4: '#FFD700',     // Or
  subject5: '#FF0055',     // Rose
  subject6: '#00FFFF',     // Turquoise
  subject7: '#FF6B9D',     // Rose clair
  subject8: '#00D9FF',     // Cyan clair
  subject9: '#39FF14',     // Vert clair
  subject10: '#FF10F0',    // Violet
};

// ========== PALETTE DE COULEURS - DESIGN MINIMALISTE PREMIUM ==========
export const COLORS_PREMIUM = {
  // Couleurs principales
  primary: '#0066FF',      // Bleu royal
  secondary: '#4DA3FF',    // Bleu ciel
  accent: '#FF6B35',       // Orange vif
  background: '#FFFFFF',   // Blanc pur
  surface: '#F8F9FA',      // Gris très clair
  white: '#FFFFFF',
  
  // Couleurs de statut
  success: '#2ECC71',      // Vert
  warning: '#F39C12',      // Orange
  danger: '#E74C3C',       // Rouge
  info: '#3498DB',         // Bleu
  
  // Couleurs pour matières
  subject1: '#0066FF',     // Bleu
  subject2: '#E74C3C',     // Rouge
  subject3: '#2ECC71',     // Vert
  subject4: '#F39C12',     // Orange
  subject5: '#9B59B6',     // Violet
  subject6: '#1ABC9C',     // Turquoise
  subject7: '#E67E22',     // Carotte
  subject8: '#34495E',     // Bleu foncé
  subject9: '#16A085',     // Vert foncé
  subject10: '#27AE60',    // Vert clair
};

// ========== THÈME PAR DÉFAUT ==========
export const DEFAULT_THEME = "neon"; // "neon" ou "premium"
export const COLORS = DEFAULT_THEME === "neon" ? COLORS_NEON : COLORS_PREMIUM;

// ========== ABONNEMENTS PREMIUM ==========
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Gratuit",
    price: 0,
    currency: "FCFA",
    features: [
      "Gestion des matières",
      "Suivi des notes basique",
      "Emploi du temps",
      "Accès limité aux cours",
    ],
  },
  BASIC: {
    id: "basic",
    name: "Premium Basic",
    price: 2500,
    currency: "FCFA",
    duration: "month",
    features: [
      "Tout du plan gratuit",
      "Génération PDF illimitée",
      "Stockage cloud 5 GB",
      "Statistiques avancées",
      "Accès épreuves antérieures",
      "Support prioritaire",
    ],
  },
  PLUS: {
    id: "plus",
    name: "Premium Plus",
    price: 5000,
    currency: "FCFA",
    duration: "month",
    features: [
      "Tout du plan Basic",
      "Assistant IA GravBot illimité",
      "Correcteur automatique de devoirs",
      "Simulateur d'examens officiels",
      "Sessions d'étude collaborative",
      "Stockage cloud 20 GB",
      "Badges et certifications",
    ],
  },
  ELITE: {
    id: "elite",
    name: "Premium Elite",
    price: 10000,
    currency: "FCFA",
    duration: "month",
    features: [
      "Tout du plan Plus",
      "Professeur virtuel 24/7",
      "Accès réalité augmentée",
      "Mentorat avec professionnels",
      "Orientation personnalisée",
      "Stockage cloud 100 GB",
      "Accès anticipé nouvelles fonctionnalités",
      "Certificats blockchain",
    ],
  },
};

// ========== MÉTHODES DE PAIEMENT ==========
export const PAYMENT_METHODS = {
  ORANGE_MONEY: "orange_money",
  MTN_MONEY: "mtn_money",
};

// ========== STATUTS DE PAIEMENT ==========
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

// ========== NIVEAUX DE GAMIFICATION ==========
export const GAMIFICATION_LEVELS = [
  { level: 1, name: "Débutant", minPoints: 0, maxPoints: 100, icon: "🌱" },
  { level: 2, name: "Apprenti", minPoints: 101, maxPoints: 500, icon: "📚" },
  { level: 3, name: "Étudiant", minPoints: 501, maxPoints: 1500, icon: "🎓" },
  { level: 4, name: "Savant", minPoints: 1501, maxPoints: 3000, icon: "��" },
  { level: 5, name: "Expert", minPoints: 3001, maxPoints: 6000, icon: "⭐" },
  { level: 6, name: "Maître", minPoints: 6001, maxPoints: 10000, icon: "👑" },
  { level: 7, name: "Génie", minPoints: 10001, maxPoints: Infinity, icon: "🚀" },
];

// ========== BADGES DISPONIBLES ==========
export const BADGES = {
  FIRST_20: { id: "first_20", name: "Premier 20/20", icon: "🏆", points: 100 },
  STREAK_7: { id: "streak_7", name: "7 jours consécutifs", icon: "🔥", points: 50 },
  STREAK_30: { id: "streak_30", name: "30 jours consécutifs", icon: "🌟", points: 200 },
  MATH_EXPERT: { id: "math_expert", name: "Expert en Maths", icon: "🔢", points: 150 },
  SCIENCE_MASTER: { id: "science_master", name: "Maître des Sciences", icon: "🔬", points: 150 },
  HELPER: { id: "helper", name: "Entraide", icon: "🤝", points: 75 },
  MENTOR: { id: "mentor", name: "Mentor", icon: "👨‍🏫", points: 200 },
  PREMIUM_SUBSCRIBER: { id: "premium", name: "Abonné Premium", icon: "💎", points: 50 },
};

// ========== NOTIFICATIONS ==========
export const NOTIFICATION_TYPES = {
  COURSE_REMINDER: "course_reminder",
  GRADE_PUBLISHED: "grade_published",
  EXAM_ALERT: "exam_alert",
  NEW_MESSAGE: "new_message",
  ACHIEVEMENT: "achievement",
  PAYMENT_SUCCESS: "payment_success",
  SUBSCRIPTION_EXPIRING: "subscription_expiring",
};

// ========== CALENDRIER ACADÉMIQUE CAMEROUN ==========
export const ACADEMIC_CALENDAR = {
  schoolYear: "2024-2025",
  startDate: "2024-09-02",
  endDate: "2025-06-30",
  holidays: [
    { name: "Noël", startDate: "2024-12-23", endDate: "2025-01-06" },
    { name: "Pâques", startDate: "2025-04-07", endDate: "2025-04-21" },
    { name: "Été", startDate: "2025-06-30", endDate: "2025-09-01" },
  ],
  examPeriods: [
    { name: "Contrôles", startDate: "2024-10-15", endDate: "2024-10-31" },
    { name: "Probatoire", startDate: "2025-05-15", endDate: "2025-05-31" },
    { name: "Baccalauréat", startDate: "2025-06-01", endDate: "2025-06-20" },
  ],
};

// ========== CONFIGURATION OFFLINE ==========
export const OFFLINE_CONFIG = {
  maxCacheSize: 5242880, // 5 MB
  syncInterval: 300000,  // 5 minutes
  retryAttempts: 3,
  retryDelay: 5000,      // 5 secondes
};

// ========== CONFIGURATION NOTIFICATIONS ==========
export const NOTIFICATION_CONFIG = {
  courseReminderMinutes: 10,
  examAlertDays: [7, 3, 1],
  dailyNotificationTime: "08:00",
};

// ========== LANGUES SUPPORTÉES ==========
export const SUPPORTED_LANGUAGES = {
  FR: "Français",
  EN: "English",
  PIDGIN: "Pidgin",
};

// ========== VALIDATION ==========
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+237|237)?[6789]\d{8}$/,
};

// ========== LIMITES DE L'APPLICATION ==========
export const LIMITS = {
  MAX_SUBJECTS: 15,
  MAX_GRADES_PER_SUBJECT: 100,
  MAX_COURSES_PER_SUBJECT: 50,
  MAX_STUDY_GROUPS: 20,
  MAX_FILE_SIZE: 52428800, // 50 MB
  MAX_PROFILE_IMAGE_SIZE: 5242880, // 5 MB
};
