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
# Stage 2: Development (local only)
# ============================
FROM node:22.17.1-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -g nodemon ts-node typescript

COPY . .

EXPOSE 3000

CMD ["nodemon", "--watch", "src", "src/index.ts"]


# ============================
# Stage 3: Production runtime (used by Render)
# ============================
FROM node:22.17.1-alpine AS runner

WORKDIR /app

# *** IMPORTANT FIXES ***
ENV RUNNING_IN_DOCKER=true
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# copy the built JS
COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/index.js"]
