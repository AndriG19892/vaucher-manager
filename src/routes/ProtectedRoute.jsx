import {Navigate} from 'react-router-dom';

const ProtectedRoute = ( {children} ) => {
    const token = localStorage.getItem ( 'token' );

    if ( !token ) {
        return <Navigate
            to='/'
            replace
            state={ {message: 'Accesso negato, effettua il login'} }
        />
    }
    return children;
};

export default ProtectedRoute;