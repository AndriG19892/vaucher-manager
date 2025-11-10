# ===== Backend Dockerfile =====
FROM node:18

WORKDIR /app

# Copia e installa dipendenze
COPY package*.json ./
RUN npm install --production

# Copia tutto il codice
COPY . .

# Render assegna dinamicamente la porta tramite variabile d'ambiente
ENV PORT=10000

# Espone la porta del backend
EXPOSE 10000

# Avvia l'app (usa node, non nodemon)
CMD ["node", "server.js"]
