FROM node:22.17.0-alpine AS base

# Instala dependências do sistema necessárias
RUN apk add --no-cache dumb-init postgresql-client

# Cria um usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressapp -u 1001

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Copia o script de entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Stage para desenvolvimento
FROM base AS development
ENV NODE_ENV=development
RUN npm ci --include=dev
COPY . .
RUN chown -R expressapp:nodejs /app
USER expressapp
EXPOSE 3333
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dumb-init", "npm", "run", "dev"]

# Stage para build
FROM base AS build
ENV NODE_ENV=production
RUN npm ci --include=dev
COPY . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force

# Stage final para produção
FROM base AS production
ENV NODE_ENV=production

# Copia apenas os arquivos necessários
COPY --from=build --chown=expressapp:nodejs /app/dist ./dist
COPY --from=build --chown=expressapp:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=expressapp:nodejs /app/package*.json ./

# Muda para usuário não-root
USER expressapp

# Expõe a porta da aplicação
EXPOSE 3333

# Comando para executar a aplicação
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dumb-init", "node", "dist/app.js"]