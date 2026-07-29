FROM base-image

WORKDIR /app

COPY package*.json /app/

RUN npm ci --omit=dev

COPY . /app/
