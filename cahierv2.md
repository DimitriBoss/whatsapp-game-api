# 📘 Cahier des Charges — WhatsApp Game Bot API v2

> **Version** : 2.0  
> **Date** : 23 juin 2026  
> **Auteur** : AGOSSOU Dimitri  
> **Statut** : MVP renforcé — prêt pour production  
> **Objectif** : Bot WhatsApp de jeux, robuste, sécurisé, extensible

## 1 — Contexte et vision

WhatsApp est un canal majeur de communication en Afrique de l’Ouest, et particulièrement au Bénin. Ce projet vise à proposer un bot WhatsApp capable de divertir les utilisateurs avec des jeux simples, rapides et culturels, sans installation d’application supplémentaire.

L’objectif n’est pas seulement de “faire marcher” le bot, mais de créer un système fiable, maintenable, sécurisé et évolutif, capable d’évoluer vers plusieurs jeux et fonctionnalités communautaires.

## 2 — Objectifs du projet

### 2.1 Objectifs principaux

- Permettre à tout utilisateur WhatsApp de jouer facilement à plusieurs mini-jeux.
- Offrir une expérience fluide, en français, adaptée au public béninois et africain francophone.
- Garantir une stabilité de production avec reprise automatique et gestion des erreurs.
- Sécuriser les données, les accès admin et la session WhatsApp.

### 2.2 Objectifs secondaires

- Fournir des statistiques d’utilisation.
- Permettre l’ajout futur de nouveaux jeux sans refonte globale.
- Offrir une base propre pour intégrer des fonctionnalités premium plus tard.

### 2.3 KPI

- Utilisateurs uniques actifs mensuels.
- Nombre total de parties lancées.
- Taux de retour des utilisateurs.
- Nombre d’erreurs critiques par semaine.
- Temps moyen de réponse du bot.

## 3 — Public cible

### 3.1 Persona principal

- Jeunes de 15 à 35 ans.
- Utilisateurs WhatsApp quotidiens.
- Public béninois et francophone africain.
- Amateurs de jeux sociaux, défis, devinettes et interactions légères.

### 3.2 Cas d’usage

- Jouer seul à Action/Vérité.
- Lancer une devinette rapide.
- Utiliser le bot dans un groupe pour animer.
- Tester de nouveaux jeux sans quitter WhatsApp.

## 4 — Périmètre fonctionnel

### 4.1 Fonctionnalités MVP

- Action / Vérité.
- Devinettes avec tentatives limitées.
- Menu principal.
- Onboarding avec prénom.
- Machine à états par utilisateur.
- Historique anti-répétition.
- Normalisation des réponses.
- Commandes globales de contrôle.
- Page QR web.
- Statistiques simples.
- Feedback utilisateur.
- Gestion propre des erreurs.

### 4.2 Nouveaux jeux à intégrer

Inspiré de l’approche du repo `Shyguy99/Whatsapp-bot`, le bot doit être extensible pour intégrer :

- Morpion / Tic Tac Toe.
- Pendu.
- Quiz culture générale.
- Match emoji.
- Minesweeper.
- Devinettes améliorées.
- Mini défis textuels.
- Commandes fun et utilitaires.

### 4.3 Hors périmètre immédiat

- App mobile compagnon.
- Paiement intégré.
- IA conversationnelle avancée.
- Mode multijoueur complet avec classement.
- Gestion multi-langues.
- Interface admin complète.

## 5 — Spécifications fonctionnelles

### 5.1 Menu principal

Le bot doit afficher un menu clair avec des options numérotées.  
Exemple :

1. Action / Vérité
2. Devinettes
3. Pendu
4. Morpion
5. Quiz
6. Aide

### 5.2 Action / Vérité

- L’utilisateur choisit Action ou Vérité.
- Le bot tire un contenu aléatoire non déjà utilisé.
- L’historique évite les doublons.
- Les actions demandent une confirmation utilisateur.
- Les vérités acceptent une réponse libre.

### 5.3 Devinettes

- Le bot pose une devinette.
- L’utilisateur a 3 essais.
- Les réponses sont normalisées.
- Les synonymes sont supportés.
- En cas d’échec, la bonne réponse est révélée.

### 5.4 Pendu

- Le bot choisit un mot.
- Le joueur propose des lettres ou le mot complet.
- Le nombre d’erreurs est limité.
- Le bot affiche l’état du mot progressivement.

### 5.5 Morpion

