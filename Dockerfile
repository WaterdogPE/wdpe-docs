# syntax=docker/dockerfile:1

# --- Stage 1: build the static site ---
FROM node:20-alpine AS build
WORKDIR /app

# git is needed for VitePress's `lastUpdated` (reads commit timestamps)
RUN apk add --no-cache git

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Build the VitePress site
COPY . .
RUN npm run docs:build

# --- Stage 2: serve with nginx ---
FROM nginx:alpine AS runtime

# Static-site-friendly nginx config (gzip, asset caching, clean-URL fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# VitePress output dir is docs/.vitepress/dist (srcDir is docs/)
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
