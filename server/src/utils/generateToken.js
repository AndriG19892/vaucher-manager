const jwt = require ( 'jsonwebtoken' );
const config = require ( '../../config' );


const generateToken = async ( userId ) => {
    return jwt.sign ( {id: userId}, config.jwtSecret, {expiresIn: '3h'} );
};
module.exports = generateToken;