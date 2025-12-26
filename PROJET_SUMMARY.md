# PROJET_SUMMARY

## 1. Contexte rapide
NexaSchool est une application scolaire complète destinée aux élèves, centralisant emplois du temps, notes, révisions, documents, épreuves, rappels, cours vidéo et paiements. L'objectif est d'offrir une application fluide, moderne et évolutive pour améliorer la performance et l'organisation des élèves.

## 2. Objectifs du projet (SMART)
- S1 — Lancer une MVP fonctionnelle pour la gestion des emplois du temps, notes et documents d'ici 8 semaines.
- S2 — Ajouter la fonctionnalité de questionnaires/examens mensuels et notifications d'ici 12 semaines.
- S3 — Intégrer paiements (Stripe) et tableau de bord administrateur d'ici 16 semaines.  
Mesurables : nombre d'utilisateurs actifs, taux de complétion des épreuves, stabilité (zéro régression critique).

## 3. Périmètre initial (MVP)
Inclure :
- Authentification (inscription, connexion, récupération mot de passe)
- Profil utilisateur (élève, professeur, admin)
- Emplois du temps consultables et export PDF
- Saisie et consultation des notes
- Upload et consultation de documents PDF
- Système de révision / quiz basique

Exclu pour le MVP :
- Paiements avancés multi-devises
- SSO et intégrations tierces complexes

## 4. Fonctionnalités prioritaires (ordre)
1. Authentification sécurisée (JWT + refresh token)  
2. Gestion de rôles et permissions  
3. Emplois du temps (CRUD, affichage calendrier)  
4. Notes et bulletins (CRUD, export)  
5. Documents & ressources (upload, permissions, visualiseur PDF)  
6. Quiz / épreuves (création, correction basique)  
7. Notifications (push/email) et rappels

## 5. Architecture technique (haut niveau)
- Frontend : SPA JavaScript (React / Vue / autre — à préciser)  
- Backend : Node.js (Express / Nest) + REST/GraphQL  
- Base de données : PostgreSQL (ou Mongo si justifié)  
- Stockage fichiers : S3-compatible  
- Auth : JWT + refresh, chiffrement mots de passe (bcrypt)  
- CI/CD : GitHub Actions -> tests, lint, build, déploiement staging

## 6. Qualité & sécurité
- Linter et formatting (ESLint, Prettier)  
- Tests unitaires et d'intégration (Jest, Playwright pour e2e)  
- Scan vulnérabilités (npm audit / Dependabot)  
- Politique sécurité : chiffrement données sensibles en transit et au repos

## 7. Roadmap et plan de travail (exemple 4 sprints de 2 semaines)
Sprint 1
- Setup projet, environnements, CI, linter  
- Authentification de base + modèle utilisateur

Sprint 2
- Emplois du temps (backend + UI)  
- Upload documents

Sprint 3
- Notes & bulletins  
- Quiz basique

Sprint 4
- Notifications  
- Tests e2e & corrections, préparation déploiement

## 8. Tâches concrètes (issues à créer)
- Init : config ESLint, Prettier, husky  
- CI : workflow tests + build  
- Feature : endpoint /auth (login/register)  
- Feature : CRUD /timetable  
- Feature : Upload file + viewer  
- Tests : couverture 70% minimum pour modules critiques

## 9. Critères d'acceptation
- Auth : endpoints sécurisés, tests unitaires >= 80% pour module auth  
- Emploi du temps : CRUD fonctionnel, affichage calendrier responsif  
- Documents : upload sécurisé, accès restreint selon rôle

## 10. Déploiement & monitoring
- Environnements : staging, production  
- Logs centralisés (gestion des logs)  
- Monitoring santé (Sentry / Prometheus + alertes)

## 11. Risques & mitigation
- Risque : fuite de données utilisateurs → chiffrement & audits réguliers  
- Risque : dépendances vulnérables → scans réguliers et mises à jour planifiées  
- Risque : non adoption → tests utilisateurs et itérations rapides

## 12. Prochaines actions immédiates (48–72h)
- Vérifier et comparer avec le contenu actuel de PROJET_SUMMARY.md (s'il existe déjà)  
- Créer issues pour : « Init », « Auth », « CI »  
- Mettre en place GitHub Actions basique pour lint et tests  
- Préparer modèle de branche (feature/*) et template PR
