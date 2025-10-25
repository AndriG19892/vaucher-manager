import React from 'react';
import {ShoppingBag, Ticket, User, LayoutDashboard} from "lucide-react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const BottomNavbar = () => {
    const navigate = useNavigate ();
    return (
        <BottomNav aria-label="Primary navigation">
            <NavButton color="#0ea5e9" onClick={ () => navigate ( "/shop" ) }>
                <ShoppingBag size={ 22 }/>
                <span>Shop</span>
            </NavButton>

            <NavButton color="#673ab7" onClick={ () => navigate ( "/dashboard" ) }>
                <LayoutDashboard size={ 22 }/>
                <span>Dashboard</span>
            </NavButton>

            <NavButton color="#f59e0b" onClick={ () => navigate ( "/vouchers" ) }>
                <Ticket size={ 22 }/>
                <span>Vouchers</span>
            </NavButton>


            <NavButton color="#10b981" onClick={ () => navigate ( "/profilo" ) }>
                <User size={ 22 }/>
                <span>User</span>
            </NavButton>
        </BottomNav>
    );
};
/* Bottom navbar */
const BottomNav = styled.nav`
    position: fixed;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 540px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    border-radius: 22px;
    box-shadow: 0 12px 30px rgba(2, 6, 23, 0.12);
    border: 1px solid rgba(15, 23, 42, 0.04);
    padding: 10px 14px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 40;
`;

/* Nav button */
const NavButton = styled.button`
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    color: ${ props => props.color || "#0ea5e9" };
    cursor: pointer;
    font-family: inherit;

    span {
        font-size: 12px;
        font-weight: 600;
        color: #0f172a;
        opacity: 0.9;
    }
`;
export default BottomNavbar;