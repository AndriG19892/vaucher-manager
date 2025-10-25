import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Save, RefreshCcw} from "lucide-react";
import {useUserContext} from "../components/UserContext";
import BottomNavbar from "../components/BottomNavbar";

const Vouchers = () => {
    const [numberOfVouchers, setnumberOfVouchers] = useState ( [] );
    const [valueOfVouchers, setValueOfVouchers] = useState ( 5.29 );
    var totale = 0;
    const {vouchers, loading} = useUserContext ();

    const handleSave = () => {
        alert ( `Salvato!\nNumero: ${ numberOfVouchers }\nValore: €${ valueOfVouchers }` );
        // TODO: collegare API
    };

    const handleReset = () => {
        setnumberOfVouchers ( 20 );
        setValueOfVouchers ( 5.29 );
    };
    totale = vouchers[0]?.quantity * vouchers[0]?.value;
    useEffect ( () => {
        if ( vouchers[0] ) {
            setnumberOfVouchers ( vouchers[0]?.quantity );
            setValueOfVouchers ( vouchers[0]?.value );
        }
    },[ vouchers ] );

    console.log ( totale );
    return (
        <Wrapper>
            <Card>
                <Title color="#673ab7">
                    Gestione Voucher
                </Title>
                <InfoText>
                    Modifica il numero e il valore dei tuoi voucher.
                    Il totale si aggiorna automaticamente.
                </InfoText>

                <InputGroup>
                    <Label>Numero rimanente</Label>
                    <Input
                        type="number"
                        value={ numberOfVouchers }
                        onChange={ ( e ) => setnumberOfVouchers ( e.target.value ) }
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Valore singolo (€)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={ valueOfVouchers }
                        onChange={ ( e ) => setValueOfVouchers ( e.target.value ) }
                    />
                </InputGroup>

                <TotalBox>
                    <p>Totale disponibile</p>
                    <TotalValue>€ { totale }</TotalValue>
                </TotalBox>

                <ButtonRow>
                    <SecondaryButton onClick={ handleReset }>
                        <RefreshCcw size={ 16 }/>
                        Ripristina
                    </SecondaryButton>
                    <PrimaryButton onClick={ handleSave }>
                        <Save size={ 16 }/>
                        Salva modifiche
                    </PrimaryButton>
                </ButtonRow>
            </Card>

            <BottomNavbar/>
        </Wrapper>
    );
};

/* ----------------------------- STYLED COMPONENTS ----------------------------- */

const Wrapper = styled.div`
    min-height: 100vh;
    padding: 24px 20px 110px; /* spazio per la navbar fissa */
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #e9f8ff 0%, #ffffff 55%);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
    color: #1f2937;
`;

const Card = styled.div`
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
    text-align: center;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
`;

const InfoText = styled.p`
    color: #475569;
    font-size: 14px;
    margin-bottom: 24px;
`;

const InputGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Label = styled.label`
    font-weight: 600;
    color: #1e293b;
    font-size: 15px;
`;

const Input = styled.input`
    width: 100px;
    text-align: center;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.2s ease;
    background: #f8fafc;

    &:focus {
        outline: none;
        border-color: #0ea5e9;
        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
    }
`;

const TotalBox = styled.div`
    margin-top: 24px;
    padding: 16px;
    background: #f0f9ff;
    border-radius: 14px;
    border: 1px solid #bae6fd;

    p {
        color: #0369a1;
        font-size: 14px;
        margin-bottom: 4px;
    }
`;

const TotalValue = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: #0284c7;
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
`;

const ButtonBase = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    padding: 10px 16px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    svg {
        margin-bottom: 1px;
    }
`;

const PrimaryButton = styled ( ButtonBase )`
    background-color: #0ea5e9;
    color: white;
    box-shadow: 0 6px 12px rgba(14, 165, 233, 0.25);

    &:hover {
        background-color: #0284c7;
    }

    &:active {
        transform: scale(0.97);
    }
`;

const SecondaryButton = styled ( ButtonBase )`
    background-color: #f1f5f9;
    color: #1e293b;
    border: 1px solid #cbd5e1;

    &:hover {
        background-color: #e2e8f0;
    }

    &:active {
        transform: scale(0.97);
    }
`;

export default Vouchers;
