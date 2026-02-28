FROM --platform=$BUILDPLATFORM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
COPY node_modules ./node_modules
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM nginx:alpine

RUN printf '%s\n' \
  'events { worker_connections 1024; }' \
  'http {' \
  '  include /etc/nginx/mime.types;' \
  '  default_type application/octet-stream;' \
  '  sendfile on;' \
  '  keepalive_timeout 65;' \
  '  gzip on;' \
  '  server {' \
  '    listen 80;' \
  '    root /usr/share/nginx/html;' \
  '    index index.html;' \
  '    # Serve binaries as static files (no SPA fallback).' \
  '    location ^~ /release/ { try_files $uri =404; }' \
  '    location ^~ /downloads/ { try_files $uri =404; }' \
  '    location / { try_files $uri $uri/ /index.html; }' \
  '    location /health { return 200 "healthy"; add_header Content-Type text/plain; }' \
  '  }' \
  '}' > /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
