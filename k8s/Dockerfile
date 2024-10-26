FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npm run build && npm run start"]