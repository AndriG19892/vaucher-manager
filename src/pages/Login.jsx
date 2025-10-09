import React, {useState} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

const Login = () => {
    const navigate = useNavigate ();
    const [email, setEmail] = useState ( '' );
    const [loading, setLoading ] = useState ( false );
    const [password, setPassword] = useState ( '' );
    const [error, setError] = useState ( '' );

    const handleSubmit = async ( e ) => {
        e.preventDefault ();
        setError ( '' );
        setLoading ( true );
        if ( !email || !password ) return setError ( "Inserisci tutti i campi" );
        try {
            const responseFromServer = await axios.post ( `${ process.env.REACT_APP_API_URL }/login`, {
                email,
                password,
            } );
            if ( responseFromServer.data.success && responseFromServer.data.token ) {
                localStorage.setItem ( 'token', responseFromServer.data.token );
                setLoading ( false );
                navigate ( '/' );
            } else {
                setError ( responseFromServer.data.message || 'Credenziali errate...' );
            }
        } catch (err) {
            console.log ( 'login errato', err );
        }
    };

    return (
        <LoginContainer>
            <LoginBox>
                <Title>Accedi</Title>
                <Form onSubmit={ handleSubmit }>
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
                    { error && <ErrorMessage>{ error }</ErrorMessage> }
                    <Button type="submit">{
                        loading ? 'Caricamento' : 'Entra'
                    }</Button>
                </Form>
                <FooterText>
                    Non hai un account? <a href="/register">Registrati</a>
                </FooterText>
            </LoginBox>
        </LoginContainer>
    );
};

// ---------- STILI ----------

const LoginContainer = styled.div`
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

const ErrorMessage = styled.div`
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

export default Login;
