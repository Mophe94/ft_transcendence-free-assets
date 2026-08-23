FROM alpine:3.22.4

# Installer Node.js et NPM
RUN apk upgrade && apk add --no-cache nodejs npm

# Définir le dossier de travail dans le sous-dossier où se trouvent package.json et server.js
WORKDIR /app/Export

# 1. Copier uniquement les fichiers de dépendances d'abord (pour optimiser le cache Docker)
COPY Export/package*.json ./

# 2. Installer les dépendances directement dans /app/Export
RUN npm install

# 3. Copier le reste des fichiers du projet
COPY . /app

# 4. Lancer le serveur
CMD ["node", "server.js"]