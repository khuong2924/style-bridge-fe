FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p public

RUN echo "window.API_URL=''; window.IDENTITY_API_PATH=''; window.DOMAIN2_API_PATH=''; window.KITCHEN_API_PATH='';" > public/env-config.js
RUN npm run build

FROM nginx:stable-alpine as production-stage
# Install required packages
RUN apk add --no-cache gettext

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create entrypoint script directly 
RUN { \
    echo '#!/bin/sh'; \
    echo ''; \
    echo 'cat > /usr/share/nginx/html/env-config.js <<EOF'; \
    echo 'window.API_URL="$API_URL";'; \
    echo 'window.IDENTITY_API_PATH="$IDENTITY_API_PATH";'; \
    echo 'window.DOMAIN2_API_PATH="$DOMAIN2_API_PATH";'; \
    echo 'window.KITCHEN_API_PATH="$KITCHEN_API_PATH";'; \
    echo 'console.log("Environment loaded from server:", {'; \
    echo '  API_URL: window.API_URL,'; \
    echo '  IDENTITY_API_PATH: window.IDENTITY_API_PATH,'; \
    echo '  DOMAIN2_API_PATH: window.DOMAIN2_API_PATH,'; \
    echo '  KITCHEN_API_PATH: window.KITCHEN_API_PATH'; \
    echo '});'; \
    echo 'EOF'; \
    echo ''; \
    echo 'exec nginx -g "daemon off;"'; \
    } > /entrypoint.sh && \
    chmod +x /entrypoint.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]