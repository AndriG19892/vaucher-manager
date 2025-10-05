FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# copia tutto tranne node_modules (che montiamo con volume)
COPY . .

EXPOSE 3000

CMD ["npm", "start"]