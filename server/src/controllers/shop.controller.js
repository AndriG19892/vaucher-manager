const mongoose = require ( 'mongoose' );
const {validationResult} = require ( 'express-validator' );
const {userModel} = require ( '../models/users.model' );
const ErroreMessage = require ( '../Errors/ErrorMessages' );
const {shopModel} = require ( '../models/shop.model' );
const ErrorMessage = require ( "../Errors/ErrorMessages" );
const Message = require ( '../Messages/Messages' );
const {voucherModel} = require ( "../models/voucher.model" );

/*  --------------------------------------------
Create shop
------------------------------------------------- */

exports.createShopList = async ( req, res ) => {
    const errors = validationResult ( req.body );
    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            success: false,
            errors: errors.array (),
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {userId, prodotti, categoria, buoniUtilizzati, totale} = req.body;
    if ( !userId || !prodotti ) {
        return res.status ( 400 ).json ( {
            success: false,
            message: ErrorMessage.MISSING_FIELDS,
        } );
    }

    try {

        // 🔹 Trova i buoni dell'utente
        const voucher = await voucherModel.findOne ( {userId} );

        if ( !voucher ) {
            throw new Error ( "Nessun voucher trovato per l'utente." );
        }

        // 🔹 Controlla che i buoni disponibili siano sufficienti
        if ( voucher.quantity < buoniUtilizzati ) {
            console.log ("voucher disponibili:", voucher.quantity);
            throw new Error ( "Buoni insufficienti per completare la spesa." );
        }

        // 🔹 Decrementa i buoni
        voucher.quantity -= buoniUtilizzati;
        await voucher.save ();
        console.log ( "aggiornati voucher", voucher );

        const shopList = await shopModel.create ( {
            userId,
            prodotti,
            categoria,
            buoniUtilizzati,
            totale,
            data: Date.now (),
        } );
        res.status ( 200 ).json ( {
            success: true,
            message: Message.SHOP_LIST_CREATE_SUCCESS,
            shopList: shopList[0],
        } );
    } catch (err) {
        console.log ( "Errore nel salvataggio della spesa", err );
        return res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR,
        } );
    }
}
exports.getUserShopLists = async ( req, res ) => {
    try {
        const {userId} = req.params;
        if ( !userId ) {
            return res.status ( 400 ).json ( {
                success: false,
                message: ErrorMessage.USER_NOT_FOUND,
            } );
        }
        const shopList = await shopModel.find ( {userId} ).sort ( {data: -1} );
        if ( !shopList || shopList.length === 0 ) {
            return res.status ( 400 ).json ( {
                success: false,
                message: ErrorMessage.SHOP_LIST_NOT_FOUND,
            } );
        }
        return res.status ( 200 ).json ( {
            success: true,
            shopList,
        } );
    } catch (err) {
        return res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR, err
        } )
    }
}

