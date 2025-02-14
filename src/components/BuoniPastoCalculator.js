import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {FaShoppingCart} from "react-icons/fa";
import {MdAddShoppingCart} from "react-icons/md";
import {IoTrash} from "react-icons/io5";


const BuoniPastoCalculator = () => {
    const [spesa, setSpesa] = useState ( [] );
    const [valoreBuono, setValoreBuono] = useState ( 0 );
    const [descrizione, setDescrizione] = useState ( '' );
    const [prezzo, setPrezzo] = useState ( '' );
    const [quantita, setQuantita] = useState ( 1 );
    const [errore, setErrore] = useState ( false );

    /*  -----------------------------------------------------------------------------------------------
      checking input
    --------------------------------------------------------------------------------------------------- */
    const checkInput = () => {
        //console.log(valoreBuono, descrizione, prezzo);
        if ( valoreBuono === 0 || descrizione === '' || prezzo === 0 ) {
            setErrore ( true );
            return false
        } else {
            setErrore ( false );
            return true;
        }
    }
    /*  -----------------------------------------------------------------------------------------------
      adding new product
    --------------------------------------------------------------------------------------------------- */
    const addItemShopList = ( descrizione, prezzo, qta ) => {
        if ( !checkInput () ) {
            return false;
        }
        console.log ( prezzo, qta );
        const parsedPrezzo = parseFloat ( prezzo );
        const parsedQta = parseInt ( qta );
        if ( descrizione === '' ) {
            //console.log("errore");
            setErrore ( true );
            return false;
        }
        const nuovoProdotto = {
            id: Date.now (),
            descrizione,
            prezzo: parsedPrezzo,
            qta: parsedQta,
        };

        setSpesa ( [...spesa, nuovoProdotto] );
        setErrore ( false );
        setDescrizione ( '' );
        setPrezzo ( '' );
        setQuantita ( '' )
    }

    /*  -----------------------------------------------------------------------------------------------
    Salvo la lista nel local storage
    --------------------------------------------------------------------------------------------------- */
    useEffect ( () => {
        localStorage.setItem('valueBuono', valoreBuono)
        //salvo la lista nel localstorage
        if ( spesa.length > 0 ) {
            localStorage.setItem ( 'spesa', JSON.stringify ( spesa ) );
        }

    }, [spesa] )

    /*  -----------------------------------------------------------------------------------------------
    Carico la lista dal local storage
    --------------------------------------------------------------------------------------------------- */
    useEffect ( () => {
        const savedSpesa = localStorage.getItem ( 'spesa' );
        const savedVaucherValue = localStorage.getItem( 'valueBuono' );
        if ( savedSpesa ) {
            setValoreBuono(savedVaucherValue)
            setSpesa ( JSON.parse ( savedSpesa ) )
        }
    },[]);

    //rimuovo i dati dal local storage

    const removeItemFromLocalStorage = () => {
        localStorage.removeItem( 'valueBuono' );
        localStorage.removeItem( 'spesa' );
        setSpesa([])
    }

    /*  -----------------------------------------------------------------------------------------------
      Remove product by Id
    --------------------------------------------------------------------------------------------------- */
    const removeItemShopList = ( id ) => {

        setSpesa ( oldValue => {
            return oldValue.filter ( product => product.id !== id )
        } )
    }

    /*  -----------------------------------------------------------------------------------------------
      operazioni su spesa e buoni pasto
    --------------------------------------------------------------------------------------------------- */
    const totaleSpesa = useMemo ( () => {
        const totale = spesa.reduce ( ( acc, item ) => acc + (item.prezzo * item.qta), 0 );
        return isNaN ( totale ) ? 0 : totale;
    }, [spesa] );

    const buoniUtilizzabili = useCallback ( () => {
        totaleSpesa.toFixed ( 2 );
        if ( !valoreBuono ) {
            return 0;
        }
        if ( totaleSpesa < valoreBuono )
            return 0;
        return Math.floor ( totaleSpesa / valoreBuono );
    }, [totaleSpesa, valoreBuono] );


    const restoEuro = () => {
        return (totaleSpesa - (buoniUtilizzabili () * valoreBuono)).toFixed ( 2 );
    }

    const diffXBuono = () => {
        if ( spesa.length === 0 ) {
            //console.log("crash");
            return 0
        }
        if ( buoniUtilizzabili () >= 1 ) {

            return valoreBuono - restoEuro ();
        }
        return valoreBuono - totaleSpesa;
    }


    const messageBuoni = buoniUtilizzabili () >= 1 ? "per usare il prossimo buono" : "per usare un buono";

    //console.log("differenza", diffXBuono());
    //console.log("spesa", spesa.length);
    //console.log("buoni utilizzabili ", buoniUtilizzabili());
    //console.log(messageBuoni);

    return (
        <div className="container">
            <header>
                <div className="logo"></div>
            </header>
            <div className="container content-app">
                <div className="vaucher-option">
                    <div className="mb-3">
                        <label className="form-label">Valore Singolo buono</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder={valoreBuono}
                            value={ valoreBuono }
                            onChange={ ( e ) => setValoreBuono ( e.target.value ) }
                        />
                    </div>
                </div>
                <div className="shop-list-add">
                    <div className="shoplist-option">
                        <div className="title-shop-list">
                            <MdAddShoppingCart/>
                            <h4>New Product</h4>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descrizione</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='prodotto'
                                id='descrizione'
                                value={ descrizione }
                                onChange={ ( e ) => setDescrizione ( e.target.value ) }  // Aggiorna lo stato descrizione
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Prezzo</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder='prezzo'
                                id='prezzo'
                                min={0}
                                value={ prezzo }
                                onChange={ ( e ) => setPrezzo ( e.target.value ) }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quantità</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder='1'
                                id='quantita'
                                value={ quantita }
                                min={ 1 }
                                onChange={ ( e ) => setQuantita ( parseInt ( e.target.value ) || 1 ) }
                            />
                        </div>
                        <button className="btn btn-success" onClick={ () => {
                            addItemShopList ( descrizione, prezzo, quantita );
                        } }>Add Product
                        </button>
                    </div>


                </div>
                <div className="list-header">
                    <FaShoppingCart
                        className='icons'
                        onClick={ () => {removeItemFromLocalStorage()}}
                    />
                    <h4>Shop List</h4>
                </div>
                <div className="list-content">
                    {
                        errore ? (
                            <div className="alert alert-danger" role="alert">
                                Attenzione, potrebbe mancare qualche parametro...
                            </div>
                        ) : (
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Product</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Q.ta</th>
                                    <th scope='col'>Action</th>
                                </tr>
                                </thead>
                                {
                                    spesa.map ( ( el ) => {
                                        return (
                                            <tbody key={ el.id }>
                                            <tr>
                                                <td key={ el.id }>{ el.descrizione }</td>
                                                <td>{ el.prezzo }€</td>
                                                <td>{ el.qta }</td>
                                                <td onClick={ () => removeItemShopList ( el.id ) }><IoTrash/></td>
                                            </tr>
                                            </tbody>
                                        )
                                    } ) }
                            </table>
                        ) }
                </div>
                <div className="totals-display">
                    <h4 className="totale-spesa">Totale
                        Spesa: { isNaN ( totaleSpesa ) ? '0.00' : totaleSpesa.toFixed ( 2 ) }€</h4>
                    <hr/>
                    <div className='buoni'>
                        <p className={ (diffXBuono () || buoniUtilizzabili () < 1) ? 'show' : 'hide' }>
                            {
                                errore ? '' : (
                                    <>
                                        Aggiungi <span>{ diffXBuono ().toFixed ( 2 ) }€ </span> { messageBuoni }
                                    </>
                                ) }
                        </p>

                        <p className={ diffXBuono () && buoniUtilizzabili () < 1 ? 'hide' : 'show' }>
                            Buoni Utilizzabili: <span>{ buoniUtilizzabili () }</span>
                        </p>
                        <p>Rimanenza: <span>{ restoEuro () } €</span></p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BuoniPastoCalculator;