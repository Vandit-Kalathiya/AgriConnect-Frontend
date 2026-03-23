# ──────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# .env on EC2 is included in the build context — Vite reads it automatically
COPY . .

RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2 — Serve
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5000

# -s: SPA mode (all routes fall back to index.html)
# -l: listen port
CMD ["serve", "-s", "dist", "-l", "5000"]
