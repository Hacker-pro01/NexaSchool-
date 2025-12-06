# 📦 Guide d'Installation - Nexaschool 

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 16+ ([Télécharger](https://nodejs.org/))
- **npm** 8+ ou **yarn** 3+ (inclus avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))
- **Expo CLI** : `npm install -g expo-cli`

### Pour développement mobile

- **Android Studio** (pour Android) ou **Xcode** (pour iOS)
- **Expo Go** app sur votre téléphone (optionnel)

## 📥 Installation du Projet

### 1. Cloner le repository

```bash
git clone https://github.com/NexaSchool/NexaSchool.git
cd NexaSchool 
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos clés API
nano .env
```

### Variables d'environnement requises

```env
# Configuration générale
APP_ENV=development
DEBUG=true

# API
API_BASE_URL=https://api.Nexaschool.cm
GRAVBOT_API_URL=https://api.Nexaschool.cm/gravbot

# Clés API (obtenir auprès des fournisseurs)
OPENAI_API_KEY=sk-...
GOOGLE_VISION_API_KEY=...

# Paiements
ORANGE_CLIENT_ID=...
ORANGE_CLIENT_SECRET=...
MTN_CLIENT_ID=...
MTN_CLIENT_SECRET=...
EXPRESS_UNION_CLIENT_ID=...
EXPRESS_UNION_CLIENT_SECRET=...

# Firebase (pour notifications push)
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

# Base de données (si backend local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Nexaschool 
DB_USER=postgres
DB_PASSWORD=...
```

## 🚀 Démarrage de l'Application

### Mode développement

```bash
# Démarrer le serveur Expo
npm start
# ou
yarn start
```

Cela ouvrira le menu Expo dans le terminal.

### Lancer sur Android

```bash
npm run android
# ou
yarn android
```

**Prérequis** :
- Android Studio installé
- Émulateur Android configuré ou appareil connecté

### Lancer sur iOS

```bash
npm run ios
# ou
yarn ios
```

**Prérequis** :
- macOS
- Xcode installé
- Simulateur iOS configuré

### Lancer sur Web

```bash
npm run web
# ou
yarn web
```

Cela ouvrira l'application dans votre navigateur par défaut.

### Lancer avec Expo Go (sur téléphone)

1. Installer l'app **Expo Go** sur votre téléphone
2. Lancer `npm start`
3. Scanner le QR code avec votre téléphone
4. L'app se chargera dans Expo Go

## 🗄️ Configuration de la Base de Données

### SQLite (Local - Défaut)

La base de données SQLite est créée automatiquement au premier démarrage.

```javascript
// Vérifier l'initialisation
import { initializeDatabase } from './src/services/database';

await initializeDatabase();
```

### PostgreSQL (Backend)

Si vous utilisez un backend Node.js/Express :

```bash
# Installer PostgreSQL
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Démarrer le service
sudo service postgresql start

# Créer la base de données
createdb anti_gravity

# Importer le schéma
psql anti_gravity < database/schema.sql
```

## 🔐 Configuration des Clés API

### OpenAI (pour GravBot)

1. Aller sur [platform.openai.com](https://platform.openai.com)
2. Créer un compte
3. Générer une clé API
4. Ajouter à `.env` : `OPENAI_API_KEY=sk-...`

### Google Vision API (pour OCR)

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un projet
3. Activer l'API Vision
4. Créer une clé de service
5. Ajouter à `.env` : `GOOGLE_VISION_API_KEY=...`

### Orange Money API

1. Contacter Orange Cameroun
2. Demander les identifiants API
3. Ajouter à `.env` :
   ```env
   ORANGE_CLIENT_ID=...
   ORANGE_CLIENT_SECRET=...
   ```

### Firebase (Notifications Push)

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Créer un projet
3. Ajouter une app iOS/Android
4. Télécharger les fichiers de configuration
5. Ajouter les clés à `.env`

## 🧪 Tests

### Lancer les tests unitaires

```bash
npm test
# ou
yarn test
```

### Lancer les tests d'intégration

```bash
npm run test:integration
# ou
yarn test:integration
```

### Lancer les tests e2e

```bash
npm run test:e2e
# ou
yarn test:e2e
```

## 🐛 Dépannage

### Erreur : "Cannot find module 'expo'"

```bash
npm install expo
```

### Erreur : "Port 19000 already in use"

```bash
# Trouver le processus utilisant le port
lsof -i :19000

# Tuer le processus
kill -9 <PID>
```

### Erreur : "Database initialization failed"

```bash
# Réinitialiser la base de données
import { clearDatabase } from './src/services/database';
await clearDatabase();
```

### L'app ne se charge pas sur le téléphone

1. Vérifier que le téléphone et l'ordinateur sont sur le même réseau WiFi
2. Vérifier que le port 19000 est ouvert
3. Redémarrer Expo : `npm start`

### Erreur de paiement Orange Money

1. Vérifier les identifiants API
2. Vérifier que le numéro de téléphone est au format correct : `+237...`
3. Vérifier que le compte a suffisamment de crédits

## 📱 Configuration des Appareils

### Android

1. Installer Android Studio
2. Créer un émulateur virtuel
3. Lancer l'émulateur
4. Lancer l'app : `npm run android`

### iOS

1. Installer Xcode
2. Créer un simulateur
3. Lancer le simulateur
4. Lancer l'app : `npm run ios`

## 🔄 Mise à jour des Dépendances

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour toutes les dépendances
npm update

# Mettre à jour une dépendance spécifique
npm install package-name@latest
```

## 📚 Documentation Supplémentaire

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Documentation React Navigation](https://reactnavigation.org/)

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifier les logs : `npm start` affiche les erreurs
2. Consulter la [FAQ](./FAQ.md)
3. Ouvrir une issue sur [GitHub](https://github.com/anti-gravity/anti-gravity/issues)
4. Contacter le support : support@anti-gravity.cm

## ✅ Vérification de l'Installation

Pour vérifier que tout fonctionne correctement :

```bash
# 1. Vérifier Node.js
node --version

# 2. Vérifier npm
npm --version

# 3. Vérifier Expo
expo --version

# 4. Lancer l'app
npm start

# 5. Vérifier la base de données
# L'app devrait créer automatiquement la base de données
```

Vous êtes prêt ! 🎉
