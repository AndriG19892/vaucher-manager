const express = require ( 'express' );
const config = require ( './config' );
const dotenv = require ( 'dotenv' ).config ();
const mongoose = require ( 'mongoose' );
const {productSchema, productModel} = require ( './src/resources/products/product.model.js' );
const {userSchema, userModel} = require ( './src/resources/users/users.model.js' );
const userRoutes = require ( './src/resources/users/users.router' );
const app = express ();

//routes
app.get ( '/', ( req, res ) => {
    console.log ( "sto avviando l'api" )
    res.send ( "ciao sono l'api" );
} )

app.use('/users',userRoutes);



app.listen ( config.port, () => {
    console.log ( "listening on port 8080" )
} );


//stringa di connessione
const mongoURI = 'mongodb://127.0.0.1:27017/voucher';

mongoose.connect ( mongoURI ).then ( () => {
    console.log ( "Sono Connesso a mongoDB" );
} ).catch ( ( err ) => {
    console.error ( "Errore di connessione", err );
} )

