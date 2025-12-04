# 🚀  NexaSchool- Application Révolutionnaire pour Élèves du Lycée au Cameroun

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)

## 📋 Vue d'ensemble

** NexaSchool** est une application mobile et web complète, moderne et futuriste destinée aux élèves du lycée au Cameroun. Elle regroupe toutes les fonctionnalités essentielles pour réussir sa scolarité :

- ✅ Gestion des matières et emploi du temps
- ✅ Suivi des notes avec moyennes automatiques
- ✅ Assistant IA personnel (GravBot)
- ✅ Système de paiement multi-opérateur (Orange Money, MTN, Express Union)
- ✅ Gamification et système de points
- ✅ Notifications intelligentes
- ✅ Abonnements premium
- ✅ Fonctionnement hors-ligne optimisé

## 🎯 Fonctionnalités Principales

### 📚 Gestion Académique
- **Matières** : Ajout, modification, suppression avec coefficients
- **Emploi du temps** : Hebdomadaire/journalier avec rappels
- **Notes** : Suivi détaillé avec moyennes automatiques
- **Examens** : BEPC, Probatoire, Baccalauréat
- **Devoirs** : Gestion et suivi des remises

### 🤖 Intelligence Artificielle (GravBot)
- Chatbot éducatif multilingue (Français, Anglais, Pidgin)
- Explications de concepts
- Génération d'exercices personnalisés
- Correction automatique de devoirs
- Résumés de cours et cartes mentales
- Prédiction de performances
- Soutien émotionnel et motivation

### 💰 Système de Paiement
- **Orange Money** (prioritaire)
- **MTN Mobile Money**
- **Express Union Mobile**
- Abonnements Premium (Basic, Plus, Elite)
- Historique des transactions

### 🏆 Gamification
- Système de points et niveaux (7 niveaux)
- Badges débloquables
- Classements global, par matière, régional
- Défis hebdomadaires
- Historique d'activité

### 🔔 Notifications Intelligentes
- Rappels de cours
- Alertes d'examens
- Notifications de notes
- Accomplissements
- Notifications d'abonnement

### 🎨 Design Futuriste
- **Thème Néon** : Cyberpunk éducatif avec couleurs lumineuses
- **Thème Premium** : Minimaliste et élégant
- Mode clair/sombre
- Animations fluides
- Interface intuitive

## 🛠️ Stack Technologique

### Frontend
- **React Native** avec Expo
- **React Navigation** pour la navigation
- **Zustand** pour la gestion d'état
- **Tailwind CSS** pour les styles
- **Expo SQLite** pour la base de données locale

### Backend (API)
- **Node.js + Express** (à implémenter)
- **PostgreSQL** pour la base de données
- **Redis** pour le cache
- **JWT** pour l'authentification

### Services IA
- **OpenAI API** pour GravBot
- **Google Vision API** pour OCR
- **Google Speech-to-Text** pour reconnaissance vocale

### Paiements
- **Orange Money API**
- **MTN Mobile Money API**
- **Express Union Mobile API**

## 📦 Installation

### Prérequis
- Node.js 16+
- npm ou yarn
- Expo CLI
- Un appareil Android/iOS ou émulateur

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone https://github.com/anti-gravity/anti-gravity.git
cd anti-gravity

# 2. Installer les dépendances
npm install
# ou
yarn install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# 4. Démarrer l'application
npm start
# ou
yarn start

# 5. Lancer sur Android
npm run android

# 6. Lancer sur iOS
npm run ios

# 7. Lancer sur Web
npm run web
```

## 🔑 Configuration

### Variables d'environnement (.env)

```env
# API
API_BASE_URL=https://api.anti-gravity.cm
GRAVBOT_API_URL=https://api.anti-gravity.cm/gravbot

# Clés API
OPENAI_API_KEY=your_openai_key
GOOGLE_VISION_API_KEY=your_google_vision_key

# Paiements
ORANGE_CLIENT_ID=your_orange_client_id
ORANGE_CLIENT_SECRET=your_orange_secret
MTN_CLIENT_ID=your_mtn_client_id
MTN_CLIENT_SECRET=your_mtn_secret
EXPRESS_UNION_CLIENT_ID=your_express_union_id
EXPRESS_UNION_CLIENT_SECRET=your_express_union_secret

# Firebase
FIREBASE_API_KEY=your_firebase_key
FIREBASE_PROJECT_ID=your_firebase_project_id

