const uuid = require ( 'uuid' );
const mongoose = require ( 'mongoose' );

const usersSchema = new mongoose.Schema ( {
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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
} );

const userModel = mongoose.model( 'Users', usersSchema, 'User' );

module.exports = {
    userModel,
    usersSchema
};