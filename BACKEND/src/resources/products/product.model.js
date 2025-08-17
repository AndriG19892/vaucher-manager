const mongoose = require ( 'mongoose' );
const uuid = require ( 'uuid' );

const productSchema = new mongoose.Schema ( {
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid.v7 ()
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
} )

const productModel = mongoose.model ( 'Product', productSchema, 'Products' );

module.exports = {
    productModel,
    productSchema
};