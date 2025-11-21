# Install dependencies only when needed
FROM node:20.12.2 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN  yarn install

# Rebuild the source code only when needed
FROM node:20.12.2 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:20.12.2 AS runner
WORKDIR /app
ENV NODE_ENV=production 
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
RUN touch /app/.env

#Non root user
RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -m -s /bin/bash nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000

CMD [ "yarn", "start:prod" ]
