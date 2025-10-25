const {validationResult} = require ( 'express-validator' );
const {userModel} = require('../models/users.model');
const {voucherModel} = require('../models/voucher.model');
const AppError = require('../Errors/AppError');
const ErrorMessage = require ( '../Errors/ErrorMessages' );
const config = require ( '../../config' );


/*------------------------------------------------------
* Get user info
* -----------------------------------------------------*/

exports.getUserInfo = async( req, res) => {
    console.log ("sono dentro al user info")
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select("-password");
        const vouchers = await voucherModel.find({userId:userId});

        const totalValue = await vouchers.reduce((sum, v) => sum + v.valueOfVaucher, 0);
        res.json({
            user,
            vouchers,
            totalValue,
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}