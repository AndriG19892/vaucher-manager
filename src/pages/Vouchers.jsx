import React from 'react';
import styled from "styled-components";
import BottomNavbar from "../components/BottomNavbar";

const Vouchers = () => {
    return (
        <VoucherWrapper>
            <h1>Pagina gestione Voucher</h1>
            <BottomNavbar />
        </VoucherWrapper>
    );
};

const VoucherWrapper = styled.div`
    min-height: 100vh;
    padding: 24px 20px 110px; /* spazio in basso per la navbar fissa */
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #e9f8ff 0%, #ffffff 55%);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #1f2937;
`;
export default Vouchers;