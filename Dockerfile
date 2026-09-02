# syntax=docker/dockerfile:1
#
# The syntax directive is required for the cache mount below. Without it
# BuildKit parses `RUN --mount` as a plain RUN with odd arguments and the build
# fails in a way that does not obviously point back here.

FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

# Skip the download half of an invalidated install.
#
# Measured on the Raspberry Pi that serves gryt.chat (GRYT-833). A cold
# `yarn install` here takes 641s, which is 71% of the whole 15-minute build, and
# it splits almost evenly:
#
#     [1/4] Resolving     0.7s
#     [2/4] Fetching    289s     <- this is what the cache mount removes
#     [3/4] Linking     280s     <- this is not
#     [4/4] Building      1.8s
#
# So this is worth roughly 289 seconds, not 641. The linking phase is writing
# tens of thousands of small files to a USB flash drive and no cache helps with
# that; making it faster means a different package manager or building the image
# somewhere other than a Pi, both of which are on GRYT-833.
#
# The layer is usually cached and an ordinary commit pays none of this. It is
# invalidated by any change to package.json or yarn.lock — including adding a
# script, which is what GRYT-823 did — and `type=cache` is what survives that,
# because layer caching by definition does not.
#
# Worth knowing if you benchmark this on a laptop and conclude it does nothing:
# fetching there is about two seconds, so there is nothing to save. The win only
# exists on the machine with the slow link, which is the machine that runs it.
#
# `sharing=locked` because the Pi builds site, docs and ui from one daemon and
# two yarns writing one cache directory is how a cache becomes the corruption it
# was meant to prevent.
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked \
    yarn install --frozen-lockfile --ignore-engines

COPY . .
RUN yarn build

FROM nginx:alpine

# Where the release notes come from.
#
# The changelog page fetches /release-notes/changelog.json from this origin and
# nginx proxies it to the reports service, which is the only thing that writes
# it. They used to be one host and a bind mount; they are two machines now, so
# this is a request rather than a file. See the location block below.
#
# The default is the public hostname, which is right for anybody who is not
# Gryt. Gryt's own build passes the reports service's address on the LAN
# instead, which is 2ms against 144ms measured from the Pi on 2026-09-02 and
# needs no DNS at all.
ARG GRYT_CHANGELOG_UPSTREAM=https://reports.gryt.chat/v1/changelog/notes

