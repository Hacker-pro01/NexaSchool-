// ========================================
// FICHIER : src/services/database.js
// ========================================

/**
 * Service de gestion de la base de données SQLite
 * Initialise et gère toutes les tables Anti-Gravity
 */

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('anti-gravity.db');

/**
 * Initialise la base de données avec toutes les tables
 */
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // ========== TABLE UTILISATEURS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          profileImage TEXT,
          schoolLevel TEXT,
          schoolSeries TEXT,
          school TEXT,
          bio TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          lastLogin TEXT,
          isActive INTEGER DEFAULT 1
        );`
      );

      // ========== TABLE MATIÈRES ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS subjects (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          name TEXT NOT NULL,
          coefficient REAL DEFAULT 1,
          color TEXT,
          teacher TEXT,
          room TEXT,
          description TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE NOTES ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS grades (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          subjectId TEXT NOT NULL,
          value REAL NOT NULL,
          maxValue REAL DEFAULT 20,
          coefficient REAL DEFAULT 1,
          type TEXT,
          date TEXT NOT NULL,
          comment TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id),
          FOREIGN KEY(subjectId) REFERENCES subjects(id)
        );`
      );

      // ========== TABLE EMPLOI DU TEMPS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          subjectId TEXT NOT NULL,
          dayOfWeek INTEGER,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          room TEXT,
          teacher TEXT,
          notes TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id),
          FOREIGN KEY(subjectId) REFERENCES subjects(id)
        );`
      );

      // ========== TABLE COURS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS courses (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          subjectId TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT,
          videoUrl TEXT,
          pdfUrl TEXT,
          imageUrl TEXT,
          duration INTEGER,
          difficulty TEXT,
          tags TEXT,
          isDownloaded INTEGER DEFAULT 0,
          downloadedAt TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id),
          FOREIGN KEY(subjectId) REFERENCES subjects(id)
        );`
      );

      // ========== TABLE EXAMENS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS exams (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          subjectId TEXT NOT NULL,
          title TEXT NOT NULL,
          type TEXT,
          date TEXT NOT NULL,
          duration INTEGER,
          location TEXT,
          description TEXT,
          pdfUrl TEXT,
          score REAL,
          maxScore REAL DEFAULT 20,
          status TEXT DEFAULT 'upcoming',
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id),
          FOREIGN KEY(subjectId) REFERENCES subjects(id)
        );`
      );

      // ========== TABLE DEVOIRS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS assignments (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          subjectId TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          dueDate TEXT NOT NULL,
          fileUrl TEXT,
          submittedAt TEXT,
          submissionUrl TEXT,
          grade REAL,
          feedback TEXT,
          status TEXT DEFAULT 'pending',
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id),
          FOREIGN KEY(subjectId) REFERENCES subjects(id)
        );`
      );

      // ========== TABLE ABONNEMENTS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS subscriptions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          planId TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          startDate TEXT NOT NULL,
          endDate TEXT NOT NULL,
          autoRenew INTEGER DEFAULT 1,
          paymentMethod TEXT,
          transactionId TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE PAIEMENTS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT DEFAULT 'FCFA',
          method TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          reference TEXT,
          description TEXT,
          metadata TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE NOTIFICATIONS ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT,
          data TEXT,
          isRead INTEGER DEFAULT 0,
          readAt TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE GROUPES D'ÉTUDE ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS study_groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          creatorId TEXT NOT NULL,
          subjectId TEXT,
          maxMembers INTEGER DEFAULT 10,
          isPrivate INTEGER DEFAULT 0,
          imageUrl TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(creatorId) REFERENCES users(id),
          FOREIGN KEY(subjectId) REFERENCES subjects(id)
        );`
      );

      // ========== TABLE MEMBRES DE GROUPES ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS study_group_members (
          id TEXT PRIMARY KEY,
          groupId TEXT NOT NULL,
          userId TEXT NOT NULL,
          role TEXT DEFAULT 'member',
          joinedAt TEXT NOT NULL,
          FOREIGN KEY(groupId) REFERENCES study_groups(id),
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE MESSAGES ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          senderId TEXT NOT NULL,
          recipientId TEXT,
          groupId TEXT,
          content TEXT NOT NULL,
          attachmentUrl TEXT,
          isRead INTEGER DEFAULT 0,
          readAt TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY(senderId) REFERENCES users(id),
          FOREIGN KEY(recipientId) REFERENCES users(id),
          FOREIGN KEY(groupId) REFERENCES study_groups(id)
        );`
      );

      // ========== TABLE BADGES ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS badges (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          badgeId TEXT NOT NULL,
          unlockedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE POINTS DE GAMIFICATION ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS gamification_points (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          totalPoints INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          currentLevelPoints INTEGER DEFAULT 0,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE HISTORIQUE D'ACTIVITÉ ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS activity_log (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          action TEXT NOT NULL,
          entityType TEXT,
          entityId TEXT,
          details TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE PRÉFÉRENCES UTILISATEUR ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user_preferences (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL UNIQUE,
          theme TEXT DEFAULT 'neon',
          language TEXT DEFAULT 'fr',
          notificationsEnabled INTEGER DEFAULT 1,
          darkMode INTEGER DEFAULT 0,
          offlineMode INTEGER DEFAULT 1,
          soundEnabled INTEGER DEFAULT 1,
          vibrationEnabled INTEGER DEFAULT 1,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY(userId) REFERENCES users(id)
        );`
      );

      // ========== TABLE CACHE OFFLINE ==========
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS offline_cache (
          id TEXT PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          expiresAt TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );`
      );

      // ========== CRÉER LES INDEX POUR PERFORMANCE ==========
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_grades_userId ON grades(userId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_grades_subjectId ON grades(subjectId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_subjects_userId ON subjects(userId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_schedule_userId ON schedule(userId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_courses_userId ON courses(userId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_exams_userId ON exams(userId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_messages_senderId ON messages(senderId);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_activity_log_userId ON activity_log(userId);');
    }, 
    (error) => {
      console.error('❌ Erreur initialisation DB:', error);
      reject(error);
    },
    () => {
      console.log('✅ Base de données initialisée avec succès');
      resolve();
    });
  });
};

/**
 * Exécute une requête SQL personnalisée
 */
export const executeSql = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Récupère tous les enregistrements d'une table
 */
export const getAllRecords = (tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Récupère un enregistrement par ID
 */
export const getRecordById = (tableName, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [id],
        (_, { rows: { _array } }) => resolve(_array[0] || null),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Supprime tous les enregistrements (pour tests)
 */
export const clearDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const tables = [
        'users', 'subjects', 'grades', 'schedule', 'courses', 'exams',
        'assignments', 'subscriptions', 'payments', 'notifications',
        'study_groups', 'study_group_members', 'messages', 'badges',
        'gamification_points', 'activity_log', 'user_preferences', 'offline_cache'
      ];

      tables.forEach(table => {
        tx.executeSql(`DELETE FROM ${table};`);
      });
    },
    (error) => reject(error),
    () => {
      console.log('✅ Base de données vidée');
      resolve();
    });
  });
};

export default db;
