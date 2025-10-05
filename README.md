# Voucher App 🧾

Applicazione **full-stack** sviluppata con **React**, **Node.js** e
**MongoDB**, containerizzata con **Docker** per la gestione di buoni pasto.
permette di tenere sottocontrollo i tuoi buoni pasto lavorativi, modificarne la quantità e il valore e durante
la spesa permette a seconda della che si effettua e a seconda del valora del buono pasto, di calcolare quanti buoni pasto
stai utilizzando, quanto ti resta da pagare in contanti e quanto ti serve di valore di spesa per poter utilizzare il prossimo buono.

## 🚀 Avvio del progetto

### 1. Clona il repository

``` bash
git clone https://github.com/AndriG19892/vaucher-manager.git
cd vaucher-app
```

### 2. Avvia i container

``` bash
docker compose up --build
```

> Questo comando costruisce e avvia sia il **frontend React** che il
> **backend Node.js** (e MongoDB se incluso).

L'app sarà accessibile agli indirizzi: 
- **Frontend:** http://localhost:3000\
- **Backend:** http://localhost:5000


API Disponibili:

**Registrazione nuovo Utente:** http://localhost:5000/api/auth/register

**Login Utente:** http://localhost:5000/api/auth/login

------------------------------------------------------------------------

## ⚙️ Struttura del progetto

    📦 voucher-app
     ┣ 📂 src           → App React (porta 3000)
     ┣ 📂 server        → Server Node.js (porta 5000)
     ┣ 📜 docker-compose.yml
     ┣ 📜 Dockerfile (per React dev)
     ┣ 📜 README.md
     ┗ 📜 .gitignore

------------------------------------------------------------------------

⚙️ File .env

## Crea un file .env (non incluso nel repository) dentro alla cartella server :

## /server/.env
**CONNECTION_STRING_DB**=mongodb://mongo:27017/voucher

**JWT_SECRET**=qualcosa-di-segreto


## 🧑‍💻 Comandi utili

### Arrestare i container

``` bash
docker compose down
```

### Ricostruire tutto da zero

``` bash
docker compose build --no-cache
docker compose up
```

### Aprire una shell nel container backend

``` bash
docker exec -it backend sh
```

------------------------------------------------------------------------

## 🔒 File ignorati da Git

I seguenti file non vengono tracciati da Git per sicurezza e pulizia:

    /node_modules
    /build
    *.env
    .DS_Store
    npm-debug.log*

------------------------------------------------------------------------

## 🧰 Stack Tecnologico

-   **Frontend:** React + Vite/CRA
-   **Backend:** Node.js + Express
-   **Database:** MongoDB
-   **Container:** Docker + Docker Compose

------------------------------------------------------------------------

## 📝 Note

-   Il progetto è configurato per lo sviluppo locale (hot-reload
    attivo).\
-   In produzione, sarà necessario creare un Dockerfile ottimizzato con
    Nginx per il frontend.
