const {validationResult} = require ( 'express-validator' );
const {userModel} = require ( '../models/users.model' );
const AppError = require ( '../errors/AppError' );
const ErrorMessage = require ( '../errors/ErrorMessages' );
const jwt = require ( 'jsonwebtoken' );
const config = require ( '../../config' );
const bcrypt = require ( 'bcrypt' );
const {vaucherModel} = require ( '../models/voucher.model' );


exports.register = async ( req, res ) => {
    console.log ( "sono in registrazione" )
    const error = validationResult ( req );
    if ( !error.isEmpty () ) {
        return res.status ( 400 ).json ( {
            errors: errors.array (),
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {name, email, password} = req.body;
    try {
        if ( !name || !email || !password ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: ErrorMessage.MISSING_FIELDS,
            } );
        }
        const existingUser = await userModel.findOne ( {email: email} );
        console.log (existingUser);
        if ( existingUser ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
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
        return res.status ( 200 ).json ( {
            message: 'User saved successfully.',
            user: savedUser,
        } )
    } catch (err) {
        return res.status ( 500 ).json ( {
            message: ErrorMessage.SERVER_ERROR, err
        } );
    }
}

exports.login = async ( req, res ) => {
    console.log ("sono in login")
    const error = validationResult ( req );
    if ( !error.isEmpty () ) {
        return res.status ( 400 ).json ( {
            errors: errors.array (),
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {email, password} = req.body;
    try {
        //cerco l'utente tramite email
        const user = await userModel.findOne ( {email: email} );
        console.log ("utente", user)
        if ( !user ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: ErrorMessage.USER_NOT_FOUND
            } );
        }
        //Confronto la password inserita nel db con l'hash dell'input dell'utente
        const validPass = await bcrypt.compare ( password, user.password );
        if ( !validPass ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: ErrorMessage.INVALID_CREDENTIALS
            } )
        }
        //genero il token per l'accesso:
        const token = jwt.sign ( {id: user.id}, config.jwtSecret, {expiresIn: '1h'} );
        return res.status ( 200 ).json ( {
            token: token,
            message: "login riuscito",
            userData: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        } )
    } catch (err) {
        res.status ( 500 ).json ( {
            message: ErrorMessage.SERVER_ERROR, err
        } )
    }

}