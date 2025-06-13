# Dockerfile para React Frontend con Vite
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --production=false

# Copiar código fuente
COPY . .

# Variables de entorno para Vite (VITE_ prefix)
ENV VITE_API_URL=http://localhost:5173/api/v1
ENV VITE_REDIRECT_URI=http://localhost:5173/callback
ENV VITE_GOOGLE_CLIENT_ID=780556869332-1sf3nmlm6df03r73jnh8a5kll8ev3ifo.apps.googleusercontent.com

# Debug: verificar las variables
RUN echo "Building with VITE_GOOGLE_CLIENT_ID: $VITE_GOOGLE_CLIENT_ID"
RUN echo "Building with VITE_API_URL: $VITE_API_URL"
RUN echo "Building with VITE_REDIRECT_URI: $VITE_REDIRECT_URI"

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos (Vite usa 'dist' por defecto)
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]