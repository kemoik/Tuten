# ─────────────────────────────────────────────
#  STAGE 1: Build the React app
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy the rest of the source
COPY . .

# Build production bundle
RUN npm run build

# ─────────────────────────────────────────────
#  STAGE 2: Serve with Nginx (tiny & fast)
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
