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
# Stage 2: Production runtime
# ============================
FROM node:22.17.1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]


# ============================
# Stage 3: Development (for Compose Watch)
# ============================
FROM node:22.17.1-alpine AS dev

WORKDIR /app

# Copy dependency files first
COPY package*.json ./
RUN npm install && npm install -g nodemon ts-node typescript

# Copy source code (Compose Watch will keep it synced)
COPY . .

EXPOSE 3000

# Use nodemon for live reload
CMD ["nodemon", "--watch", "src", "src/index.ts"]