# Autres
APP_ENV=development
DEBUG=true
```

## 📱 Structure du Projet

```
anti-gravity/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useAuth.js
│   │   ├── useGrades.js
│   │   ├── useSubjects.js
│   │   ├── useCourses.js
│   │   ├── usePayment.js
│   │   ├── useGravBot.js
│   │   ├── useGamification.js
│   │   └── useNotifications.js
│   ├── screens/            # Écrans de l'application
│   ├── services/           # Services métier
│   │   ├── database.js
│   │   ├── authService.js
│   │   ├── paymentService.js
│   │   ├── gravbotService.js
│   │   ├── gamificationService.js
│   │   └── notificationService.js
│   ├���─ utils/
│   │   └── constants.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── index.js
├── assets/                 # Images, icônes, fonts
├── package.json
├── app.json
├── babel.config.js
└── README.md
```

## 🚀 Utilisation

### Authentification

```javascript
import useAuth from './hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const user = await login(email, password);
      console.log('Connecté:', user);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    // Votre UI de connexion
  );
}
```

### Gestion des Notes

```javascript
import useGrades from './hooks/useGrades';

function GradesScreen() {
  const { grades, addGrade, updateGrade, deleteGrade } = useGrades(userId);

  const handleAddGrade = async () => {
    await addGrade({
      subjectId: 'math_101',
      value: 18,
      maxValue: 20,
      type: 'Examen',
    });
  };

  return (
    // Votre UI de notes
  );
}
```

### Utilisation de GravBot

```javascript
import useGravBot from './hooks/useGravBot';

function GravBotScreen() {
  const { sendMessage, explain, generateExercises } = useGravBot(userId);

  const handleExplain = async () => {
    const response = await explain('Mathématiques', 'Dérivées', 'intermediate', 'fr');
    console.log(response.explanation);
  };

  return (
    // Votre UI GravBot
  );
}
```

### Paiements

```javascript
import usePayment from './hooks/usePayment';

function PaymentScreen() {
  const { initiatePayment, verifyPayment } = usePayment(userId);

  const handlePayment = async () => {
    const result = await initiatePayment(
      2500,                           // Montant
      'orange_money',                 // Méthode
      '+237612345678',               // Numéro
      'basic'                        // Plan
    );
    console.log('Paiement initié:', result);
  };

  return (
    // Votre UI paiement
  );
}
```

### Gamification

```javascript
import useGamification from './hooks/useGamification';

function ProfileScreen() {
  const { gamificationInfo, badges, earnPoints } = useGamification(userId);

  const handleEarnPoints = async () => {
    await earnPoints(50, 'Exercice complété');
  };

  return (
    // Votre UI profil avec gamification
  );
}
```

### Notifications

```javascript
import useNotifications from './hooks/useNotifications';

function NotificationsScreen() {
  const { 
    notifications, 
    unreadCount, 
    sendCourseReminder,
    markAsRead 
  } = useNotifications(userId);

  return (
    // Votre UI notifications
  );
}
```

## 📊 Plans d'Abonnement

### Gratuit
- Gestion des matières
- Suivi des notes basique
- Emploi du temps
- Accès limité aux cours

### Premium Basic (1000 FCFA/mois)
- Génération PDF illimitée
- Stockage cloud 5 GB
- Statistiques avancées
- Accès épreuves antérieures
- Support prioritaire

### Premium Plus (2500 FCFA/mois)
- Tout du plan Basic
- Assistant IA GravBot illimité
- Correcteur automatique
- Simulateur d'examens
- Sessions d'étude collaborative
- Stockage cloud 20 GB

### Premium Elite (5000 FCFA/mois)
- Tout du plan Plus
- Professeur virtuel 24/7
- Accès réalité augmentée
- Mentorat avec professionnels
- Orientation personnalisée
- Stockage cloud 100 GB
- Certificats blockchain

## 🎮 Système de Gamification

### Niveaux
1. 🌱 Débutant (0-100 pts)
2. 📚 Apprenti (101-500 pts)
3. 🎓 Étudiant (501-1500 pts)
4. 🧠 Savant (1501-3000 pts)
5. ⭐ Expert (3001-6000 pts)
6. 👑 Maître (6001-10000 pts)
7. 🚀 Génie (10000+ pts)

### Badges
- 🏆 Premier 20/20
- 🔥 7 jours consécutifs
- 🌟 30 jours cons��cutifs
- 🔢 Expert en Maths
- 🔬 Maître des Sciences
- 🤝 Entraide
- 👨‍🏫 Mentor
- 💎 Abonné Premium

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Chiffrement des données sensibles
- ✅ Validation des entrées
- ✅ Protection CSRF
- ✅ Rate limiting
- ✅ Backup automatique

## 📚 Documentation Complète

- [API Documentation](./docs/API.md)
- [Installation Guide](./docs/INSTALLATION.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez consulter [CONTRIBUTING.md](./CONTRIBUTING.md) pour les directives.

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Email : support@anti-gravity.cm
- Discord : [Rejoindre le serveur](https://discord.gg/anti-gravity)
- GitHub Issues : [Signaler un bug](https://github.com/anti-gravity/anti-gravity/issues)

## 🙏 Remerciements

Merci à tous les contributeurs et à la communauté éducative camerounaise pour leur soutien !

---

**Fait avec ❤️ pour les élèves du Cameroun**

🚀 ** NexaSchool - Révolutionner l'éducation au Cameroun**
# NexaSchool-

