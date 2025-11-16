# ============================
# Stage 1: Build for production
# ============================
FROM node:22.17.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ============================
# Stage 2: Development (for local Compose Watch)
# ============================
FROM node:22.17.1-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -g nodemon ts-node typescript

COPY . .

EXPOSE 3000

CMD ["nodemon", "--watch", "src", "src/index.ts"]


# ============================
# Stage 3: Production runtime (LAST!)
# ============================
FROM node:22.17.1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

# Render looks at EXPOSE to detect your service port
EXPOSE 3000

# Production start command
CMD ["node", "dist/index.js"]

