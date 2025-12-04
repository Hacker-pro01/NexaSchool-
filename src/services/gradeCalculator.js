// ========================================
// FICHIER : src/services/gradeCalculator.js
// ========================================

/**
 * Service de calcul des moyennes et statistiques
 */

/**
 * Calcule la moyenne d'une matière avec coefficients
 * @param {Array} grades - Liste des notes de la matière
 * @returns {number|null} - Moyenne calculée ou null si pas de notes
 */
export const calculateSubjectAverage = (grades) => {
  if (!grades || grades.length === 0) {
    return null;
  }

  let totalWeighted = 0;
  let totalCoefficients = 0;

  grades.forEach(grade => {
    const value = grade.value || 0;
    const maxValue = grade.maxValue || 20;
    const coefficient = grade.coefficient || 1;

    // Calculer la note sur 20
    const normalizedGrade = (value / maxValue) * 20;

    totalWeighted += normalizedGrade * coefficient;
    totalCoefficients += coefficient;
  });

  if (totalCoefficients === 0) {
    return null;
  }

  return totalWeighted / totalCoefficients;
};

/**
 * Calcule la moyenne générale pondérée par les coefficients des matières
 * @param {Array} subjects - Liste des matières avec leurs coefficients
 * @param {Array} grades - Liste de toutes les notes
 * @returns {number|null} - Moyenne générale ou null si pas de données
 */
export const calculateGeneralAverage = (subjects, grades) => {
  if (!subjects || subjects.length === 0 || !grades || grades.length === 0) {
    return null;
  }

  let totalWeighted = 0;
  let totalCoefficients = 0;

  subjects.forEach(subject => {
    const subjectGrades = grades.filter(grade => grade.subjectId === subject.id);
    const subjectAverage = calculateSubjectAverage(subjectGrades);

    if (subjectAverage !== null) {
      const subjectCoefficient = subject.coefficient || 1;
      totalWeighted += subjectAverage * subjectCoefficient;
      totalCoefficients += subjectCoefficient;
    }
  });

  if (totalCoefficients === 0) {
    return null;
  }

  return totalWeighted / totalCoefficients;
};

/**
 * Détermine la couleur selon la moyenne
 * @param {number|null} average - Moyenne à évaluer
 * @returns {string} - Couleur associée
 */
export const getGradeColor = (average) => {
  if (average === null) {
    return '#95a5a6'; // Gris pour pas de notes
  }

  if (average < 10) {
    return '#e74c3c'; // Rouge
  } else if (average < 14) {
    return '#f39c12'; // Orange
  } else {
    return '#2ecc71'; // Vert
  }
};

/**
 * Formate une moyenne pour l'affichage
 * @param {number|null} average - Moyenne à formater
 * @returns {string} - Moyenne formatée
 */
export const formatAverage = (average) => {
  if (average === null) {
    return 'N/A';
  }

  return average.toFixed(2);
};
