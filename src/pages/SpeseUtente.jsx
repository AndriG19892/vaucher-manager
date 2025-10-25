import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Receipt, ArrowLeft, Loader2} from "lucide-react";
import BottomNavbar from "../components/BottomNavbar";
import {useUserContext} from "../components/UserContext";
import {useNavigate} from "react-router-dom";

const SpeseUtente = () => {
    const {userData} = useUserContext ();
    const userId = userData?._id;
    const [spese, setSpese] = useState ( [] );
    const [loading, setLoading] = useState ( true );
    const navigate = useNavigate ();

    useEffect ( () => {
        const fetchSpese = async () => {
            try {
                console.log ( userId )
                const response = await fetch ( `${ process.env.REACT_APP_SHOP_API_URL }user/${ userId }` );
                const data = await response.json ();
                console.log ( data );
                if ( data.success ) {
                    setSpese ( data.shopList.reverse () ); // Mostra prima le più recenti
                }
            } catch (error) {
                console.error ( "Errore durante il recupero delle spese:", error );
            } finally {
                setLoading ( false );
            }
        };

        if ( userId ) {
            fetchSpese ();
        }
    }, [userId] );

    return (
        <SpeseWrapper>
            <div className="container">
                <div className="header">
                    <ArrowLeft className="back" onClick={ () => navigate ( -1 ) }/>
                    <h2>Le mie spese</h2>
                    <Receipt className="icon"/>
                </div>

                { loading ? (
                    <LoaderContainer>
                        <Loader2 className="spinner"/>
                        <p>Caricamento...</p>
                    </LoaderContainer>
                ) : spese.length === 0 ? (
                    <EmptyState>
                        <p>Nessuna spesa salvata.</p>
                    </EmptyState>
                ) : (
                    <SpeseList>
                        { spese.map ( ( spesa ) => (
                            <SpesaCard key={ spesa._id }>
                                <div className="top">
                                    <h4>{ spesa.categoria || "Senza categoria" }</h4>
                                    <span className="date">
                    { new Date ( spesa.data ).toLocaleDateString ( "it-IT" ) }
                  </span>
                                </div>

                                <ul className="prodotti">
                                    { spesa.prodotti.map ( ( p, index ) => (
                                        <li key={ index }>
                                            <span className="desc">{ p.descrizione }</span>
                                            <span className="importo">
                        { p.importo.toFixed ( 2 ) }€ × { p.quantita }
                      </span>
                                        </li>
                                    ) ) }
                                </ul>

                                <div className="bottom">
                                    <p>
                                        <strong>Totale:</strong>{ " " }
                                        { spesa.prodotti
                                            .reduce ( ( tot, p ) => tot + p.importo * p.quantita, 0 )
                                            .toFixed ( 2 ) }€
                                    </p>
                                    <p>
                                        <strong>Buoni Utilizzati:</strong>{ " " }
                                        { spesa.buoniUtilizzati }
                                    </p>
                                </div>
                            </SpesaCard>
                        ) ) }
                    </SpeseList>
                ) }
            </div>
            <BottomNavbar/>
        </SpeseWrapper>
    );
};

export default SpeseUtente;

const SpeseWrapper = styled.div`
    min-height: 100vh;
    padding: 24px 20px 110px;
    background: linear-gradient(180deg, #e9f8ff 0%, #ffffff 55%);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #1f2937;
`;

const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    color: #6b7280;
    font-size: 1rem;

    .spinner {
        animation: spin 1s linear infinite;
        width: 40px;
        height: 40px;
        color: #0ea5e9;
        margin-bottom: 10px;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const EmptyState = styled.div`
    text-align: center;
    margin-top: 80px;
    color: #6b7280;
    font-size: 1.1rem;
`;

const SpeseList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const SpesaCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 6px rgb(1 18 26 / 20%);

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        h4 {
            margin: 0;
            color: #0ea5e9;
            font-size: 1.1rem;
        }

        .date {
            font-size: 0.85rem;
            color: #6b7280;
        }
    }

    .prodotti {
        list-style: none;
        padding: 0;
        margin: 8px 0;
        border-top: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;

        li {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            color: #374151;

            .desc {
                font-weight: 500;
            }

            .importo {
                color: #111827;
            }
        }
    }

    .bottom {
        text-align: right;
        margin-top: 8px;
        font-weight: 600;
        color: #111827;
    }
`;

