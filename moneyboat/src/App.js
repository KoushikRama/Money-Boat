import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Components/header.js';
import { Login } from './Components/login.js';
import { Register } from './Components/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="MoneyBoat">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
