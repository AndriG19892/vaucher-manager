# ===== Backend Dockerfile =====
FROM node:18

# Cartella di lavoro nel container
WORKDIR /app

# Copia solo i file necessari per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze dentro il container
RUN npm install

# Copia tutto il codice dell'app
COPY . .

# Espone la porta del backend
EXPOSE 5000

# Comando di avvio
CMD ["npx", "nodemon", "server.js"]
