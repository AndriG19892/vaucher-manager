import React, { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { IoTrash } from "react-icons/io5";



const BuoniPastoCalculator = () => {
    const [spesa, setSpesa] = useState([]);
    const [valoreBuono, setValoreBuono] = useState(0);
    const [descrizione, setDescrizione] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [errore, setErrore] = useState(false);
    const [messageBuoni, setMessageBuoni] = useState("");

    /*  -----------------------------------------------------------------------------------------------
      checking input
    --------------------------------------------------------------------------------------------------- */
    const checkInput = () => {
        //console.log(valoreBuono, descrizione, prezzo);
        if (valoreBuono === 0 || descrizione === '' || prezzo === 0) {
            setErrore(true);
            return false
        } else {
            setErrore(false);
            return true;
        }
    }
    /*  -----------------------------------------------------------------------------------------------
      adding new product
    --------------------------------------------------------------------------------------------------- */
    const addItemShopList = (descrizione, prezzo) => {
        if (!checkInput()) {
            return false;
        }
        if (descrizione === '') {
            //console.log("errore");
            setErrore(true);
            return false;
        }
        const nuovoProdotto = {
            id: Date.now(),
            descrizione,
            prezzo: parseFloat(prezzo)
        };

        setSpesa([...spesa, nuovoProdotto]);
        setErrore(false);
        setDescrizione('');
        setPrezzo('');
    }


    /*  -----------------------------------------------------------------------------------------------
      Remove product by Id
    --------------------------------------------------------------------------------------------------- */
    const removeItemShopList = (id) => {

        setSpesa(oldValue => {
            return oldValue.filter(product => product.id !== id)
        })
    }

    /*  -----------------------------------------------------------------------------------------------
      operazioni su spesa e buoni pasto
    --------------------------------------------------------------------------------------------------- */
    const totaleSpesa = spesa.reduce((acc, item) => acc + item.prezzo, 0);

    const buoniUtilizzabili = useCallback(() => {
        totaleSpesa.toFixed(2);
        if (!valoreBuono) {
            return 0;
        }
        if (totaleSpesa < valoreBuono)
            return 0;
        return Math.floor(totaleSpesa / valoreBuono);
    }, [totaleSpesa, valoreBuono]);



    const restoEuro = () => {
        return (totaleSpesa - (buoniUtilizzabili() * valoreBuono)).toFixed(2);
    }

    const diffXBuono = () => {
        if (spesa.length === 0) {
            //console.log("crash");
            return 0
        }
        if (buoniUtilizzabili() >= 1) {

            return valoreBuono - restoEuro();
        }
        return valoreBuono - totaleSpesa;
    }

    useEffect(() => {
        if (buoniUtilizzabili() >= 1) {
            setMessageBuoni("per usare il prossimo buono");
        } else if (buoniUtilizzabili() < 1) {
            setMessageBuoni("per usare un buono");
        }
    }, [buoniUtilizzabili]);

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
                            placeholder='valore buono'
                            value={valoreBuono}
                            onChange={(e) => setValoreBuono(e.target.value)}
                        />
                    </div>
                </div>
                <div className="shop-list-add">
                    <div className="shoplist-option">
                        <div className="title-shop-list">
                            <MdAddShoppingCart />
                            <h4>New Product</h4>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descrizione</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='prodotto'
                                id='descrizione'
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}  // Aggiorna lo stato descrizione
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Prezzo</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder='prezzo'
                                id='prezzo'
                                value={prezzo}
                                onChange={(e) => setPrezzo(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-success" onClick={() => {
                            addItemShopList(descrizione, prezzo);
                        }}>Add Product
                        </button>
                    </div>


                </div>
                <div className="list-header">
                    <FaShoppingCart className='icons' />
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
                                        <th scope='col'>Action</th>
                                    </tr>
                                </thead>
                                {
                                    spesa.map((el) => {
                                        return (
                                            <tbody key={el.id}>
                                                <tr>
                                                    <td key={el.id}>{el.descrizione}</td>
                                                    <td>{el.prezzo}€</td>
                                                    <td onClick={() => removeItemShopList(el.id)}><IoTrash /></td>
                                                </tr>
                                            </tbody>
                                        )
                                    })}
                            </table>
                        )}
                </div>
                <div className="totals-display">
                    <h4 className="totale-spesa">Totale Spesa: {totaleSpesa.toFixed(2)}€</h4>
                    <hr />
                    <div className='buoni'>
                        <p className={(diffXBuono() || buoniUtilizzabili() < 1) ? 'show' : 'hide'}>
                            {
                                errore ? '' : (
                                    <>
                                        Aggiungi <span>{diffXBuono().toFixed(2)}€ </span>  {messageBuoni}
                                    </>
                                )}
                        </p>

                        <p className={diffXBuono() && buoniUtilizzabili() < 1 ? 'hide' : 'show'}>
                            Buoni Utilizzabili: <span>{buoniUtilizzabili()}</span>
                        </p>
                        <p>Rimanenza: <span>{restoEuro()} €</span></p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BuoniPastoCalculator;