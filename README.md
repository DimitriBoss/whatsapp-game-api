# 🎮 WhatsApp Game Bot API

🚀 **Bot de Jeu WhatsApp MVP prêt pour la production !**  
📞 **Numéro de téléphone officiel du Bot** : [+229 01 906 21514](https://wa.me/2290190621514) (Envoie un message pour commencer à jouer !)

Une API de bot WhatsApp interactive et robuste construite avec **NestJS**, **Prisma** et **PostgreSQL/Supabase**. Ce bot permet de jouer en solo ou d'animer des discussions en proposant des jeux cultes adaptés aux réalités culturelles béninoises/africaines.

---

## ✨ Fonctionnalités Majeures (MVP)

*   **🎮 Deux Modes de Jeu Riches** :
    *   **Action / Vérité** : Avec un sous-menu dédié permettant de choisir explicitement entre une Action (`/action` ou `1`) et une Vérité (`/verite` ou `2`).
    *   **Devinettes (Riddles)** : Une énigme est proposée, et le joueur dispose de **3 tentatives** pour répondre.
*   **🧠 Système d'Historique sans Doublons** : Le bot suit les questions déjà posées à chaque joueur (via son `chatId`) pour éviter de lui renvoyer deux fois la même question au cours d'une partie. L'historique se réinitialise automatiquement lorsque toutes les questions ont été posées.
*   **🎯 Normalisation Inteligente & Synonymes locaux** :
    *   Les réponses des joueurs sont nettoyées automatiquement (suppression des accents, de la ponctuation, des majuscules et des espaces inutiles).
    *   Les réponses intègrent des synonymes adaptés à la réalité béninoise (ex: la réponse à la devinette sur l'habit accepte *corde*, *fil* ou *élastique* ; la bouillie accepte *bouillie*, *akui* ou *koko*).
*   **🌱 Base de Données Pré-peuplée (300 Questions)** :
    *   100 Actions drôles et engageantes (ex: imiter un conducteur de Zémidjan sous le soleil).
    *   100 Vérités croustillantes.
    *   100 Devinettes stimulantes.
*   **⚡ Résilient et Stable pour la Production** :
    *   **Zéro crash** : Tous les événements de message sont enveloppés dans un bloc `try...catch` global. Si la base de données subit une micro-coupure ou si WhatsApp échoue, le bot reste en ligne.
    *   **Optimisation RAM** : Chromium est configuré pour consommer un minimum de ressources (indispensable sur VPS ou Docker de type Railway).

---

## 🛠️ Stack Technique

*   **Framework** : NestJS (Node.js)
*   **ORM** : Prisma 7
*   **Base de Données** : PostgreSQL / Supabase
*   **API WhatsApp** : `whatsapp-web.js` (qui pilote une instance headless de Chromium)

---

## 📦 Installation et Lancement Local

### 1. Cloner et installer les dépendances
```bash
git clone https://github.com/DimitriBoss/whatsapp-game-api.git
cd whatsapp-game-api
npm install
```

### 2. Variables d'environnement
Crée un fichier `.env` à la racine du projet et configure tes accès :
```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
```

### 3. Appliquer le schéma de base de données
```bash
npx prisma migrate dev
```

### 4. Remplir la base de données (Seeding)
```bash
npx prisma db seed
```

### 5. Lancer l'application
```bash
npm run start:dev
```
Scanne le QR Code généré directement dans ton terminal avec ton application WhatsApp (Appareils connectés) pour lier le bot.

---

## 🚀 Déploiement sur Railway

Railway est idéal pour héberger cette application NestJS + PostgreSQL.

### Étape 1 : Créer la Base de Données
Vous pouvez utiliser votre base de données **Supabase** existante ou provisionner un service **PostgreSQL** directement sur Railway.

### Étape 2 : Configurer les Variables d'Environnement sur Railway
Dans ton projet Railway, ajoute les variables d'environnement suivantes dans l'onglet **Variables** :
*   `DATABASE_URL` : L'URL de connexion à ta base PostgreSQL (Supabase ou PostgreSQL Railway).
*   `PORT` : `3000` (Railway injecte cette variable automatiquement).

### Étape 3 : Spécifier le build de production
Assure-toi que Railway utilise la commande de build et de démarrage configurée dans `package.json` :
*   Build Command : `npm run build`
*   Start Command : `npm run start:prod`

*(Note : Avant le premier démarrage en production, assure-toi d'avoir exécuté la migration et le seed sur ton instance de production via les commandes Prisma).*

### Étape 4 : Lier ton WhatsApp
Une fois le déploiement lancé sur Railway, ouvre l'onglet **Logs** de votre service. 
Lors du premier démarrage, le QR Code de connexion s'affichera directement dans les logs de Railway. 

💡 **Astuce de liaison** : Si le QR code terminal est déformé, un lien cliquable `https://api.qrserver.com/...` s'affiche aussi dans les logs. Clique dessus pour afficher une image de QR Code HD parfaite à scanner avec ton téléphone (*Paramètres > Appareils connectés*).

Grâce à la stratégie `LocalAuth` et à la simulation d'un User-Agent de bureau (`Chrome 122` sur Windows), le bot conserve sa session active et s'authentifie sans risque de blocage.

---

## 💬 Commandes Utilisateur Clés

*   **`/stop` ou `/close`** : Met le bot en pause/veille complète. Le bot devient totalement silencieux et ignore les messages pour ne pas perturber vos autres conversations.
*   **`/start` ou `/restart`** : Réveille et réactive le bot à tout moment, vous redirigeant vers l'accueil ou le menu principal.
*   **`/reset`** : Réinitialise complètement l'état d'avancement de votre partie.
*   **`0` ou `/retour`** : Retourne au menu précédent (depuis le sous-menu d'Action/Vérité ou le jeu de Devinettes).
*   **`1` ou `/action`** : Demande une nouvelle question d'Action (en mode Action/Vérité).
*   **`2` ou `/verite` ou `/vérité`** : Demande une nouvelle question de Vérité (en mode Action/Vérité).
*   **`suivant`** : Demande une nouvelle devinette (en mode Devinette).
