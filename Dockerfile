FROM node:18 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_APP_BASE_URL=/
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

RUN npm run build

FROM httpd:2.4 as production-stage

COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
RUN mkdir -p /usr/local/apache2/conf/ssl/

EXPOSE 80
EXPOSE 443