// ========================================
// FICHIER : src/config/themes.js
// ========================================

/**
 * Configuration des thèmes de l'application
 * Deux thèmes disponibles : Néon futuriste et Premium minimaliste
 */

// ========== THÈME NÉON FUTURISTE ==========
export const NEON_THEME = {
  name: 'neon',
  displayName: 'Néon Futuriste',
  description: 'Design cyberpunk éducatif avec couleurs lumineuses',
  
  colors: {
    // Couleurs principales
    primary: '#00F0FF',      // Cyan néon
    secondary: '#FF00FF',    // Magenta néon
    accent: '#00FF41',       // Vert néon
    background: '#0A0A0F',   // Noir profond
    surface: '#1A1A2E',      // Gris foncé
    surfaceLight: '#2D2D44', // Gris plus clair
    white: '#FFFFFF',
    black: '#000000',
    
    // Couleurs de statut
    success: '#00FF41',      // Vert néon
    warning: '#FFD700',      // Or
    danger: '#FF0055',       // Rose néon
    info: '#00F0FF',         // Cyan néon
    
    // Texte
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    
    // Bordures
    border: '#00F0FF',
    borderLight: '#2D2D44',
    
    // Ombres
    shadow: 'rgba(0, 240, 255, 0.2)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
  },

  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 28,
      '5xl': 32,
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#00F0FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    md: {
      shadowColor: '#00F0FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    lg: {
      shadowColor: '#00F0FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  components: {
    button: {
      primary: {
        backgroundColor: '#00F0FF',
        color: '#0A0A0F',
        borderColor: '#00F0FF',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#00F0FF',
        borderColor: '#00F0FF',
      },
      danger: {
        backgroundColor: '#FF0055',
        color: '#FFFFFF',
        borderColor: '#FF0055',
      },
    },
    card: {
      backgroundColor: '#1A1A2E',
      borderColor: '#00F0FF',
      borderWidth: 1,
    },
    input: {
      backgroundColor: '#2D2D44',
      borderColor: '#00F0FF',
      color: '#FFFFFF',
      placeholderColor: '#808080',
    },
  },
};

// ========== THÈME PREMIUM MINIMALISTE ==========
export const PREMIUM_THEME = {
  name: 'premium',
  displayName: 'Premium Minimaliste',
  description: 'Design moderne et élégant',
  
  colors: {
    // Couleurs principales
    primary: '#0066FF',      // Bleu royal
    secondary: '#4DA3FF',    // Bleu ciel
    accent: '#FF6B35',       // Orange vif
    background: '#FFFFFF',   // Blanc pur
    surface: '#F8F9FA',      // Gris très clair
    surfaceLight: '#F0F2F5', // Gris clair
    white: '#FFFFFF',
    black: '#000000',
    
    // Couleurs de statut
    success: '#2ECC71',      // Vert
    warning: '#F39C12',      // Orange
    danger: '#E74C3C',       // Rouge
    info: '#3498DB',         // Bleu
    
    // Texte
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    textMuted: '#BDC3C7',
    
    // Bordures
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    
    // Ombres
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',
  },

  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 28,
      '5xl': 32,
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  components: {
    button: {
      primary: {
        backgroundColor: '#0066FF',
        color: '#FFFFFF',
        borderColor: '#0066FF',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#0066FF',
        borderColor: '#0066FF',
      },
      danger: {
        backgroundColor: '#E74C3C',
        color: '#FFFFFF',
        borderColor: '#E74C3C',
      },
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E0E0E0',
      borderWidth: 1,
    },
    input: {
      backgroundColor: '#F8F9FA',
      borderColor: '#E0E0E0',
      color: '#2C3E50',
      placeholderColor: '#BDC3C7',
    },
  },
};

// ========== THÈME SOMBRE (POUR LES DEUX STYLES) ==========
export const DARK_NEON_THEME = {
  ...NEON_THEME,
  isDark: true,
};

export const DARK_PREMIUM_THEME = {
  ...PREMIUM_THEME,
  isDark: true,
  colors: {
    ...PREMIUM_THEME.colors,
    background: '#1A1A1A',
    surface: '#2D2D2D',
    surfaceLight: '#3D3D3D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    border: '#404040',
    borderLight: '#2D2D2D',
  },
};

// ========== EXPORT DES THÈMES ==========
export const THEMES = {
  neon: NEON_THEME,
  premium: PREMIUM_THEME,
  darkNeon: DARK_NEON_THEME,
  darkPremium: DARK_PREMIUM_THEME,
};

/**
 * Récupère un thème par son nom
 */
export const getTheme = (themeName = 'neon', isDark = false) => {
  if (isDark) {
    return themeName === 'neon' ? DARK_NEON_THEME : DARK_PREMIUM_THEME;
  }
  return themeName === 'neon' ? NEON_THEME : PREMIUM_THEME;
};

/**
 * Crée un contexte de thème pour React
 */
export const createThemeContext = () => {
  const defaultTheme = NEON_THEME;
  return {
    theme: defaultTheme,
    isDark: false,
    toggleTheme: () => {},
    setTheme: () => {},
  };
};
