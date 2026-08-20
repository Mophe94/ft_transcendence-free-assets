# ---- Build ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG HTTPS_ADDR
ARG WSS_ADDR
ARG API_42_CLIENT_ID
ARG API_42_OUTBOUND
ARG DOMAIN_NAME

COPY . .

ENV VITE_DOMAIN_NAME="$DOMAIN_NAME" \
    VITE_USERS_SERVICE="$HTTPS_ADDR/users" \
    VITE_ROOM_SERVICE="$HTTPS_ADDR/rooms" \
    VITE_IFRAME_SERVICE="$HTTPS_ADDR/iframe" \
    VITE_CHAT_SERVICE="$WSS_ADDR/chat" \
    VITE_GAME_SERVICE="$WSS_ADDR/game" \
    VITE_LOBBY_SERVICE="$WSS_ADDR/lobby" \
    VITE_42_OAUTH_CLIENT_ID="$API_42_CLIENT_ID" \
    VITE_42_OAUTH_REDIRECT_URI="$HTTPS_ADDR/auth/callback" \
    VITE_42_OAUTH_API="$API_42_OUTBOUND/oauth/token"

ENV VITE_42_OAUTH_API_LINK="https://api.intra.42.fr/oauth/authorize?client_id=$API_42_CLIENT_ID&redirect_uri=$VITE_42_OAUTH_REDIRECT_URI&response_type=code"

RUN npm run build

# ---- Production ----
FROM scratch AS production

COPY --from=build /app/dist /
