const uuid = require ( 'uuid' );
const mongoose = require ( 'mongoose' );

const cartSchema = new mongoose.Schema ( {
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid.v7 ()
    },
    products:{
        type:[String],
    },
    date:{
        type:Date,
    }

} )