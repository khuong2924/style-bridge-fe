FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p public

# RUN echo "window.API_URL=''; window.IDENTITY_API_PATH=''; window.DOMAIN2_API_PATH=''; window.KITCHEN_API_PATH='';" > public/env-config.js
RUN npm run build

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN apk add --no-cache gettext-libs
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]