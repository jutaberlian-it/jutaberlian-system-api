# Depedency
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy tsc output
COPY --from=builder /app/dist ./dist
COPY swagger.yaml ./

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

USER nextjs
EXPOSE 8000
CMD ["node", "dist/server.js"]