FROM base-image

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app/

RUN chmod +x /app/healthcheck.sh

RUN npm install
