import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
const logo = '/MoneyBoatLogo.png';

export const Header =() =>{
   return (
      <nav className="navbar spot">
         <img src={logo} id="MoneyBoatLogo" />
         <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
         </ul>
      </nav>
   );
}

