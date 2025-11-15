import React, {useState, useEffect, useCallback, useMemo} from 'react';
import Swal from 'sweetalert2';
import {FaShoppingCart} from "react-icons/fa";
import {MdAddShoppingCart} from "react-icons/md";
import {Save} from "lucide-react";
import {useUserContext} from "../components/UserContext";
import {IoTrash} from "react-icons/io5";
import BottomNavbar from "../components/BottomNavbar";
import styled from "styled-components";


const BuoniPastoCalculator = () => {
    const [listaSpesa, setListaSpesa] = useState ( [] );
    const [categoria, setCategoria] = useState ( 'Spesa Generica' );
    const [valoreBuono, setValoreBuono] = useState ( 0 );
    const [voucherDisponibili, setVoucherDisponibili] = useState ( 0 );
    const [descrizione, setDescrizione] = useState ( '' );
    const [prezzo, setPrezzo] = useState ( 0 );
    const [quantita, setQuantita] = useState ( 1 );
    const [errore, setErrore] = useState ( false );
    const {vouchers, userData, fetchUserData} = useUserContext ();
    const userId = userData?._id;
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
            setVoucherDisponibili ( vouchers[0].quantity );

            localStorage.setItem ( 'valueBuono', vouchers[0].value );
            localStorage.setItem ( 'quantita', vouchers[0].quantity );
            ricaricaDatiAggiornati ();
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
            return oldValue.filter ( product => product.id !== id );
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
    const ricaricaDatiAggiornati = async () => {
        const vouchersResponse = await fetch ( `${ process.env.REACT_APP_VOUCHER_API_URL }${ userId }` );
        const vouchersData = await vouchersResponse.json ();
        console.log ( vouchersData );
        if ( vouchersData.success ) {
            setVoucherDisponibili ( vouchersData.vouchers[0].quantity );
            setValoreBuono ( vouchersData.vouchers[0].value );
        }
    }
    const saveSpesa = async () => {
        console.log ( "user id", userId );
        console.log ( listaSpesa );
        if ( listaSpesa.length === 0 ) return;
        try {
            const response = await fetch ( `${ process.env.REACT_APP_SHOP_API_URL }create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify ( {
                    userId: userId,
                    prodotti: listaSpesa,
                    categoria: categoria,
                    buoniUtilizzati: buoniUtilizzabili (),
                } )
            } );
            const data = await response.json ();
            if ( data.success ) {
                Swal.fire ( {
                    icon: 'success',
                    title: 'Salvataggio Riuscito!',
                    text: 'La tua spesa è stata registrata correttamente',
                    timer: 2000,
                    showConfirmButton: false,
                    position: "top",
                    toast: true
                } )
            }
            console.log ( data );
            if ( data.success ) {
                console.log ( "spesa salvata con successo", data.shop );
                ricaricaDatiAggiornati ( data );
                setListaSpesa ( [] );
            }
        } catch
            (err) {
            console.error ( 'Errore nel salvataggio:', err );

        }
    }


    const messageBuoni = buoniUtilizzabili () >= 1 ? "per usare il prossimo buono" : "per usare un buono";


    return (
        <ShopWrapper>
            <div className="container">
                <div className="container content-app">
                    <div className="vaucher-option">
                        <div className="voucher-disponibili">

                            <p>Voucher Disponibili: <span>{ voucherDisponibili }</span></p>

                        </div>

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
                                    onChange={ ( e ) => setQuantita ( parseInt ( e.target.value ) ) }
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
                        <button className="btn btn-success" onClick={ () => {
                            saveSpesa ()
                        } }>
                            <Save/>
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

    .voucher-disponibili {
        background: #ffffff;
        border: 2px solid #10b981; /* verde elegante */
        border-radius: 16px;
        padding: 16px 24px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        margin-bottom: 20px;
        width: 100%;
        max-width: 360px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        p {
            font-size: 1.2rem;
            font-weight: 600;
            color: #065f46;
            margin: 0;

            span {
                display: inline-block;
                margin-left: 8px;
                background: #10b981;
                color: white;
                padding: 6px 14px;
                border-radius: 12px;
                font-size: 1.4rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            }
        }
    }

    .totals-display {
        width: 100%;
        background: #fff;
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 16px;
        margin-top: 20px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .totals-display h4 {
        margin: 0 0 10px 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e3a8a;
        text-align: left;
    }

    .totals-display hr {
        margin: 10px 0;
        border: none;
        height: 1px;
        background: #d1d5db;
    }

    .totals-display .buoni {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 1rem;
        color: #111827;
    }

    .totals-display .buoni p {
        display: flex;
        justify-content: flex-start;
        margin: 0;
        align-items: center;
    }

    .totals-display .buoni span {
        font-weight: 700;
        background: #3b82f6;
        color: white;
        padding: 4px 10px;
        border-radius: 8px;
        min-width: 60px;
        text-align: center;
    }

    .totals-display button {
        width: 100%;
        margin-top: 12px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .totals-display button:hover {
        background: #059669;
    }

`;
export default BuoniPastoCalculator;