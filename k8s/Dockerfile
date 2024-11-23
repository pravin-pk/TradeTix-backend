FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY . .

COPY package-lock.json ./package-lock.json

RUN npm ci

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npm run start"]