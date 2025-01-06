import React from "react";
import "./sidebar.css"; 
import {Link} from 'react-router-dom';

const usericon = './UserIcon.png';
// Sidebar Component
export const Sidebar = ({ isOpen, isClose, logout }) => {
    return (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="top">
            <img src={usericon} id='usericon' alt='profile_icon'/>
            <button className="close-btn" onClick={isClose}>X</button>
        </div>
        <nav>
          <ul className="sidebar-list">
            <li><Link to="/bankaccount">Bank Accounts</Link></li>
            <li>Wallet</li>
            <li>Categories</li>
            <li>Settings</li>
            <li onClick={logout}>Logout</li>
          </ul>
          
        </nav>
      </div>
    );
  };
  
