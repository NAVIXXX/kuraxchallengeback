# Usar Node.js 18 como imagen base
FROM node:18-alpine AS builder


WORKDIR /usr/src/app


# Copiar archivos de dependencias
COPY package*.json ./


# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci


# Copiar código fuente
COPY . .


# Construir la aplicación
RUN npm run build


# Fase 2: Producción
FROM node:18-alpine AS production


WORKDIR /usr/src/app


# Copiar archivos de dependencias
COPY package*.json ./


# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force


# Copiar la aplicación construida desde la fase de construcción
COPY --from=builder /usr/src/app/dist ./dist


# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001


# Cambiar propiedad de archivos al usuario nestjs
USER nestjs


# Exponer puerto
EXPOSE 3000


# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
