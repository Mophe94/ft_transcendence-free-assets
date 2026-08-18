# ---- Build ----
FROM base-image AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_DOMAIN_NAME
ARG VITE_USERS_SERVICE
ARG VITE_CHAT_SERVICE
ARG VITE_GAME_SERVICE
ARG VITE_ROOM_SERVICE
ARG VITE_LOBBY_SERVICE
ARG VITE_42_OAUTH_CLIENT_ID
ARG VITE_42_OAUTH_REDIRECT_URI
ARG VITE_42_OAUTH_API_LINK
ARG VITE_42_OAUTH_API
ARG VITE_IFRAME_SERVICE

COPY . .

ENV VITE_DOMAIN_NAME            ="$VITE_DOMAIN_NAME" \
    VITE_USERS_SERVICE          ="$HTTPS_ADDR/users" \
    VITE_ROOM_SERVICE           ="$HTTPS_ADDR/rooms" \
    VITE_IFRAME_SERVICE         ="$HTTPS_ADDR/iframe" \
    VITE_CHAT_SERVICE           ="$WSS_ADDR/chat" \
    VITE_GAME_SERVICE           ="$WSS_ADDR/game" \
    VITE_LOBBY_SERVICE          ="$WSS_ADDR/lobby" \
    VITE_42_OAUTH_CLIENT_ID     ="$(API_42_CLIENT_ID)" \
    VITE_42_OAUTH_REDIRECT_URI  ="$HTTPS_ADDR/auth/callback" \
    VITE_42_OAUTH_API           ="$42_API_OUTBOUND/oauth/token" \
    VITE_42_OAUTH_API_LINK      ="https://api.intra.42.fr/oauth/authorize?client_id=$API_42_CLIENT_ID&redirect_uri=$VITE_OAUTH_REDIRECT_URI&response_type=code"

RUN npm run build

# ---- Production ----
FROM build AS production

WORKDIR /app

COPY --from=production /app/dist /
