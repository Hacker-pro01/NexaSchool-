# 🤝 Guide de Contribution - Anti-Gravity

Merci de votre intérêt pour contribuer à Anti-Gravity ! Ce document fournit les directives pour contribuer au projet.

## 📋 Code de Conduite

Nous nous engageons à fournir un environnement accueillant et inclusif. Veuillez lire notre [Code de Conduite](./CODE_OF_CONDUCT.md).

## 🚀 Comment Contribuer

### 1. Signaler un Bug

Si vous trouvez un bug, veuillez ouvrir une issue avec :

- **Titre clair** : Décrivez le problème en une phrase
- **Description détaillée** : Expliquez le comportement attendu vs réel
- **Étapes de reproduction** : Comment reproduire le bug
- **Environnement** : OS, version Node.js, version de l'app
- **Logs** : Incluez les messages d'erreur pertinents

**Template** :
```markdown
## Description
[Description du bug]

## Étapes de reproduction
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

## Comportement attendu
[Décrivez ce qui devrait se passer]

## Comportement réel
[Décrivez ce qui se passe réellement]

## Environnement
- OS: [ex: macOS 13.0]
- Node.js: [ex: 18.0.0]
- Version de l'app: [ex: 2.0.0]
```

### 2. Proposer une Fonctionnalité

Pour proposer une nouvelle fonctionnalité :

- Ouvrez une issue avec le label `enhancement`
- Décrivez la fonctionnalité et son utilité
- Fournissez des exemples d'utilisation
- Discutez de l'implémentation proposée

**Template** :
```markdown
## Description
[Description de la fonctionnalité]

## Utilité
[Pourquoi cette fonctionnalité est utile]

## Exemple d'utilisation
[Exemple de code ou d'utilisation]

## Implémentation proposée
[Comment vous pensez l'implémenter]
```

### 3. Soumettre une Pull Request

#### Avant de commencer

1. **Fork le repository**
   ```bash
   git clone https://github.com/votre-username/anti-gravity.git
   cd anti-gravity
   ```

2. **Créer une branche**
   ```bash
   git checkout -b feature/ma-fonctionnalite
   # ou
   git checkout -b fix/mon-bug
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

#### Pendant le développement

1. **Respecter le style de code**
   - Utiliser ESLint : `npm run lint`
   - Formater avec Prettier : `npm run format`
   - Suivre les conventions du projet

2. **Écrire des tests**
   - Ajouter des tests pour les nouvelles fonctionnalités
   - Vérifier que tous les tests passent : `npm test`
   - Viser une couverture > 80%

3. **Commiter régulièrement**
   ```bash
   git add .
   git commit -m "feat: description courte de la modification"
   ```

   **Format des commits** :
   - `feat:` pour une nouvelle fonctionnalité
   - `fix:` pour une correction de bug
   - `docs:` pour la documentation
   - `style:` pour les changements de style
   - `refactor:` pour les refactorisations
   - `test:` pour les tests
   - `chore:` pour les tâches de maintenance

4. **Pousser vers votre fork**
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

#### Soumettre la PR

1. Allez sur GitHub et créez une Pull Request
2. Remplissez le template de PR
3. Attendez la revue du code
4. Répondez aux commentaires et apportez les modifications

**Template de PR** :
```markdown
## Description
[Description des changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Lié à
Closes #[numéro de l'issue]

## Checklist
- [ ] Mon code suit le style du projet
- [ ] J'ai exécuté `npm run lint`
- [ ] J'ai exécuté `npm run format`
- [ ] J'ai ajouté des tests
- [ ] Tous les tests passent
- [ ] J'ai mis à jour la documentation
```

## 📝 Conventions de Code

### JavaScript/React

```javascript
// ✅ BON
const calculateAverage = (grades) => {
  if (!grades || grades.length === 0) {
    return null;
  }
  return grades.reduce((sum, g) => sum + g, 0) / grades.length;
};

// ❌ MAUVAIS
function calc(g) {
  let s = 0;
  for (let i = 0; i < g.length; i++) {
    s += g[i];
  }
  return s / g.length;
}
```

### Nommage

- **Variables** : camelCase (`userName`, `isLoading`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_URL`)
- **Fonctions** : camelCase (`getUserData`, `calculateAverage`)
- **Classes** : PascalCase (`UserService`, `GradeCalculator`)
- **Fichiers** : kebab-case (`user-service.js`, `grade-calculator.js`)

### Commentaires

```javascript
// ✅ BON
/**
 * Calcule la moyenne pondérée des notes
 * @param {Array} grades - Liste des notes
 * @param {Array} coefficients - Coefficients des notes
 * @returns {number|null} - Moyenne pondérée ou null
 */
const calculateWeightedAverage = (grades, coefficients) => {
  // ...
};

// ❌ MAUVAIS
// calcule la moyenne
const calc = (g, c) => {
  // ...
};
```

## 🧪 Tests

### Écrire des tests

```javascript
// ✅ BON
describe('calculateAverage', () => {
  it('should return null for empty array', () => {
    expect(calculateAverage([])).toBeNull();
  });

  it('should calculate average correctly', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20);
  });

  it('should handle single value', () => {
    expect(calculateAverage([15])).toBe(15);
  });
});

// ❌ MAUVAIS
test('test', () => {
  expect(calculateAverage([10, 20, 30])).toBe(20);
});
```

### Lancer les tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- calculateAverage

# Avec couverture
npm test -- --coverage

# Mode watch
npm test -- --watch
```

## 📚 Documentation

### Mettre à jour la documentation

- Mettre à jour le README si nécessaire
- Ajouter des commentaires JSDoc
- Documenter les nouvelles API
- Mettre à jour le CHANGELOG

### Format de documentation

```markdown
## Titre

Description courte.

### Sous-titre

Explication détaillée avec exemples.

\`\`\`javascript
// Exemple de code
\`\`\`

### Voir aussi
- [Lien 1](url)
- [Lien 2](url)
```

## 🔍 Processus de Revue

1. **Vérification automatique**
   - ESLint
   - Tests
   - Couverture de code

2. **Revue manuelle**
   - Qualité du code
   - Respect des conventions
   - Documentation

3. **Approbation**
   - Au moins 1 approbation requise
   - Tous les tests doivent passer

4. **Merge**
   - Squash and merge
   - Suppression de la branche

## 🎯 Priorités de Contribution

### Haute Priorité
- Corrections de bugs critiques
- Fonctionnalités demandées
- Améliorations de performance

### Moyenne Priorité
- Nouvelles fonctionnalités
- Refactorisations
- Améliorations de documentation

### Basse Priorité
- Optimisations mineures
- Améliorations cosmétiques

## 📞 Questions ?

- Ouvrez une discussion sur GitHub
- Rejoignez notre Discord
- Envoyez un email à dev@anti-gravity.cm

## 🙏 Merci !

Merci de contribuer à Anti-Gravity ! Votre aide est précieuse pour améliorer l'éducation au Cameroun.

---

**Heureux de contribuer !** 🚀
