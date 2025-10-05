import './App.css';
//importo i componenti
import BuoniPastoCalculator from './components/BuoniPastoCalculator';
import Navbar from './components/Navbar';

//importo le pagine:

import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Profilo from './pages/Profilo.jsx';
import Settings from './pages/Settings.jsx';
import Shop from './pages/Shop.jsx';
import Vouchers from './pages/Vouchers.jsx';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './inc/custom-style.css';

function App() {
    return (
        <Router>
            <Navbar/>
            <div style={ {padding: "20px"} }>
                <Routes>
                    <Route path="/dashboard" element={ <Dashboard/> }/>
                    <Route path="/shop" element={ <Shop/> }/>
                    <Route path="/vouchers" element={ <Vouchers/> }/>
                    <Route path="/profilo" element={ <Profilo/> }/>
                    <Route path="/settings" element={ <Settings/> }/>
                    <Route path="/login" element={ <Login/> }/>
                </Routes>
            </div>
        </Router>

    );
}

export default App;
