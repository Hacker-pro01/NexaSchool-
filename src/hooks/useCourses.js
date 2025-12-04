// ========================================
// FICHIER : src/hooks/useCourses.js
// ========================================

import { useState, useEffect } from "react";
import db from "../services/database";

/**
 * Hook personnalisé pour gérer les ressources pédagogiques (CRUD)
 * @param {string} subjectId - ID de la matière (optionnel pour filtrer)
 * @returns {Object} - { courses, loading, addCourse, deleteCourse, refreshCourses }
 */
export default function useCourses(subjectId = null) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les ressources pédagogiques
  const fetchCourses = () => {
    let query = "SELECT * FROM courses";
    let params = [];

    if (subjectId) {
      query += " WHERE subjectId = ?";
      params.push(subjectId);
    }

    query += " ORDER BY createdAt DESC";

    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => {
          // Parser les tags JSON stringifiés
          const parsedCourses = _array.map(course => ({
            ...course,
            tags: course.tags ? JSON.parse(course.tags) : []
          }));
          setCourses(parsedCourses);
          setLoading(false);
        },
        (_, error) => {
          console.error("❌ Erreur fetchCourses:", error);
          setLoading(false);
        }
      );
    });
  };

  // Ajouter une nouvelle ressource
  const addCourse = (courseData) => {
    return new Promise((resolve, reject) => {
      const { subjectId: subjId, title, type, url, content, tags } = courseData;
      const id = Date.now().toString();
      const createdAt = new Date().toISOString();
      const tagsString = JSON.stringify(tags || []);

      db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO courses (id, subjectId, title, type, url, content, tags, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id, subjId, title, type, url || '', content || '', tagsString, createdAt],
          (_, result) => {
            console.log("✅ Ressource ajoutée:", title);
            fetchCourses();
            resolve(result);
          },
          (_, error) => {
            console.error("❌ Erreur addCourse:", error);
            reject(error);
          }
        );
      });
    });
  };

  // Supprimer une ressource
  const deleteCourse = (courseId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM courses WHERE id = ?",
          [courseId],
          (_, result) => {
            console.log("✅ Ressource supprimée");
            fetchCourses();
            resolve(result);
          },
          (_, error) => {
            console.error("❌ Erreur deleteCourse:", error);
            reject(error);
          }
        );
      });
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [subjectId]);

  return { courses, loading, addCourse, deleteCourse, refreshCourses: fetchCourses };
}
