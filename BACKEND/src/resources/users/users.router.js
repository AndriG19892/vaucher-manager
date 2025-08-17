const express = require ( 'express' );
const router = express.Router ();
const jwt = require ( 'jsonwebtoken' );
const bcrypt = require ( 'bcrypt' );

const {userModel} = require ( './users.model' );


router.post ( '/register', async ( req, res ) => {
    try {
        const {name, email, password} = req.body;
        //controlli su email e password se manca uno di questi parametri, rispondere con stato 400
        if ( !name || !email || !password ) {
            return res.status ( 400 ).send ( {
                message: "attenzione, compilare correttamente tutti i campi..."
            } );
        }

        //controllo se l'email è unica all'interno del db

        // findOne restituisce un oggetto. lean() mi permette che la risposta sia  un oggetto
        const userDb = await userModel.findOne ( {email} ).lean ()
        if ( userDb ) {
            return res.status ( 400 ).json ( {
                message: "L'utente con questa email è già presente"
            } )
        }

        //cripto la password da salvare
        const salt = await bcrypt.genSalt ( 10 );
        const hashedPassword = await bcrypt.hash ( password, salt );

        //creo l'oggetto del nuovo uotente
        const newUser = new userModel ( {
            name, //mi prende in automatico il valore del name sulla chiamata dal frontend
            email,
            password: hashedPassword,
        } )
        //salvo il unovo utente
        await newUser.save ();
        res.send ( { // res.send manda in automatico il codice 200
            message: "utente registrato con successo",
        } )
    } catch (err) {
        console.log ( err );
        res.status ( 500 ).json ( err );
    }
} )

module.exports = router