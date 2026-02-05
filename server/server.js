const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Consigliato per la sicurezza HTTP
const mongoose = require('mongoose');
const config = require('./config');

// Import Routers
const authRouter = require('./src/routes/auth.router');
const userRouter = require('./src/routes/users.router');
const vouchersRouter = require('./src/routes/vouchers.router');
const shopRouter = require('./src/routes/shop.router');

const app = express();

// --- MIDDLEWARE ---
app.use(helmet()); // Aggiunge header di sicurezza
app.use(express.json());

// Configurazione CORS dinamica
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? config.allowedOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// --- ROUTES ---
app.get('/', (req, res) => {
    res.status(200).json({ message: "API is running", version: "1.0.0" });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/vouchers', vouchersRouter);
app.use('/api/shop', shopRouter);

// --- GESTIONE ERRORI GLOBALE ---
// Questo cattura tutti gli errori passati con next(err)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Errore interno del server",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- BOOTSTRAP DEL SERVER ---
const startServer = async () => {
    try {
        // Connettiamo prima il database
        await mongoose.connect(config.connectionString);
        console.log("✅ Connesso a MongoDB con successo");

        app.listen(config.port, () => {
            console.log(`🚀 Server in ascolto sulla porta ${config.port}`);
        });
    } catch (err) {
        console.error("❌ Impossibile avviare il server:", err.message);
        process.exit(1); // Chiude il processo in caso di errore critico
    }
};

startServer();
