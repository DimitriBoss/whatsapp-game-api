# 📘 Cahier des Charges — WhatsApp Game Bot API

> **Version** : 1.0  
> **Date** : 23 juin 2026  
> **Auteur** : AGOSSOU Dimitri  
> **Statut** : MVP — En production  
> **Numéro officiel du Bot** : [+229 01 906 21514](https://wa.me/2290190621514)

---

## Table des Matières

1. [Contexte et Vision](#1---contexte-et-vision)
2. [Objectifs du Projet](#2---objectifs-du-projet)
3. [Public Cible](#3---public-cible)
4. [Périmètre Fonctionnel (MVP)](#4---périmètre-fonctionnel-mvp)
5. [Spécifications Fonctionnelles Détaillées](#5---spécifications-fonctionnelles-détaillées)
6. [Commandes Utilisateur](#6---commandes-utilisateur)
7. [Architecture Technique](#7---architecture-technique)
8. [Stack Technologique](#8---stack-technologique)
9. [Modèle de Données (Schéma Prisma)](#9---modèle-de-données-schéma-prisma)
10. [API REST — Routes HTTP](#10---api-rest--routes-http)
11. [Flux Utilisateur (Diagrammes)](#11---flux-utilisateur-diagrammes)
12. [Gestion des Erreurs et Résilience](#12---gestion-des-erreurs-et-résilience)
13. [Déploiement et Infrastructure](#13---déploiement-et-infrastructure)
14. [Variables d'Environnement](#14---variables-denvironnement)
15. [Sécurité](#15---sécurité)
16. [Contraintes et Limitations](#16---contraintes-et-limitations)
17. [Évolutions Futures (Post-MVP)](#17---évolutions-futures-post-mvp)
18. [Glossaire](#18---glossaire)

---

## 1 — Contexte et Vision

### 1.1 Contexte

WhatsApp est l'application de messagerie dominante en Afrique de l'Ouest, notamment au Bénin. Les jeux conversationnels (Action/Vérité, devinettes) font partie intégrante de la culture sociale locale, que ce soit en famille, entre amis ou lors de rassemblements.

### 1.2 Vision

Créer un **bot WhatsApp interactif** qui permet de jouer à des jeux cultes (Action/Vérité, Devinettes) directement dans une conversation WhatsApp, sans télécharger d'application tierce. Le contenu est **adapté aux réalités culturelles béninoises et africaines**, offrant une expérience familière et engageante.

### 1.3 Proposition de Valeur

| Problème | Solution |
|----------|----------|
| Pas de plateforme de jeux sociaux accessible via WhatsApp au Bénin | Un bot prêt à l'emploi, zéro installation côté utilisateur |
| Contenu de jeux occidental, déconnecté des réalités locales | 300 questions ancrées dans la culture béninoise/africaine |
| Applications de jeux lourdes nécessitant un téléchargement | Fonctionnement 100% dans WhatsApp, aucune app supplémentaire |

---

## 2 — Objectifs du Projet

### 2.1 Objectifs Principaux

- **OBJ-1** : Permettre à n'importe quel utilisateur WhatsApp de jouer en solo à Action/Vérité et Devinettes en envoyant un simple message au bot.
- **OBJ-2** : Proposer un contenu riche (300 questions minimum) adapté à la culture béninoise.
- **OBJ-3** : Garantir une expérience fluide et sans friction (pas de téléchargement, pas de compte à créer).
- **OBJ-4** : Assurer la stabilité en production (zéro crash, reconnexion automatique).

### 2.2 Objectifs Secondaires

- **OBJ-5** : Offrir un tableau de bord administrateur pour suivre l'utilisation du bot.
- **OBJ-6** : Collecter du feedback utilisateur via Google Forms aux jalons de jeu.
- **OBJ-7** : Permettre le contrôle du bot par l'utilisateur (pause/reprise avec `/stop` et `/start`).

### 2.3 Indicateurs de Succès (KPI)

| KPI | Description | Objectif |
|-----|-------------|----------|
| Nombre d'utilisateurs uniques | Comptage des `chatId` distincts | Croissance mensuelle |
| Questions jouées | Total cumulé par type de jeu | > 1000 questions/mois |
| Taux de rétention | Utilisateurs revenant après 1re session | > 30% |
| Formulaires feedback remplis | Soumissions Google Forms | Données qualitatives |

---

## 3 — Public Cible

### 3.1 Persona Principal

| Attribut | Description |
|----------|-------------|
| **Nom** | Jeune béninois·e connecté·e |
| **Âge** | 15 – 35 ans |
| **Localisation** | Bénin, Afrique de l'Ouest francophone |
| **Comportement** | Utilise WhatsApp quotidiennement, aime les jeux sociaux |
| **Besoin** | Divertissement rapide, culturellement pertinent, sans installation |

### 3.2 Cas d'Usage

1. **Solo** : Un utilisateur s'ennuie et envoie un message au bot pour jouer seul.
2. **Animation de groupe** : Un utilisateur utilise le bot pour proposer des questions lors d'une fête, soirée ou réunion entre amis.
3. **Découverte culturelle** : Les devinettes permettent de redécouvrir des éléments de la culture béninoise.

---

## 4 — Périmètre Fonctionnel (MVP)

### 4.1 Fonctionnalités Incluses (IN)

| # | Fonctionnalité | Priorité |
|---|----------------|----------|
| F1 | Jeu Action / Vérité avec sous-menu dédié | 🔴 Critique |
| F2 | Jeu Devinettes avec 3 tentatives de réponse | 🔴 Critique |
| F3 | Onboarding avec demande de prénom | 🔴 Critique |
| F4 | Machine à états (state machine) par utilisateur | 🔴 Critique |
| F5 | Historique sans doublons (anti-répétition) | 🟡 Important |
| F6 | Normalisation des réponses + synonymes locaux | 🟡 Important |
| F7 | Commandes de contrôle `/stop`, `/start`, `/reset` | 🟡 Important |
| F8 | Base de données pré-peuplée (300 questions) | 🔴 Critique |
| F9 | Feedback Google Forms à 20, 50, 100 questions | 🟢 Nice-to-have |
| F10 | Route admin pour statistiques d'utilisation | 🟢 Nice-to-have |
| F11 | Page QR Code web pour connexion Railway | 🟡 Important |

### 4.2 Fonctionnalités Exclues (OUT — MVP)

| # | Fonctionnalité | Raison |
|---|----------------|--------|
| X1 | Mode multijoueur / groupe WhatsApp | Complexité élevée, post-MVP |
| X2 | Système de score persistant / classement | Post-MVP |
| X3 | Interface web admin complète (dashboard) | Post-MVP |
| X4 | Authentification / protection de la route admin | Post-MVP |
| X5 | Gestion multi-langues | Post-MVP |
| X6 | Envoi d'images/médias dans les questions | Post-MVP |

---

## 5 — Spécifications Fonctionnelles Détaillées

### 5.1 — F1 : Jeu Action / Vérité

**Description** : Le joueur choisit entre recevoir une **Action** (défi à réaliser) ou une **Vérité** (question à laquelle répondre honnêtement).

**Règles métier** :
- L'utilisateur sélectionne le mode via le menu principal (option `1`).
- Un sous-menu s'affiche avec deux choix : Action (`1` ou `/action`) et Vérité (`2` ou `/verite`).
- Le bot pioche une question aléatoire du type demandé, en excluant celles déjà posées à cet utilisateur.
- **Action** : L'utilisateur reçoit le défi. Il doit confirmer l'avoir fait en envoyant `ok`, `fait`, `fini`, `terminé`, `oui` ou `done`. Le bot accuse réception mais ne peut pas vérifier l'exécution réelle.
- **Vérité** : L'utilisateur reçoit la question. Il répond librement. Le bot accuse réception de sa réponse sans la juger.
- Le joueur peut naviguer librement entre Action et Vérité sans retourner au menu.
- Option `0` ou `/retour` pour revenir au menu principal.

**Contenu** : 100 actions + 100 vérités culturellement adaptées au Bénin.

### 5.2 — F2 : Jeu Devinettes

**Description** : Le bot propose une énigme/devinette et le joueur doit trouver la réponse.

**Règles métier** :
- L'utilisateur sélectionne le mode via le menu principal (option `2`).
- Le bot envoie une devinette aléatoire (non encore posée à cet utilisateur).
- Le joueur dispose de **3 tentatives** pour trouver la bonne réponse.
- Les réponses sont comparées après **normalisation** (suppression des accents, ponctuation, majuscules).
- Chaque réponse attendue peut contenir des **synonymes** séparés par `|` (ex: `bouillie|akui|koko`).
- Si la réponse est correcte → félicitations + possibilité de continuer.
- Si les 3 tentatives sont épuisées → révélation de la bonne réponse.
- Commande `suivant` pour passer à la devinette suivante.
- Option `0` ou `/retour` pour revenir au menu principal.

**Contenu** : 100 devinettes avec réponses et synonymes béninois.

### 5.3 — F3 : Onboarding Utilisateur

**Description** : Lors du premier contact, le bot demande le prénom de l'utilisateur.

**Flux** :
1. L'utilisateur envoie n'importe quel message → le bot détecte un nouvel utilisateur (`BotState = START`).
2. Le bot demande : *"👋 Bienvenue sur GameBot ! Comment tu t'appelles ?"*
3. L'utilisateur répond avec son prénom → sauvegardé en base.
4. Le bot affiche le menu principal avec le prénom personnalisé.

### 5.4 — F4 : Machine à États (State Machine)

**Description** : Chaque utilisateur possède un état qui détermine le comportement du bot.

**États** :

```
START ──▶ AWAITING_NAME ──▶ MAIN_MENU ──▶ PLAYING_ACTION_VERITE
                                    │
                                    └──▶ PLAYING_DEVINETTE

Depuis n'importe quel état :
  /stop  ──▶ STOPPED (silence total)
  /start ──▶ MAIN_MENU ou AWAITING_NAME
```

| État | Description |
|------|-------------|
| `START` | Nouvel utilisateur, premier contact |
| `AWAITING_NAME` | En attente du prénom |
| `MAIN_MENU` | Menu principal affiché |
| `PLAYING_ACTION_VERITE` | En train de jouer à Action/Vérité |
| `PLAYING_DEVINETTE` | En train de jouer aux Devinettes |
| `STOPPED` | Bot en veille, ignore tous les messages |

### 5.5 — F5 : Historique Sans Doublons

**Description** : Le bot ne pose jamais deux fois la même question à un utilisateur.

**Mécanisme** :
- Chaque `GameSession` stocke un tableau `history` contenant les IDs des questions déjà posées.
- Lors de la pioche, le bot filtre avec `notIn: history`.
- Quand toutes les questions d'un type sont épuisées, l'historique se **réinitialise automatiquement** et le cycle recommence.

### 5.6 — F6 : Normalisation et Synonymes

**Algorithme de normalisation** :
1. Conversion en minuscules (`toLowerCase`)
2. Décomposition Unicode NFD (suppression des accents)
3. Suppression de tous les caractères non-alphanumériques
4. Trim des espaces

**Synonymes** : Les réponses attendues sont séparées par `|`. Le bot vérifie si la réponse normalisée du joueur **contient** l'un des synonymes normalisés.

**Exemple** :
- Réponse stockée : `bouillie|akui|koko`
- Réponse joueur : `C'est la bouillie !` → ✅ Correct

### 5.7 — F7 : Commandes de Contrôle

| Commande | Action | Disponible depuis |
|----------|--------|-------------------|
| `/stop` ou `/close` | Met le bot en veille complète (STOPPED) | Tous les états |
| `/start` ou `/restart` | Réactive le bot, retour au menu | Tous les états (y compris STOPPED) |
| `/reset` | Réinitialise la session de jeu | Tous les états |

**Message affiché systématiquement** :
> 💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._

Ce message est présent dans **chaque réponse** du bot, quel que soit l'écran.

### 5.8 — F9 : Feedback Google Forms

**Description** : Le bot invite l'utilisateur à remplir un formulaire de feedback à des jalons de progression.

**Jalons** : 20 questions, 50 questions, 100 questions (total cumulé, tous jeux confondus).

**Lien du formulaire** : `https://docs.google.com/forms/d/e/1FAIpQLScBKWZbglMZuXABR4r0QE3nbe4E5CFvVk-F_F-DwZaktS0nZg/viewform?usp=dialog`

**Compteurs** : Deux compteurs par utilisateur (`playedActionVerite` et `playedDevinette`) sont incrémentés à chaque question jouée. Le feedback s'affiche quand la somme atteint exactement 20, 50 ou 100.

### 5.9 — F10 : Route Admin — Statistiques

**Endpoint** : `GET /admin/stats`

**Réponse JSON** :
```json
{
  "users": {
    "today": 5,
    "thisWeek": 23,
    "thisMonth": 87,
    "thisYear": 342,
    "total": 342
  },
  "games": {
    "actionVerite": 1520,
    "devinette": 980,
    "mostPlayed": "Action / Vérité"
  }
}
```

**Filtrage temporel** :
- **Aujourd'hui** : Depuis 00h00 du jour courant
- **Cette semaine** : Depuis lundi 00h00
- **Ce mois** : Depuis le 1er du mois courant
- **Cette année** : Depuis le 1er janvier

### 5.10 — F11 : Page QR Code Web

**Endpoint** : `GET /qr`

**Description** : Affiche une page HTML avec le QR Code de connexion WhatsApp, utile pour le déploiement sur Railway où le terminal ne rend pas bien les QR codes.

**Comportement** :
- Si le QR code est disponible → affiche l'image du QR code (via `api.qrserver.com`).
- Si le QR code n'est pas disponible (bot déjà connecté ou pas encore généré) → message informatif.

---

## 6 — Commandes Utilisateur

### 6.1 Commandes Globales (disponibles partout)

| Commande | Description |
|----------|-------------|
| `/stop` | Met le bot en pause (mode STOPPED) |
| `/close` | Alias de `/stop` |
| `/start` | Réactive le bot |
| `/restart` | Alias de `/start` |
| `/reset` | Réinitialise la session et réactive le bot |

### 6.2 Commandes de Navigation

| Commande | Contexte | Description |
|----------|----------|-------------|
| `1` | Menu principal | Lancer Action/Vérité |
| `2` | Menu principal | Lancer Devinettes |
| `1` ou `/action` | Mode Action/Vérité | Recevoir une Action |
| `2` ou `/verite` | Mode Action/Vérité | Recevoir une Vérité |
| `0` ou `/retour` | Mode Action/Vérité ou Devinette | Retour au menu principal |
| `suivant` | Mode Devinette | Passer à la devinette suivante |
| `ok`, `fait`, `fini`... | Action en cours | Confirmer l'exécution d'une action |

---

## 7 — Architecture Technique

### 7.1 Architecture Globale

```
┌───────────────────────────────────────────────────────┐
│                    Railway (Cloud)                     │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │              NestJS Application                 │  │
│  │                                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │ WhatsApp │  │   Game   │  │    Admin     │  │  │
│  │  │ Module   │  │  Module  │  │   Module     │  │  │
│  │  │          │  │          │  │              │  │  │
│  │  │ Service  │  │ Service  │  │  Service     │  │  │
│  │  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │  │
│  │       │              │               │          │  │
│  │       │         ┌────▼───────────────▼────┐     │  │
│  │       │         │    Prisma Module        │     │  │
│  │       │         │    (PrismaService)      │     │  │
│  │       │         └────────────┬────────────┘     │  │
│  │       │                     │                   │  │
│  └───────┼─────────────────────┼───────────────────┘  │
│          │                     │                       │
│  ┌───────▼───────┐    ┌───────▼──────────┐            │
│  │  Chromium     │    │  PostgreSQL      │            │
│  │  (Puppeteer)  │    │  (Supabase)      │            │
│  │  headless     │    │                  │            │
│  └───────┬───────┘    └──────────────────┘            │
│          │                                            │
└──────────┼────────────────────────────────────────────┘
           │
    ┌──────▼──────┐
    │  WhatsApp   │
    │  Servers    │
    └─────────────┘
```

### 7.2 Modules NestJS

| Module | Rôle | Fichiers Clés |
|--------|------|---------------|
| **AppModule** | Module racine, orchestration | `app.module.ts`, `app.controller.ts` |
| **WhatsappModule** | Connexion WA, réception/envoi messages | `whatsapp.service.ts`, `whatsapp.module.ts` |
| **GameModule** | Logique de jeu, gestion des sessions | `game.service.ts`, `game.module.ts` |
| **AdminModule** | Statistiques d'utilisation | `admin.service.ts`, `admin.controller.ts` |
| **PrismaModule** | Accès à la base de données | `prisma.service.ts`, `prisma.module.ts` |

### 7.3 Structure des Fichiers

```
whatsapp-game-api/
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   ├── seed.ts                # Script de peuplement (300 questions)
│   └── migrations/            # Historique des migrations
├── src/
│   ├── main.ts                # Point d'entrée (bootstrap NestJS)
│   ├── app.module.ts          # Module racine
│   ├── app.controller.ts      # Routes / et /qr
│   ├── app.service.ts         # Service racine
│   ├── prisma/
│   │   ├── prisma.module.ts   # Module Prisma (Global)
│   │   └── prisma.service.ts  # Service d'accès BDD
│   ├── whatsapp/
│   │   ├── whatsapp.module.ts # Module WhatsApp
│   │   └── whatsapp.service.ts# Cœur du bot (state machine)
│   ├── game/
│   │   ├── game.module.ts     # Module Game
│   │   └── game.service.ts    # Logique de jeu + queries Prisma
│   └── admin/
│       ├── admin.module.ts    # Module Admin
│       ├── admin.controller.ts# Route GET /admin/stats
│       └── admin.service.ts   # Agrégations statistiques
├── Dockerfile                 # Image Docker pour Railway
├── package.json
├── tsconfig.json
└── .env                       # Variables d'environnement
```

---

## 8 — Stack Technologique

### 8.1 Technologies Principales

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| **Runtime** | Node.js | 22 | LTS, performances optimales |
| **Framework** | NestJS | 11.x | Architecture modulaire, TypeScript natif |
| **Langage** | TypeScript | 5.7+ | Typage fort, maintenabilité |
| **ORM** | Prisma | 7.8 | Type-safe, migrations, seeding |
| **BDD** | PostgreSQL | 15+ | Robuste, hébergeable sur Supabase |
| **API WhatsApp** | whatsapp-web.js | 1.34+ | Pilote Chromium headless pour WhatsApp Web |
| **Browser** | Chromium (Puppeteer) | Headless | Requis par whatsapp-web.js |

### 8.2 Dépendances Principales

| Package | Rôle |
|---------|------|
| `@nestjs/core` | Framework principal |
| `@prisma/client` | Client ORM auto-généré |
| `whatsapp-web.js` | Communication WhatsApp |
| `qrcode-terminal` | Affichage QR code dans le terminal |
| `dotenv` | Chargement des variables d'environnement |
| `pg` | Driver PostgreSQL natif |
| `@prisma/adapter-pg` | Adapteur Prisma pour pg natif |

### 8.3 Outils de Développement

| Outil | Rôle |
|-------|------|
| ESLint | Linting du code |
| Prettier | Formatage du code |
| Jest | Tests unitaires |
| ts-node | Exécution TypeScript directe |

---

## 9 — Modèle de Données (Schéma Prisma)

### 9.1 Diagramme Entité-Relation

```
┌──────────────────────────────┐
│           User               │
├──────────────────────────────┤
│ id          UUID (PK)        │
│ phoneNumber String (UNIQUE)  │
│ firstName   String?          │
│ lastName    String?          │
│ botState    BotState (enum)  │
│ playedActionVerite  Int (0)  │
│ playedDevinette     Int (0)  │
│ createdAt   DateTime         │
│ updatedAt   DateTime         │
└──────────────────────────────┘

┌──────────────────────────────┐
│         Question             │
├──────────────────────────────┤
│ id        UUID (PK)          │
│ text      String             │
│ answer    String?            │
│ type      QuestionType (enum)│
│ createdAt DateTime           │
└──────────────────────────────┘

┌──────────────────────────────┐
│       GameSession            │
├──────────────────────────────┤
│ id                UUID (PK)  │
│ chatId            String (U) │
│ currentQuestionId UUID?      │
│ attempts          Int (0)    │
│ history           UUID[]     │
│ updatedAt         DateTime   │
└──────────────────────────────┘
```

### 9.2 Enums

**BotState** :
```
START | AWAITING_NAME | MAIN_MENU | PLAYING_ACTION_VERITE | PLAYING_DEVINETTE | STOPPED
```

**QuestionType** :
```
ACTION | VERITE | DEVINETTE
```

### 9.3 Description des Tables

#### Table `users`

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | UUID | PK, auto | Identifiant unique |
| `phoneNumber` | String | UNIQUE | Identifiant WhatsApp (`chatId`) |
| `firstName` | String? | — | Prénom saisi par l'utilisateur |
| `lastName` | String? | — | Nom (non utilisé dans le MVP) |
| `botState` | BotState | DEFAULT START | État courant de la machine à états |
| `playedActionVerite` | Int | DEFAULT 0 | Compteur total de questions Action/Vérité jouées |
| `playedDevinette` | Int | DEFAULT 0 | Compteur total de devinettes jouées |
| `createdAt` | DateTime | auto | Date de création |
| `updatedAt` | DateTime | auto | Dernière mise à jour |

#### Table `questions`

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | UUID | PK, auto | Identifiant unique |
| `text` | String | NOT NULL | Texte de la question/action/devinette |
| `answer` | String? | — | Réponse(s) attendue(s), séparées par `\|` |
| `type` | QuestionType | NOT NULL | Catégorie : ACTION, VERITE ou DEVINETTE |
| `createdAt` | DateTime | auto | Date de création |

#### Table `game_sessions`

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | UUID | PK, auto | Identifiant unique |
| `chatId` | String | UNIQUE | Identifiant du chat WhatsApp |
| `currentQuestionId` | UUID? | — | ID de la devinette en cours (null si Action/Vérité) |
| `attempts` | Int | DEFAULT 0 | Tentatives actuelles sur la devinette en cours |
| `history` | UUID[] | — | Liste des IDs de questions déjà posées |
| `updatedAt` | DateTime | auto | Dernière mise à jour |

---

## 10 — API REST — Routes HTTP

### 10.1 Routes Publiques

| Méthode | Route | Description | Réponse |
|---------|-------|-------------|---------|
| `GET` | `/` | Health check | `"Hello World!"` |
| `GET` | `/qr` | Page HTML avec le QR Code de connexion | HTML |

### 10.2 Routes Administrateur

| Méthode | Route | Description | Réponse |
|---------|-------|-------------|---------|
| `GET` | `/admin/stats` | Statistiques d'utilisation | JSON (voir §5.9) |

> ⚠️ **Note** : Dans le MVP, la route `/admin/stats` n'est pas protégée par authentification. Une protection (API Key, JWT) est prévue en post-MVP.

---

## 11 — Flux Utilisateur (Diagrammes)

### 11.1 Flux Principal

```
Utilisateur envoie un message
        │
        ▼
  ┌─────────────────┐
  │ /stop ou /close? │──YES──▶ État → STOPPED → Silence total
  └────────┬────────┘
           │ NO
           ▼
  ┌─────────────────────┐
  │ /start ou /restart? │──YES──▶ Reset session → Menu principal
  └────────┬────────────┘
           │ NO
           ▼
  ┌────────────────┐
  │ État = STOPPED?│──YES──▶ Ignorer le message (silence)
  └────────┬───────┘
           │ NO
           ▼
  ┌────────────────────┐
  │  Switch (botState)  │
  └────────┬───────────┘
           │
    ┌──────┼──────┬──────────────┬────────────────┐
    ▼      ▼      ▼              ▼                ▼
  START  AWAIT   MENU      ACTION/VÉRITÉ     DEVINETTE
    │    _NAME    │              │                │
    ▼      │      ▼              ▼                ▼
 Demande   │   Choix 1/2    Action ou        Devinette
 prénom    │                Vérité?           3 essais
           ▼
       Sauve prénom
       → Menu
```

### 11.2 Flux Devinette (Détaillé)

```
Entrée mode Devinette
        │
        ▼
   Pioche devinette aléatoire
   (exclut l'historique)
        │
        ▼
   Envoie la devinette
        │
        ▼
  ┌─────────────────┐
  │ Réponse joueur  │
  └────────┬────────┘
           │
     ┌─────┼──────────┐
     ▼     ▼          ▼
   "0"  "suivant"  Tentative
    │      │          │
    ▼      ▼          ▼
  Menu   Nouvelle   Normaliser
         devinette  & comparer
                       │
                 ┌─────┼─────┐
                 ▼           ▼
              Correct     Incorrect
                 │           │
                 ▼           ▼
            🎉 Bravo!   Essais < 3?
                         │      │
                        YES    NO
                         │      │
                         ▼      ▼
                      Réessaie  Révèle
                                réponse
```

---

## 12 — Gestion des Erreurs et Résilience

### 12.1 Stratégie Globale

Toute la logique de traitement des messages est enveloppée dans un **bloc `try...catch` global** au niveau du listener `client.on('message')`.

### 12.2 Gestion des Cas d'Erreur

| Erreur | Comportement |
|--------|-------------|
| Erreur Prisma (BDD indisponible) | Le bot reste en ligne, envoie un message d'erreur temporaire à l'utilisateur |
| Erreur WhatsApp (envoi impossible) | Loguée dans la console, le bot continue pour les autres utilisateurs |
| Échec d'authentification | Logué via `client.on('auth_failure')` |
| Déconnexion WhatsApp | Détectée via `client.on('disconnected')`, loguée |
| Message d'un état inconnu | Le switch ne fait rien (silence), pas de crash |

### 12.3 Optimisation Puppeteer

Le navigateur Chromium est configuré avec des flags pour minimiser la consommation de ressources :

```
--no-sandbox
--disable-setuid-sandbox
--disable-dev-shm-usage
--disable-accelerated-2d-canvas
--no-first-run
--no-zygote
--disable-gpu
--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
```

---

## 13 — Déploiement et Infrastructure

### 13.1 Plateforme Cible

| Composant | Service |
|-----------|---------|
| **Application** | Railway (Docker) |
| **Base de données** | Supabase PostgreSQL |
| **Conteneurisation** | Docker (image `node:22-slim`) |

### 13.2 Pipeline de Déploiement

```
git push → Railway détecte le push
    │
    ▼
Docker build (Dockerfile)
    │
    ├── Installation dépendances système (Chromium libs)
    ├── npm ci
    ├── prisma generate
    └── npm run build
    │
    ▼
Démarrage : npm run start:prod
    │
    ▼
QR Code disponible dans les logs Railway ou via /qr
```

### 13.3 Dockerfile

L'image Docker est basée sur `node:22-slim` et inclut :
- Toutes les bibliothèques système requises par Chromium/Puppeteer (libnss3, libatk, libgbm, etc.)
- Installation des dépendances Node.js via `npm ci`
- Génération du client Prisma
- Compilation TypeScript via NestJS CLI
- Port exposé : `3000`

### 13.4 Connexion WhatsApp

| Méthode | Description |
|---------|-------------|
| **LocalAuth** | Sauvegarde la session sur le disque pour éviter de rescanner le QR à chaque redémarrage |
| **WebVersionCache** | Utilise une version cachée de WhatsApp Web depuis le repo `wppconnect-team/wa-version` |
| **User-Agent** | Simule Chrome 122 sur Windows pour éviter les blocages |

---

## 14 — Variables d'Environnement

| Variable | Obligatoire | Description | Exemple |
|----------|-------------|-------------|---------|
| `DATABASE_URL` | ✅ | URL de connexion PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `PORT` | ❌ | Port du serveur HTTP | `3000` (défaut) |

---

## 15 — Sécurité

### 15.1 Mesures Actuelles (MVP)

| Mesure | Détail |
|--------|--------|
| Pas de données sensibles stockées | Seul le `chatId` (numéro WhatsApp) et le prénom sont stockés |
| Isolation Docker | L'application tourne dans un conteneur isolé |
| Pas de credentials en dur | Variables d'environnement via `.env` |

### 15.2 Points d'Amélioration (Post-MVP)

| Point | Action Recommandée |
|-------|-------------------|
| Route `/admin/stats` non protégée | Ajouter une API Key ou un JWT |
| Pas de rate limiting | Implémenter un throttle pour éviter les abus |
| Pas de validation des entrées | Ajouter une validation/sanitization des messages |
| Pas de HTTPS en direct | Assuré par Railway (reverse proxy) |

---

## 16 — Contraintes et Limitations

### 16.1 Contraintes Techniques

| Contrainte | Impact |
|------------|--------|
| `whatsapp-web.js` n'est pas une API officielle | Risque de blocage ou de changement d'API par Meta |
| Chromium consomme beaucoup de RAM | Nécessite au minimum 512 Mo de RAM sur le serveur |
| LocalAuth nécessite un volume persistant | Sur Railway, les données sont perdues sans volume |
| Un seul numéro WhatsApp par instance | Pas de multi-tenant dans le MVP |

### 16.2 Contraintes Fonctionnelles

| Contrainte | Impact |
|------------|--------|
| Le bot ne peut pas vérifier les actions réalisées | Système de confiance (confirmation par l'utilisateur) |
| Le bot ne peut pas vérifier la véracité des réponses Vérité | Système de confiance |
| Pas de mode groupe | Le bot ne distingue pas les joueurs dans un groupe |
| 300 questions fixes | Le contenu est statique (peuplé par seed), pas d'interface d'ajout |

---

## 17 — Évolutions Futures (Post-MVP)

### 17.1 Court Terme (v1.1)

| # | Fonctionnalité | Description |
|---|----------------|-------------|
| E1 | 🔐 Sécurisation admin | Protection de `/admin/stats` par API Key |
| E2 | 📊 Dashboard web admin | Interface visuelle pour les statistiques |
| E3 | 🔄 Ajout de questions via admin | CRUD de questions sans re-seeder |
| E4 | 📸 Questions avec images | Support des médias (photos, GIFs) |

### 17.2 Moyen Terme (v2.0)

| # | Fonctionnalité | Description |
|---|----------------|-------------|
| E5 | 👥 Mode multijoueur | Gestion des groupes WhatsApp avec tour de jeu |
| E6 | 🏆 Système de score | Points, classement entre joueurs |
| E7 | 🌍 Multi-langues | Support du Fon, Yoruba, Anglais |
| E8 | 🎮 Nouveaux jeux | Jeu du pendu, Quiz culture générale, etc. |

### 17.3 Long Terme (v3.0)

| # | Fonctionnalité | Description |
|---|----------------|-------------|
| E9 | 🤖 IA pour les réponses | Analyse sémantique des réponses (NLP) |
| E10 | 💰 Monétisation | Abonnement premium, questions exclusives |
| E11 | 📱 App mobile compagnon | Application mobile pour gérer les parties |
| E12 | 🔗 API publique | Ouvrir le bot à des intégrations tierces |

---

## 18 — Glossaire

| Terme | Définition |
|-------|-----------|
| **Bot** | Programme automatisé qui interagit avec les utilisateurs via WhatsApp |
| **chatId** | Identifiant unique d'un utilisateur WhatsApp (format : `229XXXXXXXXX@c.us`) |
| **State Machine** | Machine à états finis qui gère les transitions d'écran du bot |
| **Seed** | Script qui pré-remplit la base de données avec des données initiales (300 questions) |
| **QR Code** | Code-barres 2D scanné par WhatsApp pour lier un appareil connecté |
| **LocalAuth** | Stratégie de `whatsapp-web.js` qui sauvegarde la session d'authentification sur disque |
| **Normalisation** | Processus de nettoyage d'une chaîne de caractères pour comparaison (suppression accents, ponctuation, etc.) |
| **Puppeteer** | Bibliothèque Node.js pour contrôler un navigateur Chromium en mode headless |
| **Railway** | Plateforme PaaS de déploiement cloud |
| **Supabase** | Alternative open-source à Firebase, utilisée ici pour héberger PostgreSQL |
| **MVP** | Minimum Viable Product — version minimale viable du produit |
| **NestJS** | Framework Node.js progressif pour la construction d'applications serveur |
| **Prisma** | ORM (Object-Relational Mapping) moderne pour Node.js et TypeScript |
| **Zémidjan** | Moto-taxi, moyen de transport emblématique au Bénin |

---

> 📄 **Ce cahier des charges est un document vivant.** Il sera mis à jour à chaque évolution majeure du projet.
