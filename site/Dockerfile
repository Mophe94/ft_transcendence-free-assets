#FROM base-image AS build

#WORKDIR /app

#COPY package*.json /app/

#RUN npm ci

#COPY . /app

#RUN npm run build

#FROM nginx:alpine

#COPY --from=build /app/dist /usr/share/nginx/html

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
FROM base-image

WORKDIR /app

COPY . /app/

COPY package*.json /app/

RUN npm ci

RUN chmod +x /app/healthcheck.js

CMD ["npm","run","dev","--","--host"]
