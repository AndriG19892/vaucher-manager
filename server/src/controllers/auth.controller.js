const {validationResult} = require ( 'express-validator' );
const {userModel} = require ( '../models/users.model' );
const generateToken = require ( '../utils/generateToken' );
const AppError = require ( '../Errors/AppError' );
const ErrorMessage = require ( '../Errors/ErrorMessages' );
const jwt = require ( 'jsonwebtoken' );
const config = require ( '../../config' );
const bcrypt = require ( 'bcrypt' );
const {voucherModel} = require ( '../models/voucher.model' );

/*  --------------------------------------------
Register
------------------------------------------------- */
exports.register = async ( req, res ) => {
    const errors = validationResult ( req );
    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            success: false,
            errors: [{msg: ErrorMessage.MISSING_FIELDS}],
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {name, email, password, nVoucher, valueOfVouchers} = req.body;
    let session;
    try {
        session = await userModel.startSession ();
        session.startTransaction (); // ora sì, startTransaction è chiamato
        if ( !name || !email || !password ) {
            return res.status ( 400 ).json ( {
                success: false,
                errors: [{msg: ErrorMessage.MISSING_FIELDS}],
                message: ErrorMessage.MISSING_FIELDS,
            } );
        }
        const existingUser = await userModel.findOne ( {email: email} );
        //console.log ( existingUser );
        if ( existingUser ) {
            console.log ( "utente gia registrato" );
            return res.status ( 400 ).json ( {
                success: false,
                errors: [{msg: ErrorMessage.EMAIL_ALREADY_EXISTS}],
                message: ErrorMessage.EMAIL_ALREADY_EXISTS,
            } );
        }
        //cripto la password:
        const hashedPassword = await bcrypt.hash ( password, 10 );

        //creo il nuovo utente con i dati inseriti
        const newUser = new userModel ( {
            name,
            email,
            password: hashedPassword,
        } );
        const savedUser = await newUser.save ();


        //creo sulla tabella Voucher la riga relativa all'utente appena creato
        const newVouchers = new voucherModel ( {
            value: valueOfVouchers,
            quantity: nVoucher,
            userId: savedUser._id,
        } );
        console.log ("idUtente:", savedUser._id);
        //genero il token:
        const token = await generateToken ( savedUser._id );
        console.log ("token:", token);
        //salvo il voucher:
        const savedVouchers = await newVouchers.save ();
        await session.commitTransaction ();
        console.log ( savedUser );
        return res.status ( 200 ).json ( {
            token: token,
            success: true,
            message: 'User saved successfully.',
            userData: {
                id: savedUser._id,
                email: savedUser.email,
                name: savedUser.name,
            },
            voucherData: savedVouchers,
        } );

    } catch (err) {
        if ( session && session.inTransaction () ) { // solo se c'è una transaction attiva
            await session.abortTransaction ();
        }
        return res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR, err
        } );
    } finally {
        if ( session ) session.endSession ();
    }
}

/*  --------------------------------------------
Login
------------------------------------------------- */
exports.login = async ( req, res ) => {
    console.log ( "sono in login" )
    const errors = validationResult ( req );
    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            success: false,
            errors: [{msg: ErrorMessage.VALIDATION_ERR}],
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {email, password} = req.body;
    try {
        //cerco l'utente tramite email
        const user = await userModel.findOne ( {email: email} );
        console.log ( "utente", user )
        if ( !user ) {
            return res.status ( 400 ).json ( {
                success: false,
                errors: [{msg: ErrorMessage.USER_NOT_FOUND}],
                message: ErrorMessage.USER_NOT_FOUND
            } );
        }
        //Confronto la password inserita nel db con l'hash dell'input dell'utente
        const validPass = await bcrypt.compare ( password, user.password );
        if ( !validPass ) {
            return res.status ( 400 ).json ( {
                success: false,
                errors: [{msg: ErrorMessage.INVALID_CREDENTIALS}],
                message: ErrorMessage.INVALID_CREDENTIALS
            } )
        }
        //genero il token per l'accesso:
        const token = generateToken ( user.id );

        return res.status ( 200 ).json ( {
            success: true,
            token: token,
            message: "login riuscito",
            userData: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        } )
    } catch (err) {
        res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR, err
        } )
    }

}