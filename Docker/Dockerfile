# Base image for Node.js
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files from the root directory
COPY . .

# Build the application
RUN npm run build

# Use Nginx to serve the app
FROM nginx:alpine

# Copy built assets from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file from the Docker folder
COPY Docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
