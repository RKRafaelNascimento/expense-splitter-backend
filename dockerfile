FROM node:18.20.4-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.development .env

RUN npm run build

FROM node:18.20.4-bullseye-slim

RUN apt-get update && apt-get install -y libssl1.1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src  
COPY --from=builder /app/prisma ./prisma
COPY .env .env

CMD ["npm", "start"]
