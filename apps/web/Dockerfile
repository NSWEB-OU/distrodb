# pnpm workspace monorepo image - build with context at the repo root:
#   docker build -f apps/web/Dockerfile .
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
# CMS_URL must point at a reachable CMS during build - the web app fetches
# distro/roadmap data at build time for static generation.
ARG CMS_URL
ENV CMS_URL=${CMS_URL}
RUN pnpm --filter @distrodb/web build


FROM node:22-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /repo/apps/web/public ./apps/web/public
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by `next build` from the standalone output.
CMD ["node", "apps/web/server.js"]
