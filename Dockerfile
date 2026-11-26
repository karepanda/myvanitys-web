# Dockerfile for React Frontend with Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --production=false
COPY . .

ARG VITE_API_URL
ARG VITE_REDIRECT_URI
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GA_MEASUREMENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_REDIRECT_URI=$VITE_REDIRECT_URI
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID

RUN npm run build

FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY security-headers.conf.template /etc/nginx/security-headers.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=80
# CSP is staged in report-only mode by default; set CSP_REPORT_ONLY=false to enforce.
ENV CSP_REPORT_ONLY=true
# Extra space-separated connect-src origins (e.g. the API origin) for the CSP.
ENV CSP_CONNECT_SRC=""
# Optional report-uri for collecting CSP violations during the report-only phase.
ENV CSP_REPORT_URI=""

RUN apk add --no-cache gettext && chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
