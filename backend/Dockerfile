FROM alpine:3.22.4

WORKDIR /app

RUN apk upgrade && apk add npm

COPY . /app/

RUN chmod +x /app/healthcheck.sh

RUN npm install
