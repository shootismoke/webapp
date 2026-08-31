# syntax=docker/dockerfile:1

# Keep in sync with .nvmrc and package.json's `engines`.
ARG NODE_VERSION=22-alpine

# ---------------------------------------------------------------- dependencies
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Cypress' binary is only needed for e2e, which does not run in the image.
ENV CYPRESS_INSTALL_BINARY=0
RUN npm ci

# ---------------------------------------------------------------------- build
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so they
# have to be present here rather than at run time. They are public by
# definition -- they ship to every browser -- but it does mean the resulting
# image embeds them, so treat the image as no more secret than the site itself.
ARG NEXT_PUBLIC_AQICN_TOKEN
ARG NEXT_PUBLIC_GEOAPIFY_API_KEY
ARG NEXT_PUBLIC_OPENAQ_API_KEY
ARG NEXT_PUBLIC_SENTRY_API_KEY
ARG NEXT_PUBLIC_AMPLITUDE_API_KEY
ENV NEXT_PUBLIC_AQICN_TOKEN=$NEXT_PUBLIC_AQICN_TOKEN \
    NEXT_PUBLIC_GEOAPIFY_API_KEY=$NEXT_PUBLIC_GEOAPIFY_API_KEY \
    NEXT_PUBLIC_OPENAQ_API_KEY=$NEXT_PUBLIC_OPENAQ_API_KEY \
    NEXT_PUBLIC_SENTRY_API_KEY=$NEXT_PUBLIC_SENTRY_API_KEY \
    NEXT_PUBLIC_AMPLITUDE_API_KEY=$NEXT_PUBLIC_AMPLITUDE_API_KEY \
    NEXT_TELEMETRY_DISABLED=1

# Prerenders every city page, so this step needs network access to reach the
# upstream city list.
RUN npm run build

# --------------------------------------------------------------------- runner
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: 'standalone'` emits a server plus only the node_modules it needs;
# static assets and public/ are not included and must be copied alongside.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# ISR writes regenerated pages here. compose mounts a volume over it so the
# cache survives restarts.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
