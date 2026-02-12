const express = require ( 'express' );
const router = express.Router ();
const {body} = require ( 'express-validator' );
const rateLimit = require ( 'express-rate-limit' );
const authController = require ( '../controllers/auth.controller' );

//regole di validazione per la registrazione:

const registerValidation = [
    body ( 'email' ).isEmail ().withMessage ( 'Inserire un indirizzo email valido' ).normalizeEmail (),
    body ( 'password' ).isLength ( {min: 8} ).withMessage ( 'la password deve avere almeno 8 caratteri' ),
    body ( 'name' ).not ().isEmpty ().trim ().withMessage ( 'Il nome è obbligatorio' ),
    body ( 'nVoucher' ).isInt ( {min: 1} ).withMessage ( 'Il numero di voucher deve essere almeno 1' ),
    body ( 'valueOfVouchers' ).isFloat ( {min: 0.1} ).withMessage ( 'Il valore del voucher deve essere maggiore di 0' )
];

//regole di validazione per il login:
const loginValidation = [
    body ( 'email' ).isEmail ().withMessage ( 'Email non valida' ).normalizeEmail (),
    body ( 'password' ).not ().isEmpty ().withMessage ( 'la password è richiesta' )
];

const authLimiter = rateLimit ( {
    windowMs: 15 * 60 * 1000, //15 minuti
    max: 10, //Limita ogni IP a 10 tentativi di login/registrazione per finestra
    message: {success: false, message: "Troppi tentativi, riprovare tra 15 minuti"}
} );
//rotte con middleware
router.post ( '/register', registerValidation, authController.register );
router.post ( '/login', authLimiter, loginValidation, authController.login );


module.exports = router;