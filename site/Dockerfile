FROM base-image AS build

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

RUN npm run dev -- --host

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
