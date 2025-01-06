import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Components/header.js';
import { Login } from './Components/login.js';
import { Register } from './Components/Register.js';
import { Home } from './Components/home.js'
import { Dashboard } from './Components/dashboard.js';
import { BankAccount } from './Components/BankAccount.js';

function App() {
  return (
    <Router>
      <div className="MoneyBoat">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/bankaccount" element={<BankAccount />}/>
          {/* <Route path="/wallet" element={<Wallet />}/>
          <Route path="/categories" element={<Categories />}/>
          <Route path="/settings" element={<Settings />}/> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
