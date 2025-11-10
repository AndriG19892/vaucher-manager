# ===== Frontend Dockerfile =====
FROM node:18 AS build

WORKDIR /app

# Copia solo i file necessari all'installazione
COPY package*.json ./
RUN npm install

# Copia tutto il codice frontend (escludendo la cartella server)
COPY . .

# Costruisce l'app React
RUN npm run build

# ===== Serve con Nginx =====
FROM nginx:alpine

# Copia i file buildati nel path di nginx
COPY --from=build /app/build /usr/share/nginx/html

# Espone la porta (Render usa sempre 10000 internamente)
EXPOSE 10000

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