- Jeu contre le bot ou entre deux utilisateurs.
- Gestion de la grille 3x3.
- Vérification de victoire, défaite ou égalité.
- Commandes simples par numéro de case.

### 5.6 Quiz

- Questions à choix unique ou réponse libre.
- Score session.
- Niveau de difficulté progressif.
- Questions filtrées par thème si besoin.

### 5.7 Match emoji

- Le bot affiche une suite d’emojis.
- L’utilisateur doit deviner l’expression, le film, le mot ou l’objet.
- Réponses tolérantes aux variantes.

### 5.8 Commandes globales

- `/start` : reprendre.
- `/stop` : mettre en pause.
- `/reset` : réinitialiser la session.
- `/menu` : retour au menu principal.
- `/help` : aide.
- `/stats` : statistiques si autorisé.
- `/ping` : test de disponibilité.

## 6 — Expérience utilisateur

### 6.1 Onboarding

Lors du premier message :

- Le bot demande le prénom.
- Le prénom est sauvegardé.
- Le menu personnalisé est affiché.
- L’utilisateur peut commencer immédiatement.

### 6.2 Navigation

Le bot doit rester simple :

- réponses courtes,
- menus numérotés,
- instructions claires,
- retour arrière possible à tout moment,
- aucune étape inutile.

### 6.3 Ton et style

- Français simple.
- Ton amical.
- Messages courts.
- Adaptation culturelle béninoise.
- Émojis utilisés avec modération.

## 7 — Architecture technique

### 7.1 Architecture logique

- Module WhatsApp.
- Module Jeux.
- Module Sessions.
- Module Utilisateurs.
- Module Admin.
- Module Monitoring.
- Module Sécurité.

### 7.2 Architecture cible

- **Runtime** : Node.js 22.
- **Framework** : NestJS.
- **Langage** : TypeScript.
- **ORM** : Prisma.
- **Base de données** : PostgreSQL.
- **Connexion WhatsApp** : `whatsapp-web.js`.
- **Browser automation** : Chromium/Puppeteer.
- **Déploiement** : Docker sur Railway ou équivalent.

### 7.3 Organisation des fichiers

- `src/whatsapp/`
- `src/games/`
- `src/admin/`
- `src/auth/`
- `src/prisma/`
- `src/common/`
- `prisma/`
- `scripts/`
- `logs/`

## 8 — Modèle de données

### 8.1 Entités principales

#### User

- `id`
- `phoneNumber`
- `firstName`
- `lastName`
- `role`
- `botState`
- `isBlocked`
- `playedCount`
- `createdAt`
- `updatedAt`

#### GameSession

- `id`
- `chatId`
- `currentGame`
- `currentQuestionId`
- `attempts`
- `history`
- `lastActivityAt`
- `updatedAt`

#### Question

- `id`
- `text`
- `answer`
- `type`
- `category`
- `difficulty`
- `language`
- `active`

#### AdminLog

- `id`
- `actorId`
- `action`
- `target`
- `metadata`
- `createdAt`

#### ErrorLog

- `id`
- `scope`
- `message`
- `stack`
- `severity`
- `createdAt`

### 8.2 Champs de sécurité

- `role`: user, moderator, admin, owner.
- `isBlocked`: pour suspendre un utilisateur abusif.
- `active`: pour désactiver une question sans la supprimer.

## 9 — API REST

### 9.1 Routes publiques

- `GET /` : health check.
- `GET /qr` : affichage du QR code.
- `GET /status` : état du bot.
- `GET /version` : version de l’application.

### 9.2 Routes admin

- `GET /admin/stats`
- `GET /admin/errors`
- `GET /admin/users`
- `GET /admin/sessions`
- `POST /admin/questions`
- `PUT /admin/questions/:id`
- `DELETE /admin/questions/:id`

### 9.3 Protection

Toutes les routes admin doivent être protégées par :

- API key,
- ou JWT,
- ou double protection selon environnement.

## 10 — Sécurité

### 10.1 Principes obligatoires

- Aucun secret dans le code.
- Variables sensibles uniquement dans l’environnement.
- Route admin protégée.
- Logs sans données sensibles.
- Validation stricte des entrées.
- Rate limiting.
- Blocage anti-spam.

### 10.2 Session WhatsApp

- Utiliser une stratégie de session persistante.
- Le stockage doit survivre aux redémarrages.
- Le bot ne doit jamais dépendre d’un scan QR à chaque relance.
- Prévoir un mécanisme de reconnexion automatique.

