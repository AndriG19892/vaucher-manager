const uuid = require ( 'uuid' );
const mongoose = require ( 'mongoose' );
const bcrypt = require ( 'bcrypt' );

const usersSchema = new mongoose.Schema ( {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {
        type: String,
        required: true,
        select: false
    },
}, {timestamps: true} );


//Middleware pre-save
usersSchema.pre ( 'save', async function ( next ) {
    //criptiamo la password solo se è sata modificata (o è nuova)
    if ( !this.isModified ( 'password' ) ) return next ();
    try {
        const salt = await bcrypt.genSalt ( 10 );
        this.password = await bcrypt.hash ( this.password, salt );
        next ();
    } catch (err) {
        next ( err );
    }
} );
const userModel = mongoose.model ( 'Users', usersSchema, 'User' );

module.exports = {userModel};