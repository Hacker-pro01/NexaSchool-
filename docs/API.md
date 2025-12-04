# 📚 Documentation API Anti-Gravity

## Vue d'ensemble

L'API Anti-Gravity fournit tous les endpoints nécessaires pour gérer les utilisateurs, les matières, les notes, les paiements, et bien plus.

**URL de base** : `https://api.anti-gravity.cm/v1`

## 🔐 Authentification

Tous les endpoints (sauf login/register) nécessitent un token JWT dans l'en-tête `Authorization`.

```
Authorization: Bearer <token>
```

### Obtenir un token

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse** :
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont"
  }
}
```

## 👤 Utilisateurs

### Créer un compte

**POST** `/auth/register`

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "+237612345678",
  "password": "SecurePass123!",
  "schoolLevel": "Terminale",
  "schoolSeries": "C"
}
```

### Récupérer le profil

**GET** `/users/profile`

**Réponse** :
```json
{
  "id": "user_123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "+237612345678",
  "schoolLevel": "Terminale",
  "schoolSeries": "C",
  "school": "Lycée Général Leclerc",
  "profileImage": "https://...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Mettre à jour le profil

**PUT** `/users/profile`

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+237612345678",
  "school": "Lycée Général Leclerc",
  "bio": "Élève en Terminale C"
}
```

### Changer le mot de passe

**POST** `/users/change-password`

