import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {FaShoppingCart} from "react-icons/fa";
import {MdAddShoppingCart} from "react-icons/md";
import {Save} from "lucide-react";
import {useUserContext} from "../components/UserContext";
import {IoTrash} from "react-icons/io5";
import BottomNavbar from "../components/BottomNavbar";
import styled from "styled-components";


const BuoniPastoCalculator = () => {
    const [listaSpesa, setListaSpesa] = useState ( [] );
    const [categoria, setCategoria] = useState ( '' );
    const [valoreBuono, setValoreBuono] = useState ( 0 );
    const [descrizione, setDescrizione] = useState ( '' );
    const [prezzo, setPrezzo] = useState ( 0 );
    const [quantita, setQuantita] = useState ( 1 );
    const [errore, setErrore] = useState ( false );
    const {vouchers, userData} = useUserContext ();
    const userId = userData?._id;
    //setValoreBuono(vouchers[0]?.value);
    //console.log ( valoreBuono );
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
    const resetForm = () => {
        setDescrizione ( '' );
        setPrezzo ( '' );
        setQuantita ( 1 );
        setErrore ( false );
    };
    /*  -----------------------------------------------------------------------------------------------
      adding new product
    --------------------------------------------------------------------------------------------------- */
    const addItemShopList = ( descrizione, prezzo, quantita ) => {
        if ( !checkInput () ) {
            return false;
        }
        //console.log ( prezzo, quantita );
        const parsedPrezzo = parseFloat ( prezzo );
        const parsedQta = parseInt ( quantita );
        if ( descrizione === '' ) {
            //console.log("errore");
            setErrore ( true );
            return false;
        }
        const nuovoProdotto = {
            id: Date.now (),
            descrizione,
            importo: parsedPrezzo,
            quantita: parsedQta,
        };

        setListaSpesa ( [...listaSpesa, nuovoProdotto] );
        resetForm ();
    }

    // Aggiorna valore buono solo quando cambia vouchers
    useEffect ( () => {
        if ( vouchers?.length > 0 ) {
            setValoreBuono ( vouchers[0].value );
            localStorage.setItem ( 'valueBuono', vouchers[0].value );
        }
    }, [vouchers] );

// Salva la spesa solo quando cambia
    useEffect ( () => {
        localStorage.setItem ( 'spesa', JSON.stringify ( listaSpesa ) );
    }, [listaSpesa] );

    //rimuovo i dati dal local storage

    const removeItemFromLocalStorage = () => {
        localStorage.removeItem ( 'valueBuono' );
        localStorage.removeItem ( 'spesa' );
        setListaSpesa ( [] )
    }

    /*  -----------------------------------------------------------------------------------------------
      Remove product by Id
    --------------------------------------------------------------------------------------------------- */
    const removeItemShopList = ( id ) => {

        setListaSpesa ( oldValue => {
            return oldValue.filter ( product => product.id !== id )
        } )
    }

    /*  -----------------------------------------------------------------------------------------------
      operazioni su spesa e buoni pasto
    --------------------------------------------------------------------------------------------------- */
    const totaleSpesa = useMemo ( () => {
        const totale = listaSpesa.reduce ( ( acc, item ) => acc + (item.importo * item.quantita), 0 );
        return isNaN ( totale ) ? 0 : totale;
    }, [listaSpesa] );
    //console.log ("totale:",totaleSpesa);
    const buoniUtilizzabili = useCallback ( () => {
        totaleSpesa.toFixed ( 2 );
        if ( !valoreBuono ) {
            return 0;
        }
        if ( totaleSpesa < valoreBuono )
            return 0;
        return Math.floor ( totaleSpesa / valoreBuono );
    }, [totaleSpesa, valoreBuono] );


    const restoEuro = useMemo ( () => {
        return (totaleSpesa - (buoniUtilizzabili () * valoreBuono)).toFixed ( 2 );
    }, [totaleSpesa, valoreBuono, buoniUtilizzabili] );

    const differenzaProssimoBuono = () => {
        if ( listaSpesa.length === 0 ) {
            //console.log("crash");
            return 0
        }
        if ( buoniUtilizzabili () >= 1 ) {

            return valoreBuono - restoEuro;
        }
        return valoreBuono - totaleSpesa;
    }

    const saveSpesa = async () => {
        console.log ("user id", userId);
        console.log (listaSpesa);
        if ( listaSpesa.length === 0 ) return;
        try {
            const response = await fetch ( `${ process.env.REACT_APP_SHOP_API_URL }create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify ( {
                    userId: userId,
                    prodotti: listaSpesa,
                    categoria: categoria,
                    buoniUtilizzati:buoniUtilizzabili(),
                } )
            } );
            const data = await response.json ();
            console.log (data);
            if ( data.success ) {
                console.log ( "spesa salvata con successo", data.shop );
                setListaSpesa ( [] );
            }
        } catch
            (err) {
            console.error ( 'Errore nel salvataggio:', err );

        }
    }


    const messageBuoni = buoniUtilizzabili () >= 1 ? "per usare il prossimo buono" : "per usare un buono";

//console.log("differenza", diffXBuono());
//console.log("spesa", spesa.length);
//console.log("buoni utilizzabili ", buoniUtilizzabili());
//console.log(messageBuoni);

    return (
        <ShopWrapper>
            <div className="container">
                <div className="container content-app">
                    <div className="vaucher-option">
                        <div className="mb-3">
                            <label className="form-label">Valore Singolo buono</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder={ valoreBuono }
                                value={ valoreBuono ?? 0 }
                                onChange={ ( e ) => setValoreBuono ( e.target.value ) }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Categoria spesa</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={ categoria || '' }
                                value={ categoria ?? '' }
                                onChange={ ( e ) => setCategoria ( e.target.value ) }
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
                                    min={ 0 }
                                    value={ prezzo || '' }
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
                            onClick={ () => {
                                removeItemFromLocalStorage ()
                            } }
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
                                        listaSpesa.map ( ( el ) => {
                                            return (
                                                <tbody key={ el.id }>
                                                <tr key={ el.id }>
                                                    <td>{ el.descrizione }</td>
                                                    <td>{ el.importo }€</td>
                                                    <td>{ el.quantita }</td>
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
                            <p className={ (differenzaProssimoBuono () || buoniUtilizzabili () < 1) ? 'show' : 'hide' }>
                                {
                                    errore ? '' : (
                                        <>
                                            Aggiungi <span>{ differenzaProssimoBuono ().toFixed ( 2 ) }€ </span> { messageBuoni }
                                        </>
                                    ) }
                            </p>

                            <p className={ differenzaProssimoBuono () && buoniUtilizzabili () < 1 ? 'hide' : 'show' }>
                                Buoni Utilizzabili: <span>{ buoniUtilizzabili () }</span>
                            </p>
                            <p>Rimanenza: <span>{ restoEuro } €</span></p>
                        </div>
                        <button className="btn btn-success" onClick={ () => {saveSpesa()} }>
                            <Save />
                        </button>
                    </div>
                </div>
            </div>

            <BottomNavbar/>
        </ShopWrapper>
    )
}
const ShopWrapper = styled.div`
    min-height: 100vh;
    padding: 24px 20px 110px; /* spazio in basso per la navbar fissa */
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #e9f8ff 0%, #ffffff 55%);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #1f2937;
`;
export default BuoniPastoCalculator;