### 10.3 Protection contre les abus

- Limite de fréquence par utilisateur.
- Détection de flood.
- Mise en pause temporaire après spam.
- Blacklist administrative.
- Blocage des commandes malveillantes.

### 10.4 Sécurité de la base de données

- Sauvegardes régulières.
- Accès réseau limité.
- Comptes DB séparés par environnement.
- Migrations contrôlées.

## 11 — Résilience et fiabilité

### 11.1 Gestion des erreurs

Le bot doit :

- capter les erreurs globalement,
- éviter les crashs,
- loguer les incidents,
- continuer à servir les autres utilisateurs même si un message échoue.

### 11.2 Redémarrage

- Reconnexion automatique.
- Restauration de session.
- Reprise des états utilisateur si possible.
- Pas de perte d’historique critique.

### 11.3 Surveillance

- Logs structurés.
- Health checks.
- Alertes sur erreurs répétées.
- Suivi des connexions et déconnexions.

## 12 — Déploiement

### 12.1 Environnement cible

- Conteneur Docker.
- Hébergement cloud.
- Base PostgreSQL distante.
- Volume persistant pour la session.

### 12.2 Pipeline

- `git push`
- build Docker
- installation des dépendances
- génération Prisma
- lancement du bot
- vérification de disponibilité

### 12.3 Pré-requis système

- Chromium compatible.
- RAM suffisante.
- stockage persistant.
- réseau stable.

## 13 — Variables d’environnement

Variables minimales :

- `DATABASE_URL`
- `PORT`
- `WHATSAPP_SESSION_PATH`
- `ADMIN_API_KEY`
- `NODE_ENV`
- `LOG_LEVEL`
- `RATE_LIMIT_WINDOW`
- `RATE_LIMIT_MAX`
- `BOT_OWNER_NUMBER`

## 14 — Observabilité

### 14.1 Logs

- Connexion WhatsApp.
- Déconnexion.
- Erreur de message.
- Erreur base de données.
- Commandes admin.
- Utilisation des jeux.

### 14.2 Métriques

- nombre de sessions,
- nombre de messages traités,
- nombre d’erreurs,
- temps de réponse,
- nombre d’utilisateurs actifs.

### 14.3 Audit

Chaque action sensible doit être enregistrée :

- ajout de questions,
- suppression de questions,
- blocage utilisateur,
- modification de configuration.

## 15 — Commandes utilisateur

### 15.1 Commandes globales

- `/start`
- `/stop`
- `/reset`
- `/menu`
- `/help`
- `/ping`

### 15.2 Commandes jeu

- `1`, `2`, `3` selon le menu.
- `suivant`
- `retour`
- `ok`
- `oui`
- `fait`

### 15.3 Commandes admin

- `#help`
- `#stats`
- `#block`
- `#unblock`
- `#reload`
- `#broadcast`
- `#addquestion`

## 16 — Gestion du contenu

### 16.1 Contenu initial

Le bot doit être livré avec :

- au moins 100 actions,
- au moins 100 vérités,
- au moins 100 devinettes,
- au moins 50 questions de quiz,
- au moins 30 items pour d’autres mini-jeux.

### 16.2 Normalisation

- suppression des accents,
- suppression de la ponctuation,
- conversion en minuscules,
- gestion des synonymes,
- tolérance aux fautes légères selon le jeu.

## 17 — Évolutions futures

### 17.1 Court terme

- Ajout de nouveaux jeux.
- Statistiques enrichies.
- Meilleure administration du contenu.
- Protection renforcée des routes.

### 17.2 Moyen terme

- Mode groupe.
- Classement.
- Système de points.
- Récompenses.
- Personnalisation avancée.

### 17.3 Long terme

- IA pour interpréter certaines réponses.
- API publique.
- Panneau admin complet.
- Monétisation.
- Intégration multimédia.

## 18 — Critères d’acceptation

Le projet sera considéré comme conforme si :

- le bot répond sans crash sur des scénarios normaux,
- les sessions sont persistées,
- les commandes globales fonctionnent partout,
- les jeux sont séparés proprement,
- les erreurs sont gérées,
- la route admin est protégée,
- les logs sont exploitables,
- le bot peut être redémarré sans tout perdre.

## 19 — Conclusion

Ce cahier des charges v2 pose une base plus professionnelle que la version initiale. Il garde ton idée de bot de jeux WhatsApp, mais ajoute une structure plus robuste, plus sécurisée et plus simple à faire évoluer.
