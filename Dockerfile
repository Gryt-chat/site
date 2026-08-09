FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY node_modules ./node_modules
RUN yarn install --frozen-lockfile --ignore-engines

COPY . .
RUN yarn build

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
  '    # Relative 301s. Without this nginx builds the Location header from its' \
  '    # own listen directive, so the redirect that adds a trailing slash came' \
  '    # back as http://gryt.chat/... on an https site.' \
  '    absolute_redirect off;' \
  '    # Serve binaries as static files (no SPA fallback).' \
  '    location ^~ /release/ { try_files $uri =404; }' \
  '    location ^~ /downloads/ { try_files $uri =404; }' \
  '    # Every real route is prerendered into a directory by' \
  '    # scripts/prerender-blog.mjs, so a path that does not resolve is a path' \
  '    # that does not exist. Falling back to /index.html instead meant any' \
  '    # typo answered 200 with the front page metadata: a soft 404, indexed by' \
  '    # crawlers as a duplicate of the home page.' \
  '    location / { try_files $uri $uri/ =404; }' \
  '    # Served directly rather than 301d to /auth/callback/. Before the' \
  '    # fallback changed, this path had no directory and fell through to the' \
  '    # SPA with no redirect at all; now that it has one, try_files would add' \
  '    # a hop to the middle of a sign-in. The query string survives the' \
  '    # redirect either way, but an auth callback is the last place to' \
  '    # introduce a behaviour change for tidiness.' \
  '    location = /auth/callback { try_files /auth/callback/index.html =404; }' \
  '    error_page 404 /404.html;' \
  '    location = /404.html { internal; }' \
  '    location /health { return 200 "healthy"; add_header Content-Type text/plain; }' \
  '  }' \
  '}' > /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1, not localhost: localhost resolves to ::1 first here and nginx is
# listening on IPv4, so the probe was refused every time —
#   Connecting to localhost ([::1]:80)
#   wget: can't connect to remote host: Connection refused
# while the site itself served fine through the published port.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
