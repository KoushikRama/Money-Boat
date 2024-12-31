import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
const logo = '/MoneyBoatLogo.png';

export const Header =() =>{
   return (
      <nav className="navbar">
         <img src={logo} id="MoneyBoatLogo" />
         <ul>
            <li>Home</li>
            <li><Link to="/login">Login</Link></li>
         </ul>
      </nav>
   );
}