RUN printf '%s\n' \
  'events { worker_connections 1024; }' \
  'http {' \
  '  include /etc/nginx/mime.types;' \
  '  default_type application/octet-stream;' \
  '  sendfile on;' \
  '  keepalive_timeout 65;' \
  '  gzip on;' \
  '  server {' \
  '    listen 80 default_server;' \
  '    root /usr/share/nginx/html;' \
  '    index index.html;' \
  '    # Relative 301s. Without this nginx builds the Location header from its' \
  '    # own listen directive, so the redirect that adds a trailing slash came' \
  '    # back as http://gryt.chat/... on an https site.' \
  '    absolute_redirect off;' \
  '    # Serve binaries as static files (no SPA fallback).' \
  '    location ^~ /release/ { try_files $uri =404; }' \
  '    location ^~ /downloads/ { try_files $uri =404; }' \
  '    # Immutable by path, not by extension.' \
  '    #' \
  '    # Vite fingerprints everything under /assets/, so the claim is true' \
  '    # there: a changed file arrives under a new name and the old one is' \
  '    # never asked for again. /fonts/ is the same by hand — a replacement' \
  '    # face gets its own filename.' \
  '    #' \
  '    # This used to be an extension match on woff2|webp|png|svg|mp4|mp3,' \
  '    # which caught every one of those AND everything in public/ — which is' \
  '    # exactly the set of files with stable names whose contents change.' \
  '    # logo.svg moved twice in one day, og-image.png and the 33 per-page' \
  '    # share cards were regenerated, and every edge that had already fetched' \
  '    # one was told to keep it for a year. The site showed the old mark and' \
  '    # the old favicon with a correct build sitting behind it, and no way to' \
  '    # tell from the outside except a cache-busting query string.' \
  '    #' \
  '    # An extension cannot tell a fingerprinted file from an unfingerprinted' \
  '    # one. Only the path can.' \
  '    location ^~ /assets/ {' \
  '      add_header Cache-Control "public, max-age=31536000, immutable";' \
  '      try_files $uri =404;' \
  '    }' \
  '    location ^~ /fonts/ {' \
  '      add_header Cache-Control "public, max-age=31536000, immutable";' \
  '      try_files $uri =404;' \
  '    }' \
  '    # The release notes, proxied from the reports service.' \
  '    #' \
  '    # This path used to be a bind mount: reports wrote changelog.json into a' \
  '    # directory this container also mounted, and nginx served the file. That' \
  '    # worked while the two were on one box. They are not — reports is on the' \
  '    # machine with the database and this container is on the Raspberry Pi —' \
  '    # so the mount was never there and the path answered 404 for as long as' \
  '    # the split has existed. Nothing said so: the page treats a failed fetch' \
  '    # as "no notes yet" and renders the hand-written ones, which is the same' \
  '    # thing it does before the first note is published.' \
  '    #' \
  '    # Proxied rather than fetched from the page directly, so the browser only' \
  '    # ever talks to this origin and there is no CORS to keep in step across' \
  '    # two repositories.' \
  '    #' \
  '    # Through a variable, which is what makes nginx resolve the name per' \
  '    # request instead of at startup. With a literal there, a name that does' \
  '    # not resolve when the container boots is a refusal to start — the whole' \
  '    # site down because the changelog upstream was briefly unreachable. This' \
  '    # way that same failure is a 502 on one request, which the page already' \
  '    # handles.' \
  '    location = /release-notes/changelog.json {' \
  '      resolver 1.1.1.1 8.8.8.8 valid=300s ipv6=off;' \
  "      set \$upstream '${GRYT_CHANGELOG_UPSTREAM}';" \
  '      proxy_pass $upstream;' \
  '      proxy_ssl_server_name on;' \
  '      # Short, because nothing on the page waits for this and a slow answer' \
  '      # is worth less than a fast empty one.' \
  '      proxy_connect_timeout 2s;' \
  '      proxy_read_timeout 5s;' \
  '      # Pressing Publish is meant to be visible in seconds. Cloudflare fronts' \
  '      # this hostname and its dashboard cache TTL overrides what an origin' \
  '      # asks for, so anything short of no-store is a suggestion.' \
  '      #' \
  '      # Hidden and then set, rather than only set. reports sends no-store' \
  '      # too, and add_header appends, so without the hide the answer carries' \
  '      # the header twice. This block is the one that decides.' \
  '      proxy_hide_header Cache-Control;' \
  '      add_header Cache-Control "no-store" always;' \
  '    }' \
  '    # Everything else: prerendered pages, the mark, the share cards, the' \
  '    # screenshots. Ten minutes and then revalidate, which matches the deploy' \
  '    # timer, so a change is visible about as fast as it can ship. The' \
  '    # revalidation after that is a 304 against the ETag nginx already sends' \
  '    # rather than a re-download.' \
  '    #' \
  '    # Every real route is prerendered into a directory by' \
  '    # scripts/prerender-blog.mjs, so a path that does not resolve is a path' \
  '    # that does not exist. Falling back to /index.html instead meant any' \
  '    # typo answered 200 with the front page metadata: a soft 404, indexed by' \
  '    # crawlers as a duplicate of the home page.' \
  '    location / {' \
  '      add_header Cache-Control "public, max-age=600, must-revalidate";' \
  '      try_files $uri $uri/ =404;' \
  '    }' \
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
  '    # One place the Discord invite is written down.' \
  '    #' \
  '    # It used to be written into fourteen files across this repository and' \
  '    # docs, so changing it meant fourteen edits in two PRs — and every invite' \
  '    # already posted somewhere else stayed dead regardless. An invite can' \
  '    # expire or be revoked, so that was a matter of time rather than a risk.' \
  '    #' \
  '    # 302 rather than 301, deliberately. A 301 is cached by every browser' \
  '    # that has followed it, which would make the next invite change reach' \
  '    # everybody except the people who had already used the link.' \
  '    #' \
  '    # /dc is the same target rather than a redirect to /discord: a second hop' \
  '    # buys nothing and is one more thing that can be wrong.' \
  '    location = /discord { return 302 https://discord.gg/Q3JKUGsnHE; }' \
  '    location = /dc { return 302 https://discord.gg/Q3JKUGsnHE; }' \
  '    # Readable in a browser rather than downloaded. .sh is not in' \
  '    # mime.types, so without this it falls to default_type and arrives as' \
  '    # an attachment — which is the wrong default for a script whose whole' \
  '    # pitch is that you can read it before you run it.' \
  '    location = /install.sh {' \
  '      default_type text/plain;' \
  '      add_header Cache-Control "no-cache";' \
  '      try_files $uri =404;' \
  '    }' \
  '  }' \
  '  # get.gryt.chat serves one file: the CLI installer, at the root, so that' \
  '  # curl -fsSL https://get.gryt.chat | sh works with nothing after the host.' \
  '  # It is the same file the main site serves at /install.sh, shipped in the' \
  '  # same image, so the two can never drift.' \
  '  server {' \
  '    listen 80;' \
  '    server_name get.gryt.chat;' \
  '    root /usr/share/nginx/html;' \
  '    absolute_redirect off;' \
  '    location = / {' \
  '      default_type text/plain;' \
  '      add_header Cache-Control "no-cache";' \
  '      try_files /install.sh =404;' \
  '    }' \
  '    location = /install.sh {' \
  '      default_type text/plain;' \
  '      add_header Cache-Control "no-cache";' \
  '      try_files $uri =404;' \
  '    }' \
  '    location = /health { return 200 "healthy"; add_header Content-Type text/plain; }' \
  '    # Nothing else lives on this host.' \
  '    location / { return 302 https://gryt.chat$request_uri; }' \
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
