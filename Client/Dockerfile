# ============================
# Stage 1: Build Angular app (production)
# ============================
FROM node:22.17.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============================
# Stage 2: Serve with NGINX (production)
# ============================
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist/client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# ============================
# Stage 3: Development (for Compose Watch)
# ============================
FROM node:22.17.1-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy source code (Compose Watch syncs changes)
COPY . .

EXPOSE 4200

# Angular CLI dev server with live reload
CMD ["npm", "start"]
