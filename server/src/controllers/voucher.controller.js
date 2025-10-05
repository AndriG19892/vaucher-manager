const {validationResult} = require ( 'express-validator' );
const {voucherModel} = require ( '../models/voucher.model' );
const {userModel} = require ( '../models/users.model' );

exports.createNewVoucher = async ( req, res ) => {
    const errors = validationResult ( req );

    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            errors: errors.array (),
            message: "Errore nell'inserimento dei dati"
        } );
    }
    const {value, quantity, userId} = req.body;
    try {
        if ( !value || !quantity || !userId ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: "Attenzione, compilare correttamente tutti i campi..."
            } )
        }
    } catch (err) {
        return res.status ( 500 ).json ( {
            errors: errors.array (),
            message: "Internal server error"
        } )
    }
}