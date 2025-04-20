FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
  && npm i -g pm2
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js ./
CMD ["pm2-runtime", "start", "ecosystem.config.js"]