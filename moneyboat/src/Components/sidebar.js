import React , {useEffect} from "react";
import "./sidebar.css"; 
import {Link} from 'react-router-dom';

const usericon = './UserIcon.png';
// Sidebar Component
export const Sidebar = ({ isOpen, isClose, logout }) => {
    useEffect(() => {
      console.log("logout function received in Sidebar:", logout);  // Debugging
    }, [logout]);
    return (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="top">
            <img src={usericon} id='usericon' alt='profile_icon'/>
            <button className="close-btn" onClick={isClose}>X</button>
        </div>
        <nav>
          <ul className="sidebar-list">
            <li><Link to="/bankaccount">Bank Accounts</Link></li>
            <li><Link to="/vault">Vault</Link></li>
            <li>Categories</li>
            <li>Settings</li>
            <li onClick={logout ? logout : () => console.error("Logout function is not passed correctly")}>
              Logout
            </li>


          </ul>
          
        </nav>
      </div>
    );
  };
  
