// ========================================
// FICHIER : src/hooks/useGrades.js
// ========================================

import { useState, useEffect } from "react";
import db from "../services/database";

/**
 * Hook personnalisé pour gérer les notes (CRUD)
 * @param {string} userId - ID de l'utilisateur
 * @param {string} subjectId - ID de la matière (optionnel pour filtrer)
 * @returns {Object} - { grades, loading, addGrade, updateGrade, deleteGrade, refreshGrades }
 */
export default function useGrades(userId, subjectId = null) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les notes
  const fetchGrades = () => {
    let query = "SELECT * FROM grades WHERE userId = ?";
    let params = [userId];

    if (subjectId) {
      query += " AND subjectId = ?";
      params.push(subjectId);
    }

    query += " ORDER BY date DESC";

    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => {
          setGrades(_array);
          setLoading(false);
        },
        (_, error) => {
          console.error("❌ Erreur fetchGrades:", error);
          setLoading(false);
        }
      );
    });
  };

  // Ajouter une nouvelle note
  const addGrade = (gradeData) => {
    return new Promise((resolve, reject) => {
      const { subjectId: subjId, value, maxValue, coefficient, type, comment } = gradeData;
      const id = Date.now().toString();
      const date = new Date().toISOString();

      db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO grades (id, userId, subjectId, value, maxValue, coefficient, type, date, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [id, userId, subjId, value, maxValue || 20, coefficient || 1, type || 'Devoir', date, comment || ''],
          (_, result) => {
            console.log("✅ Note ajoutée:", value + "/" + (maxValue || 20));
            fetchGrades();
            resolve(result);
          },
          (_, error) => {
            console.error("❌ Erreur addGrade:", error);
            reject(error);
          }
        );
      });
    });
  };

  // Modifier une note existante
  const updateGrade = (gradeId, gradeData) => {
    return new Promise((resolve, reject) => {
      const { value, maxValue, coefficient, type, comment } = gradeData;

      db.transaction(tx => {
        tx.executeSql(
          "UPDATE grades SET value = ?, maxValue = ?, coefficient = ?, type = ?, comment = ? WHERE id = ? AND userId = ?",
          [value, maxValue, coefficient, type, comment, gradeId, userId],
          (_, result) => {
            console.log("✅ Note modifiée:", value + "/" + maxValue);
            fetchGrades();
            resolve(result);
          },
          (_, error) => {
            console.error("❌ Erreur updateGrade:", error);
            reject(error);
          }
        );
      });
    });
  };

  // Supprimer une note
  const deleteGrade = (gradeId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM grades WHERE id = ? AND userId = ?",
          [gradeId, userId],
          (_, result) => {
            console.log("✅ Note supprimée");
            fetchGrades();
            resolve(result);
          },
          (_, error) => {
            console.error("❌ Erreur deleteGrade:", error);
            reject(error);
          }
        );
      });
    });
  };

  useEffect(() => {
    fetchGrades();
  }, [userId, subjectId]);

  return { grades, loading, addGrade, updateGrade, deleteGrade, refreshGrades: fetchGrades };
}
