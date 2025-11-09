import React, {useState} from 'react';
import Swal from 'sweetalert2';
import SaveInLocalStorage from '../Utils/SaveInLocalStorage';
import ErrorMessage from '../Errors/ErrorMessages';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate ();
    const [name, setName] = useState ( '' );
    const [loading, setLoading] = useState ( false );
    const [email, setEmail] = useState ( '' );
    const [password, setPassword] = useState ( '' );
    const [vouchers, setVouchers] = useState ( 0 );
    const [valueOfVouchers, setValueOfVouchers] = useState ( 0 );
    const [error, setError] = useState ( '' );

    const handleSubmit = async ( e ) => {
        e.preventDefault ();
        setError ( '' );
        setLoading ( true );
        if ( !name || !email || !password || !vouchers || !valueOfVouchers ) {
            return setError ( 'Inserisci tutti i campi' );
        }
        try {
            const responseRegisterFromServer = await axios.post ( `${ process.env.REACT_APP_AUTH_API_URL }register`, {
                name,
                email,
                password,
                nVoucher:vouchers,
                valueOfVouchers,
            } );
            console.log ( "cioa:",responseRegisterFromServer.data );
            if ( responseRegisterFromServer.data.success && responseRegisterFromServer.data.token ) {

                SaveInLocalStorage ( 'token', responseRegisterFromServer.data.token );
                SaveInLocalStorage ( 'userId', responseRegisterFromServer.data.userData.id );
                setLoading ( false );
                navigate ( '/' );
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Errore Registrazione',
                    text: responseRegisterFromServer.data.message,
                    confirmButtonColor: '#42a733'
                });
            }
        } catch (err) {
            console.log ( ErrorMessage.USER_REGISRATION_ERROR, err);
            Swal.fire({
                icon: 'error',
                title: 'Errore Registrazione',
                text: err.response?.data?.message || 'Qualcosa è andato storto',
                confirmButtonColor: '#42a733'
            });
            setLoading(false);
        }
    }
    return (
        <RegisterContainer>
            <LoginBox>
                <Title>Registrati</Title>
                <Form onSubmit={ handleSubmit }>
                    <Input
                        type="name"
                        placeholder="Name"
                        value={ name }
                        onChange={ ( e ) => setName ( e.target.value ) }
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={ email }
                        onChange={ ( e ) => setEmail ( e.target.value ) }
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={ password }
                        onChange={ ( e ) => setPassword ( e.target.value ) }
                        required
                    />
                    <Input
                        type="number"
                        placeholder="numero di Vouchers"
                        value={ vouchers }
                        onChange={ ( e ) => setVouchers ( e.target.value ) }
                        required
                    />
                    <Input
                        type="number"
                        placeholder="valore singolo Voucher"
                        value={ valueOfVouchers }
                        onChange={ ( e ) => setValueOfVouchers ( e.target.value ) }
                        step="0.01"
                        min="0"
                        required
                    />
                    { error && <ErrorMsg>{ error }</ErrorMsg> }
                    <Button type="submit">{
                        loading ? 'Caricamento' : 'Registrati'
                    }</Button>
                </Form>
            </LoginBox>
        </RegisterContainer>
    );

}

const RegisterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #002f43, #3d7c97);
    color: #fff;
`;

const LogoWrapper = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
`;

const LoginBox = styled.div`
    background: #fff;
    color: #333;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 400px;
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Input = styled.input`
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    font-size: 16px;

    &:focus {
        border-color: #2b2d42;
    }
`;

const Button = styled.button`
    background: #42a733;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.2s;

    &:hover {
        background: #1f2233;
    }
`;

const ErrorMsg = styled.div`
    color: #e63946;
    font-size: 14px;
`;

const FooterText = styled.p`
    margin-top: 15px;
    font-size: 14px;

    a {
        color: #2b2d42;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export default Register;