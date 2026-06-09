FROM alpine:3.22.4

WORKDIR /app

RUN apk upgrade && apk add npm

RUN ls -la

RUN npm install

CMD ["npm", "run", "dev"]