import {createContext, useContext, useState, useEffect} from "react";

//creo il contesto:

const UserContext = createContext ();

//creo il fornitore di dati:
export const UserProvider = ( {children} ) => {
    const [userData, setUserData] = useState ( null );
    const [vouchers, setVouchers] = useState ( [] );
    const [loading, setLoading] = useState ( false );

    const userId = localStorage.getItem ( "userId" );
    const token = localStorage.getItem ( "token" );

    const fetchUserData = async () => {
        if ( !userId || !token ) return;
        setLoading ( true );
        try {
            const res = await fetch ( `${ process.env.REACT_APP_USER_API_URL }/${ userId }`, {
                headers: {Authorization: `Bearer ${ token }`},
            } );
            if ( !res.ok ) throw new Error ( `Errore HTTP: ${ res.status }` );
            const data = await res.json ();
            setUserData ( data.user );
            setVouchers ( data.vouchers || [] );
        } catch (err) {
            console.error ( "Errore durante il recupero dei dati:", err );
        } finally {
            setLoading ( false );
        }
    };
    useEffect ( () => {
        fetchUserData ();
    }, [userId, token] );

    //Il provider avvolge l'app e rende i dati accessibili a tutti
    return (
        <UserContext.Provider value={ {userData, setUserData, vouchers, setVouchers, loading, fetchUserData } }>
            { children }
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext ( UserContext );