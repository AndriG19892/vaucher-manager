const mongoose = require ( 'mongoose' );
const uuid = require ( 'uuid' );


const shopSchema = new mongoose.Schema ( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    prodotti: [
        {
            descrizione: {type: String, required: true},
            importo: {type: Number, required: true},
            quantita: {type: Number, required: true},
        }
    ],

    buoniUtilizzati:{type:Number, required: true},
    data: {
        type: Date,
        default: Date.now,
    },
    categoria: {
        type: String,
        default: 'Generale'
    }
} );

const shopModel = mongoose.model('Shop', shopSchema);
module.exports = { shopModel };