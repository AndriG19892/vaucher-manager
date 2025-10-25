const {validationResult} = require ( 'express-validator' );
const {userModel} = require ( '../models/users.model' );
const ErroreMessage = require ( '../Errors/ErrorMessages' );
const {shopModel} = require ( '../models/shop.model' );
const ErrorMessage = require ( "../Errors/ErrorMessages" );
const Message = require ( '../Messages/Messages' );

/*  --------------------------------------------
Create shop
------------------------------------------------- */

exports.createShopList = async ( req, res ) => {
    const errors = validationResult ( req );
    if ( !errors.isEmpty () ) {
        return res.status ( 400 ).json ( {
            success: false,
            errors: errors.array (),
            message: ErrorMessage.VALIDATION_ERR,
        } );
    }
    const {userId, prodotti, data, categoria,buoniUtilizzati} = req.body;
    try {
        if ( !prodotti || !Array.isArray ( prodotti ) || prodotti.length === 0 || !categoria ) {
            return res.status ( 400 ).json ( {
                success: false,
                errors: [{msg: ErrorMessage.MISSING_FIELDS}]
            } );
        }
        const newShopList = await new shopModel ( {
            userId,
            prodotti,
            data: Date.now (),
            categoria,
            buoniUtilizzati,
        } ).save ();
        return res.status ( 201 ).json ( {
            success: true,
            message: Message.SHOP_LIST_CREATE_SUCCESS,
            shopList: newShopList,
        } );
    } catch (err) {
        return res.status ( 500 ).json ( {
            success: false,
            message: ErrorMessage.SERVER_ERROR, err
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
