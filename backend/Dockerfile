# ---- Build ----
FROM base-image AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

# ---- Production ----
FROM base-image AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/healthcheck.sh ./healthcheck.sh
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000
