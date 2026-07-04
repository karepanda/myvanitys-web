# Dockerfile for React Frontend with Vite
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --production=false
COPY . .

ARG VITE_API_URL
ARG VITE_REDIRECT_URI
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_REDIRECT_URI=$VITE_REDIRECT_URI
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=80

RUN apk add --no-cache gettext

CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
