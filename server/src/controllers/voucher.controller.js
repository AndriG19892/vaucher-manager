const {validationResult} = require ( 'express-validator' );
const {voucherModel} = require ( '../models/voucher.model' );
const ErrorMessage = require ( '../Errors/ErrorMessages' );
const Message = require ( '../Messages/Messages' );

exports.createNewVoucher = async ( req, res ) => {
    const errors = validationResult ( req );

    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            errors: errors.array (),
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {value, quantity, userId} = req.body;
    try {
        if ( !value || !quantity || !userId ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: ErrorMessage.MISSING_FIELDS,
            } )
        }
    } catch (err) {
        return res.status ( 500 ).json ( {
            errors: errors.array (),
            message: ErrorMessage.SERVER_ERROR,
        } )
    }
}
exports.getVouchersByUserId = async ( req, res ) => {
    const {userId} = req.params;
    if ( !userId ) {
        return res.status ( 400 ).json ( {
            success: false,
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    try {
        const vouchers = await voucherModel.find ( {userId} );

        if ( !vouchers ) {
            return res.status ( 400 ).json ( {
                success: false,
                message: ErrorMessage.VOUCHER_NOT_FOUND
            } )
        }
        return res.status ( 200 ).json ( {
            success: true,
            vouchers,
        } );
    } catch (err) {
        return res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR,
        } )
    }
}
exports.updateVoucher = async ( req, res ) => {
    console.log ( "sono in updateVoucher" )
    const errors = validationResult ( req );
    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            errors: errors.array (),
            message: ErrorMessage.VALIDATION_ERR,
        } )
    }
//68e1949c5f38bf2a49152634
    const {value, quantity, userId} = req.body;
    try {
        if ( !value || !quantity || !userId ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: ErrorMessage.MISSING_FIELDS,
            } );
        }
        const updatedVoucher = await voucherModel.findOneAndUpdate (
            {userId},
            {value, quantity},
            {new: true, runValidators: true},
        );
        console.log (updatedVoucher);
        if ( !updatedVoucher ) {
            return res.status ( 400 ).json ( {
                errors: errors.array (),
                message: ErrorMessage.VOUCHER_NOT_FOUND,
            } )
        }
        res.status ( 200 ).json ( {
            message: Message.VOUCER_UPDATED_SUCCESS,
            voucher: updatedVoucher,
        } );
    } catch (err) {
        console.log ( err );
        return res.status ( 500 ).json ( {
            message: ErrorMessage.SERVER_ERROR,
            errors: err.message,
        } )
    }
}