```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

## 📚 Matières

### Créer une matière

**POST** `/subjects`

```json
{
  "name": "Mathématiques",
  "coefficient": 4,
  "teacher": "M. Dupont",
  "room": "A101",
  "description": "Cours de mathématiques Terminale C"
}
```

### Récupérer toutes les matières

**GET** `/subjects`

**Réponse** :
```json
{
  "data": [
    {
      "id": "subject_123",
      "name": "Mathématiques",
      "coefficient": 4,
      "teacher": "M. Dupont",
      "room": "A101",
      "color": "#3498db"
    }
  ],
  "total": 1
}
```

### Récupérer une matière

**GET** `/subjects/:id`

### Mettre à jour une matière

**PUT** `/subjects/:id`

```json
{
  "name": "Mathématiques",
  "coefficient": 4,
  "teacher": "M. Dupont"
}
```

### Supprimer une matière

**DELETE** `/subjects/:id`

## 📊 Notes

### Ajouter une note

**POST** `/grades`

```json
{
  "subjectId": "subject_123",
  "value": 18,
  "maxValue": 20,
  "coefficient": 1,
  "type": "Examen",
  "comment": "Très bon travail"
}
```

### Récupérer les notes

**GET** `/grades?subjectId=subject_123&limit=50&offset=0`

**Réponse** :
```json
{
  "data": [
    {
      "id": "grade_123",
      "subjectId": "subject_123",
      "value": 18,
      "maxValue": 20,
      "coefficient": 1,
      "type": "Examen",
      "date": "2024-01-15T10:30:00Z",
      "comment": "Très bon travail"
    }
  ],
  "total": 1,
  "average": 18.0
}
```

### Mettre à jour une note

**PUT** `/grades/:id`

```json
{
  "value": 19,
  "comment": "Correction: très bon travail"
}
```

### Supprimer une note

**DELETE** `/grades/:id`

### Récupérer les statistiques

**GET** `/grades/statistics`

**Réponse** :
```json
{
  "generalAverage": 16.5,
  "subjectAverages": {
    "subject_123": 18.0,
    "subject_124": 15.0
  },
  "bestSubject": "Mathématiques",
  "worstSubject": "Français",
  "totalGrades": 25
}
```

## 📅 Emploi du temps

### Créer un cours

**POST** `/schedule`

```json
{
  "subjectId": "subject_123",
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "09:30",
  "room": "A101",
  "teacher": "M. Dupont"
}
```

### Récupérer l'emploi du temps

**GET** `/schedule?dayOfWeek=1`

**Réponse** :
```json
{
  "data": [
    {
      "id": "schedule_123",
      "subjectId": "subject_123",
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "09:30",
      "room": "A101",
      "teacher": "M. Dupont"
    }
  ]
}
```

## 💰 Paiements

### Initier un paiement Orange Money

**POST** `/payments/orange-money/initiate`

```json
{
  "amount": 2500,
  "phoneNumber": "+237612345678",
  "planId": "basic"
}
```

**Réponse** :
```json
{
  "paymentId": "pay_123",
  "transactionId": "txn_456",
  "status": "processing",
  "redirectUrl": "https://..."
}
```

### Vérifier le statut d'un paiement

**GET** `/payments/:paymentId/verify`

**Réponse** :
```json
{
  "paymentId": "pay_123",
  "status": "success",
  "amount": 2500,
  "method": "orange_money",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Récupérer l'historique des paiements

**GET** `/payments/history?limit=50&offset=0`

**Réponse** :
```json
{
  "data": [
    {
      "id": "pay_123",
      "amount": 2500,
      "method": "orange_money",
      "status": "success",
      "date": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

## 🎁 Abonnements

### Récupérer l'abonnement actif

**GET** `/subscriptions/active`

**Réponse** :
```json
{
  "id": "sub_123",
  "planId": "basic",
  "status": "active",
  "startDate": "2024-01-15T10:30:00Z",
  "endDate": "2024-02-15T10:30:00Z",
  "autoRenew": true
}
```

### Annuler un abonnement

**POST** `/subscriptions/:subscriptionId/cancel`

### Renouveler un abonnement

**POST** `/subscriptions/:subscriptionId/renew`

## 🤖 GravBot

### Envoyer un message

**POST** `/gravbot/chat`

```json
{
  "message": "Comment résoudre une équation du second degré?",
  "language": "fr",
  "context": {
    "subject": "Mathématiques",
    "level": "Terminale"
  }
}
```

**Réponse** :
```json
{
  "messageId": "msg_123",
  "response": "Une équation du second degré...",
  "suggestions": [
    "Voir des exemples",
    "Générer des exercices"
  ]
}
```

### Expliquer un concept

**POST** `/gravbot/explain`

```json
{
  "subject": "Mathématiques",
  "concept": "Dérivées",
  "level": "intermediate",
  "language": "fr"
}
```

### Générer des exercices

**POST** `/gravbot/generate-exercises`

```json
{
  "subject": "Mathématiques",
  "topic": "Équations du second degré",
  "difficulty": "medium",
  "count": 5,
  "language": "fr"
}
```

### Corriger un devoir

**POST** `/gravbot/correct-assignment`

```json
{
  "subject": "Mathématiques",
  "assignmentText": "Résoudre: x² + 2x - 3 = 0",
  "maxScore": 20,
  "language": "fr"
}
```

### Générer un plan de révision

**POST** `/gravbot/generate-revision-plan`

```json
{
  "subjects": ["Mathématiques", "Physique"],
  "examDate": "2024-06-15",
  "language": "fr"
}
```

## 🏆 Gamification

### Récupérer les infos de gamification

**GET** `/gamification/info`

**Réponse** :
```json
{
  "totalPoints": 1250,
  "level": 3,
  "currentLevelPoints": 250,
  "levelInfo": {
    "level": 3,
    "name": "Étudiant",
    "minPoints": 501,
    "maxPoints": 1500
  }
}
```

### Récupérer les badges

**GET** `/gamification/badges`

**Réponse** :
```json
{
  "data": [
    {
      "id": "badge_123",
      "badgeId": "FIRST_20",
      "name": "Premier 20/20",
      "icon": "🏆",
      "unlockedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

### Récupérer le classement global

**GET** `/gamification/leaderboard?limit=100&offset=0`

**Réponse** :
```json
{
  "data": [
    {
      "rank": 1,
      "userId": "user_123",
      "firstName": "Jean",
      "lastName": "Dupont",
      "totalPoints": 5000,
      "level": 6
    }
  ],
  "total": 1000
}
```

## 🔔 Notifications

### Récupérer les notifications

**GET** `/notifications?limit=50&unreadOnly=false`

**Réponse** :
```json
{
  "data": [
    {
      "id": "notif_123",
      "type": "grade_published",
      "title": "Nouvelle note",
      "message": "Vous avez reçu 18/20 en Mathématiques",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "unreadCount": 1
}
```

### Marquer comme lue

**POST** `/notifications/:notificationId/read`

### Marquer toutes comme lues

**POST** `/notifications/read-all`

### Supprimer une notification

**DELETE** `/notifications/:notificationId`

## 🔄 Codes d'erreur

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Requête invalide |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (ex: email déjà utilisé) |
| 429 | Too Many Requests | Trop de requêtes (rate limit) |
| 500 | Internal Server Error | Erreur serveur |

## 📝 Pagination

Les endpoints qui retournent des listes supportent la pagination :

```
GET /endpoint?limit=50&offset=0
```

- `limit` : Nombre de résultats (défaut: 50, max: 100)
- `offset` : Décalage (défaut: 0)

## 🔐 Rate Limiting

- **Limite** : 100 requêtes par minute par utilisateur
- **En-tête** : `X-RateLimit-Remaining`

## 📞 Support

Pour toute question sur l'API :
- Email : api-support@anti-gravity.cm
- Documentation : https://docs.anti-gravity.cm
