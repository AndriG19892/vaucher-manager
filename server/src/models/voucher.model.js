const mongoose = require ( 'mongoose' );
const uuid = require ( 'uuid' );

const voucherSchema = new mongoose.Schema ( {
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid.v7 ()
    },
    value: {
        type: Number,
        required: true,
        default: 5.29,
    },
    quantity: {
        type:Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
} );

const voucherModel = mongoose.model( 'Vouchers', voucherSchema, 'Voucher' );

module.exports = {
    voucherSchema,
    voucherModel
}