# ===== Frontend Dockerfile =====
FROM node:18 AS build

WORKDIR /app

# Copia solo i file necessari all'installazione
COPY package*.json ./
RUN npm install

# Copia tutto il codice frontend (escludendo la cartella server)
COPY . .

# Passaggio delle variabili d'ambiente per React
ARG REACT_APP_AUTH_API_URL
ARG REACT_APP_USER_API_URL
ARG REACT_APP_VOUCHER_API_URL
ARG REACT_APP_SHOP_API_URL

ENV REACT_APP_AUTH_API_URL=$REACT_APP_AUTH_API_URL
ENV REACT_APP_USER_API_URL=$REACT_APP_USER_API_URL
ENV REACT_APP_VOUCHER_API_URL=$REACT_APP_VOUCHER_API_URL
ENV REACT_APP_SHOP_API_URL=$REACT_APP_SHOP_API_URL

# Costruisce l'app React
RUN npm run build

# ===== Serve con Nginx =====
FROM nginx:alpine

# Copia la build React
COPY --from=build /app/build /usr/share/nginx/html

# Copia la configurazione Nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Espone la porta (Render usa sempre 10000 internamente)
EXPOSE 10000

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
