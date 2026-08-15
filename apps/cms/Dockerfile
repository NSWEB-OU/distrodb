# pnpm workspace monorepo image - build with context at the repo root:
#   docker build -f apps/cms/Dockerfile .
# Kept as a full (non-standalone) install so seed scripts (tsx + src/*.ts)
# can run inside the built image via e.g. `docker compose run --rm cms pnpm run seed`.
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @distrodb/cms build
# Drop devDependencies now that the build is done, keeping tsx/dotenv/etc.
# (moved to "dependencies") for the seed scripts. CI=true skips the
# interactive confirmation pnpm shows before purging node_modules;
# --ignore-scripts skips re-running lifecycle scripts (e.g. root "prepare").
RUN CI=true pnpm install --frozen-lockfile --prod --ignore-scripts

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /repo ./
WORKDIR /repo/apps/cms

EXPOSE 3001
ENV PORT=3001

# Applies src/migrations (payload.config.ts prodMigrations) before starting -
# NODE_ENV=production skips the dev-only auto schema push, so without this the
# database never gets its tables on a fresh deploy.
CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]

