FROM base-image

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app/
