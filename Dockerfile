# ─────────────────────────────────────────────────────────────
#  WAH4Hospital V2 — Frontend Container  (Vite + React)
#  Owner: UNICA-HIJA
#  Tech Stack Layer: Containerization (Docker)
# ─────────────────────────────────────────────────────────────

# Stage 1 — Build the React/Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy all source files and build for production
COPY . .
RUN npm run build

# Stage 2 — Serve built files with Nginx (reverse proxy)
FROM nginx:stable-alpine AS production

# Copy the compiled dist/ folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
