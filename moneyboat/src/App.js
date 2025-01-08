import React, {useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Components/header.js';
import { Login } from './Components/login.js';
import { Register } from './Components/Register.js';
import { Home } from './Components/home.js'
import { Dashboard } from './Components/dashboard.js';
import { BankAccount } from './Components/BankAccount.js';
import { Vault } from './Components/vault.js';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSideBarOpen,setIsSideBarOpen]=useState(false);
  return (
    <Router>
      <div className="MoneyBoat">
        <Header isLoggedIn={isAuthenticated} setIsLoggedIn={setIsAuthenticated} isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />
        <div className={`routeSection ${isSideBarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          < Route path="/" element={
              isAuthenticated ? (
                <Home />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            } />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={ <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/bankaccount" element={<BankAccount />}/>
          <Route path="/vault" element={<Vault/>}/>
        </Routes>
      </div>
    </div>  
    </Router>
  );
}

export default App;
