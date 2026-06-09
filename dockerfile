# Imagen base ligera
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar SOLO dependencias de producción
RUN npm install --only=production

# Copiar el código fuente
COPY src/ ./src/

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/server.js"]