import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <LogoContainer to="/dashboard" />
    );
};

const LogoContainer = styled(Link)`
    background-image: url('/logo.png'); /* 👈 con CRA/Vite basta mettere l’immagine in public/ */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 80px;
    height: 80px;
    position: relative;
    top: 0px;
    left: 0px; /* se vuoi sempre in alto a sinistra */
    border-radius: 70px;
    z-index: 1;
`;

export default Logo;
