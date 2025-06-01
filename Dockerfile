# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl bash
WORKDIR /app

# Install dependencies using the appropriate package manager
COPY package.json bun.lock* bun.lockb* package-lock.json* .npmrc* ./
RUN if [ -f bun.lock ] || [ -f bun.lockb ]; then \
  curl -fsSL https://bun.sh/install | bash && \
  export PATH="$HOME/.bun/bin:$PATH" && \
  bun install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
  npm ci; \
  else \
  npm install; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Set build-time environment variables to prevent build failures
# These are placeholder values that will be overridden at runtime
ENV DATABASE_URL="postgres://build-placeholder:build-placeholder@build-placeholder:5432/build-placeholder"
ENV BETTER_AUTH_SECRET="build-time-placeholder-secret-do-not-use-in-production"

# Compile migration script to JavaScript
RUN npx tsc --project scripts/tsconfig.json

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install production dependencies
COPY package.json ./
RUN npm install --production drizzle-orm pg

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy only essential files for migrations
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/dist/scripts/migrate.js ./scripts/migrate.js
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.sh ./scripts/docker-entrypoint.sh

RUN chmod +x ./scripts/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV PORT=3000 \
  HOSTNAME="0.0.0.0"

# Use our custom entrypoint script that handles database initialization
ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["node", "server.js"]