# Image de base avec Node.js
FROM node:22-slim

# Installation des dépendances système requises par Chromium/Puppeteer
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  procps \
  libglib2.0-0 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Création du répertoire de l'application
WORKDIR /app

# Copie des fichiers package.json
COPY package*.json ./

# Installation des dépendances du projet
RUN npm ci

# Copie du code source et de Prisma
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Compilation de l'application NestJS
RUN npm run build

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "start:prod"]
