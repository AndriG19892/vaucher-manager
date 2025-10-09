import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoutes from './routes/ProtectedRoute';

//importo le pagine:

import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Profilo from './pages/Profilo.jsx';
import Settings from './pages/Settings.jsx';
import Shop from './pages/Shop.jsx';
import Vouchers from './pages/Vouchers.jsx';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './inc/custom-style.css';

function App() {
    const userToken = localStorage.getItem ( 'token' );
    return (
        <Router>
            <Navbar/>
            <div>
                <Routes>
                    <Route path="/login" element={ <Login/> }/>
                    <Route path="/" element={ <ProtectedRoutes><Dashboard/></ProtectedRoutes> }/>
                    <Route path="/dashboard" element={ <ProtectedRoutes><Dashboard/></ProtectedRoutes> }/>
                    <Route path="/shop" element={ <ProtectedRoutes><Shop/></ProtectedRoutes> }/>
                    <Route path="/vouchers" element={ <ProtectedRoutes><Vouchers/></ProtectedRoutes> }/>
                    <Route path="/profilo" element={ <ProtectedRoutes><Profilo/></ProtectedRoutes> }/>
                    <Route path="/settings" element={ <ProtectedRoutes><Settings/></ProtectedRoutes> }/>
                    <Route path="/login" element={ <Login/> }/>
                </Routes>
            </div>
        </Router>

    );
}

export default App;
