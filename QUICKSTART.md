# 🚀 Démarrage Rapide - Anti-Gravity

## ⚡ Installation en 5 minutes

### 1. Cloner et installer

```bash
git clone https://github.com/anti-gravity/anti-gravity.git
cd anti-gravity
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Éditer .env avec vos clés API
```

### 3. Démarrer l'application

```bash
npm start
```

### 4. Lancer sur votre appareil

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Utilisation Basique

### Authentification

```javascript
import useAuth from './hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // Votre UI
  );
}
```

### Gestion des Notes

```javascript
import useGrades from './hooks/useGrades';

function GradesScreen() {
  const { grades, addGrade } = useGrades(userId);

  const handleAddGrade = async () => {
    await addGrade({
      subjectId: 'math_101',
      value: 18,
      maxValue: 20,
      type: 'Examen',
    });
  };

  return (
    // Votre UI
  );
}
```

### Utiliser GravBot

```javascript
import useGravBot from './hooks/useGravBot';

function GravBotScreen() {
  const { sendMessage, explain } = useGravBot(userId);

  const handleExplain = async () => {
    const response = await explain(
      'Mathématiques',
      'Dérivées',
      'intermediate',
      'fr'
    );
    console.log(response.explanation);
  };

  return (
    // Votre UI
  );
}
```

### Paiements

```javascript
import usePayment from './hooks/usePayment';

function PaymentScreen() {
  const { initiatePayment } = usePayment(userId);

  const handlePayment = async () => {
    const result = await initiatePayment(
      2500,              // Montant
      'orange_money',    // Méthode
      '+237612345678',   // Numéro
      'basic'            // Plan
    );
    console.log(result);
  };

  return (
    // Votre UI
  );
}
```

### Gamification

```javascript
import useGamification from './hooks/useGamification';

function ProfileScreen() {
  const { gamificationInfo, earnPoints } = useGamification(userId);

  const handleEarnPoints = async () => {
    await earnPoints(50, 'Exercice complété');
  };

  return (
    // Votre UI
  );
}
```

### Notifications

```javascript
import useNotifications from './hooks/useNotifications';

function NotificationsScreen() {
  const { 
    notifications, 
    sendCourseReminder,
    markAsRead 
  } = useNotifications(userId);

  return (
    // Votre UI
  );
}
```

## 🎨 Changer le Thème

```javascript
import { NEON_THEME, PREMIUM_THEME } from './src/config/themes';

// Utiliser le thème Néon
const theme = NEON_THEME;

// Utiliser le thème Premium
const theme = PREMIUM_THEME;

// Accéder aux couleurs
const primaryColor = theme.colors.primary;
```

## 📊 Initialiser l'Application

```javascript
import { initializeApp } from './src/services/initializationService';

// Au démarrage de l'app
useEffect(() => {
  const init = async () => {
    const result = await initializeApp();
    if (result.success) {
      console.log('App initialisée');
    }
  };
  init();
}, []);
```

## 🧪 Lancer les Tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- useAuth

# Avec couverture
npm test -- --coverage

# Mode watch
npm test -- --watch
```

## 🔍 Vérifier la Qualité du Code

```bash
# Linter
npm run lint

# Formater
npm run format

# Vérifier la couverture
npm test -- --coverage
```

## 📚 Documentation Complète

- [README.md](./README.md) - Vue d'ensemble
- [docs/API.md](./docs/API.md) - API complète
- [docs/INSTALLATION.md](./docs/INSTALLATION.md) - Installation détaillée
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Résumé du projet
- [TODO.md](./TODO.md) - Roadmap

## 🆘 Dépannage

### Erreur : "Cannot find module"
```bash
npm install
```

### Erreur : "Port already in use"
```bash
# Trouver le processus
lsof -i :19000

# Tuer le processus
kill -9 <PID>
```

### L'app ne se charge pas
1. Vérifier la connexion WiFi
2. Redémarrer Expo : `npm start`
3. Vérifier les logs : `npm start` affiche les erreurs

## 🚀 Prochaines Étapes

1. **Créer les écrans UI** - Commencer par les écrans d'authentification
2. **Implémenter les services** - Utiliser les hooks fournis
3. **Ajouter les tests** - Tester chaque fonctionnalité
4. **Déployer** - Suivre le guide de déploiement

## 📞 Besoin d'Aide ?

- 📧 Email : support@anti-gravity.cm
- 💬 Discord : [Rejoindre](https://discord.gg/anti-gravity)
- 🐛 GitHub Issues : [Signaler un bug](https://github.com/anti-gravity/anti-gravity/issues)

## 🎯 Ressources Utiles

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

---

**Bon développement !** 🎉

🚀 **Anti-Gravity - Révolutionner l'éducation au Cameroun**
