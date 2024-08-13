import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";



const BuoniPastoCalculator = () => {
    const [spesa, setSpesa] = useState([]);
    const [valoreBuono, setValoreBuono] = useState(0);
    const [descrizione, setDescrizione] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [errore, setErrore] = useState(false);

    //funzione per aggiornare i valori

    const addItemShopList = (descrizione, prezzo) => {
        if (descrizione === '') {
            console.log("errore");
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
      operazioni su spesa e buoni pasto
    --------------------------------------------------------------------------------------------------- */

    const totaleSpesa = spesa.reduce((acc, item) => acc + item.prezzo, 0);



    const buoniUtilizzabili = () => {
        totaleSpesa.toFixed(2);
        if (!valoreBuono) {
            return 0;
        }
        if (totaleSpesa < valoreBuono)
            return 0;
        return Math.floor(totaleSpesa / valoreBuono);
    }
    const diffXBuono = () => {
        if (buoniUtilizzabili() >= 1)
            return 0
        return valoreBuono - totaleSpesa;
    }

    console.log("buoni utilizzabili " + buoniUtilizzabili());
    const restoEuro = () => {
        return (totaleSpesa - (buoniUtilizzabili() * valoreBuono)).toFixed(2);
    }



    // const nextVaucher = () => {
    //     if (!valoreBuono) {
    //         return 0
    //     }
    //     return valoreBuono - importoRimanente
    // }

    //const importoRimanente = totaleSpesa - (buoniUtilizzabili * valoreBuono);


    useEffect(() => {
        console.log(spesa);
    }, [spesa])



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
                                Inserisci descrizione e prezzo del prodotto
                            </div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Product</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                {
                                    spesa.map((el) => {
                                        return (
                                            <tbody key={el.id}>
                                                <tr>
                                                    <td key={el.id}>{el.descrizione}</td>
                                                    <td>{el.prezzo}€</td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                }
                            </table>
                        )
                    }
                </div>
                <div className="totals-display">
                    <h4 className="totale-spesa">Totale Spesa: {totaleSpesa}€</h4>
                    <hr />
                    <div className='buoni'>
                        <p className={(diffXBuono() || buoniUtilizzabili() < 1) ? 'show' : 'hide'}>
                            Aggiungi ancora <span>{diffXBuono()}€ </span>  per usare un buono
                        </p>

                        <p className={diffXBuono() ? 'hide' : 'show'}>
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