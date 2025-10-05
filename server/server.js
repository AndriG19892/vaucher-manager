const dotenv = require ( 'dotenv' ).config ( {path: './.env'} );
const cors = require ( 'cors' );
const express = require ( 'express' );
const config = require ( './config' );
const mongoose = require ( 'mongoose' );
const {productSchema, productModel} = require ( './src/models/product.model.js' );
const {userSchema, userModel} = require ( './src/models/users.model.js' );
const {voucherSchema, voucherModel} = require ( './src/models/voucher.model.js' );
const authRouter = require ( './src/routes/auth.router' );
const userRouter = require ( './src/routes/users.router' );
const app = express ();

app.use ( express.json () );
app.use ( cors ( {
    origin: '*',  // Consente tutte le origini (puoi restringerlo a un'origine specifica in produzione)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
} ) );

//routes
app.get ( '/', ( req, res ) => {
    console.log ( "sto avviando l'api" )
    res.send ( "ciao sono l'api" );
} )

app.use ( '/api/auth', authRouter );
app.use ( '/api/users', userRouter );


app.listen ( config.port, () => {
    console.log ( `listening on port ${config.port}` );
} );


//stringa di connessione
const mongoURI = config.connectionString;
console.log ( "mongoURI", mongoURI );

mongoose.connect ( mongoURI ).then ( () => {
    console.log ( "Sono Connesso a mongoDB" );
} ).catch ( ( err ) => {
    console.error ( "Errore di connessione", err );
} )

