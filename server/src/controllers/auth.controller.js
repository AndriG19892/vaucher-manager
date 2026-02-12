const {validationResult} = require ( 'express-validator' );
const {userModel} = require ( '../models/users.model' );
const {voucherModel} = require ( '../models/voucher.model' );
const generateToken = require ( '../utils/generateToken' );
const ErrorMessage = require ( '../Errors/ErrorMessages' );
const bcrypt = require ( 'bcrypt' );
const mongoose = require ( 'mongoose' );
const jwt = require ( 'jsonwebtoken' );
const config = require ( '../../config' );


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
    const session = await mongoose.startSession ();
    try {
        session.startTransaction (); // ora sì, startTransaction è chiamato
        const existingUser = await userModel.findOne ( {email: email} ).session ( session );
        if ( existingUser ) {
            await session.abortTransaction ();
            return res.status ( 400 ).json ( {
                success: false,
                errors: [{msg: ErrorMessage.EMAIL_ALREADY_EXISTS}],
                message: ErrorMessage.EMAIL_ALREADY_EXISTS,
            } );
        }

        //creo il nuovo utente con i dati inseriti
        const [newUser] = await userModel.create ( [{
            name,
            email,
            password,
        }], {session} );


        //creo sulla tabella Voucher la riga relativa all'utente appena creato
        const newVouchers = await voucherModel.create ( [{
            value: valueOfVouchers,
            quantity: nVoucher,
            userId: newUser._id,
        }], [session] );
        //genero il token:
        const token = await generateToken ( newUser._id );

        await session.commitTransaction ();
        return res.status ( 201 ).json ( {
            success: true,
            token,
            userData: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
            },
            voucherData: newVouchers,
        } );

    } catch (err) {
        if ( session.inTransaction () ) await session.abortTransaction ();
        console.error ( "Errore registrazione:", err );
        return res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR, err
        } );
    } finally {
        await session.endSession ();
    }
}

/*  --------------------------------------------
Login
------------------------------------------------- */
exports.login = async ( req, res ) => {
    const {email, password} = req.body;
    try {
        //cerco l'utente tramite email
        const user = await userModel.findOne ( {email: email} ).select ( '+password' );
        if ( !user || !(await bcrypt.compare ( password, user.password )) ) {
            return res.status ( 401 ).json ( {
                success: false,
                message: ErrorMessage.INVALID_CREDENTIALS
            } );
        }
        //genero il token per l'accesso:
        const token = generateToken ( user._id );

        return res.status ( 200 ).json ( {
            success: true,
            token: token,
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
