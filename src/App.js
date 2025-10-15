import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoutes from './routes/ProtectedRoute';
// importo le pagine
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Profilo from './pages/Profilo.jsx';
import Settings from './pages/Settings.jsx';
import Shop from './pages/Shop.jsx';
import Vouchers from './pages/Vouchers.jsx';
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './inc/custom-style.css';

import { AnimatePresence, motion } from 'framer-motion';


// Wrapper per animare le pagine
const PageWrapper = ( {children} ) => {
    return (
        <motion.div
            initial={ {opacity: 0, x: 50} }
            animate={ {opacity: 1, x: 0} }
            exit={ {opacity: 0, x: -50} }
            transition={ {duration: 0.3} }
            style={ {height: '100%'} }
        >
            { children }
        </motion.div>
    );
};

// Componente per gestire le rotte animate
const AnimatedRoutes = () => {
    const location = useLocation ();
    return (
        <AnimatePresence mode="wait">
            <Routes location={ location } key={ location.pathname }>
                <Route path="/login" element={ <PageWrapper><Login/></PageWrapper> }/>
                <Route path="/" element={ <PageWrapper><ProtectedRoutes><Dashboard/></ProtectedRoutes></PageWrapper> }/>
                <Route path="/dashboard"
                       element={ <PageWrapper><ProtectedRoutes><Dashboard key={Date.now()}/></ProtectedRoutes></PageWrapper> }/>
                <Route path="/shop" element={ <PageWrapper><ProtectedRoutes><Shop/></ProtectedRoutes></PageWrapper> }/>
                <Route path="/vouchers"
                       element={ <PageWrapper><ProtectedRoutes><Vouchers/></ProtectedRoutes></PageWrapper> }/>
                <Route path="/profilo"
                       element={ <PageWrapper><ProtectedRoutes><Profilo/></ProtectedRoutes></PageWrapper> }/>
                <Route path="/settings"
                       element={ <PageWrapper><ProtectedRoutes><Settings/></ProtectedRoutes></PageWrapper> }/>
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <Navbar/>
            <AnimatedRoutes/>
        </Router>
    );
}

export default App;
