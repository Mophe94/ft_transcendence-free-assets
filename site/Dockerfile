# ---- Build ----
FROM base-image AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production ----
FROM base-image AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173

COPY --from=build /app/healthcheck.js ./healthcheck.js
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/dist ./dist

USER node

EXPOSE 5173

CMD ["node", "server.mjs"]
