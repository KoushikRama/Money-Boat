import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Components/header.js';
import { Login } from './Components/login.js';
import { Register } from './Components/Register.js';
import { Home } from './Components/home.js'
import './App.css';
import { Dashboard } from './Components/dashboard.js';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
