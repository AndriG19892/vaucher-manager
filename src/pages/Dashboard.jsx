// Dashboard.js
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { ShoppingBag, Ticket, User } from "lucide-react";
import BottomNavbar from "../components/BottomNavbar";
import styled from 'styled-components';


const Dashboard = () => {
    const navigate = useNavigate ();
    const location = useLocation ();
    const [user, setUser] = useState ( '' );
    const [vouchers, setVouchers] = useState ( [] );
    const [valueOfVouchers, setValueOfVouchers] = useState ( 0 );
    const [loading, setLoading] = useState ( false );

    const userId = localStorage.getItem ( 'userId' );
    const token = localStorage.getItem ( 'token' );
    useEffect ( () => {
        async function fetchUserData() {
            try {
                const res = await fetch ( `${ process.env.REACT_APP_USER_API_URL }/${ userId }`, {
                    headers: {
                        Authorization: `Bearer ${ token }`,
                    }

                } );
                setLoading ( true );
                const data = await res.json ()
                setUser ( data.user );
                setVouchers ( data.vouchers )
            } catch (err) {
                console.error ( "Errore durante il recupero dei dati", err );
            } finally {
                setLoading ( false );
            }
        }
        fetchUserData ();
    }, [location.pathname] );

    if ( loading ) return <p>Caricamento...</p>;
    return (
        <DashboardWrapper>
            <HeaderCard>
                <Greeting>👋 Ciao, { user.name }!</Greeting>
                <Info>
                    Hai <span>{ vouchers[0]?.quantity }</span> voucher disponibili
                </Info>
                <Info>
                    Valore singolo voucher: <span>{ vouchers[0]?.value }€</span>
                </Info>
            </HeaderCard>

            <ButtonsGrid>
                <BigButton
                    onClick={ () => navigate ( "/shop" ) }
                    bg="#0ea5e9"
                    aria-label="Shop"
                >
                    <ShoppingBag size={ 36 }/>
                    <div style={ {fontSize: 18, fontWeight: 700} }>Shop</div>
                    <SmallLabel>Gestisci la tua spesa</SmallLabel>
                </BigButton>

                <BigButton
                    onClick={ () => navigate ( "/vouchers" ) }
                    bg="#f59e0b"
                    aria-label="Vouchers"
                >
                    <Ticket size={ 36 }/>
                    <div style={ {fontSize: 18, fontWeight: 700} }>Vouchers</div>
                    <SmallLabel>Gestisci i tuoi voucher</SmallLabel>
                </BigButton>

                <BigButton
                    onClick={ () => navigate ( "/user" ) }
                    bg="#10b981"
                    aria-label="User"
                >
                    <User size={ 36 }/>
                    <div style={ {fontSize: 18, fontWeight: 700} }>User</div>
                    <SmallLabel>Pannello utente</SmallLabel>
                </BigButton>
            </ButtonsGrid>
            <BottomNavbar/>
        </DashboardWrapper>
    );
};

const DashboardWrapper = styled.div`
    min-height: 100vh;
    padding: 24px 20px 110px; /* spazio in basso per la navbar fissa */
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #e9f8ff 0%, #ffffff 55%);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #1f2937;
`;

/* Card header */
const HeaderCard = styled.div`
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 22px;
    padding: 20px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
    text-align: center;
    margin-bottom: 20px;
`;

const Greeting = styled.h1`
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
`;

const Info = styled.p`
    margin: 4px 0;
    color: #475569;
    font-size: 14px;

    span {
        color: #0ea5e9;
        font-weight: 700;
    }
`;

/* Buttons grid */
const ButtonsGrid = styled.div`
    width: 100%;
    max-width: 420px;
    display: grid;
    gap: 16px;
    grid-auto-rows: minmax(76px, auto);
`;

/* Reusable big button */
const BigButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 18px;
    border: none;
    border-radius: 18px;
    color: white;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(2, 6, 23, 0.08);
    transform: translateZ(0);
    transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
    font-family: inherit;

    svg {
        filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
    }

    &:active {
        transform: scale(0.98);
    }

    &:hover {
        box-shadow: 0 14px 28px rgba(2, 6, 23, 0.10);
    }

    background: ${ props => props.bg || "#0ea5e9" };
`;

/* small label under title */
const SmallLabel = styled.span`
    font-size: 13px;
    opacity: 0.95;
    color: rgba(255, 255, 255, 0.95);
`;


export default Dashboard;
