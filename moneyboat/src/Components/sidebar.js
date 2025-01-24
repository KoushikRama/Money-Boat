import React , {useEffect} from "react";
import "./sidebar.css"; 
import {Link} from 'react-router-dom';

const usericon = './UserIcon.png';
const bankicon = './bank_icon.png';
const budgeticon = './budget_icon.png';
const settingsicon= './settings_icon.png';
const Vaulticon= './Vault_icon.png';
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
            <li>
              <img src={bankicon} id="bankicon" alt="bankicon" />
              <Link to="/bankaccount">Bank Accounts</Link>
            </li>
            <li>
              <img src={Vaulticon} id="vaulticon" alt="vaulticon" />
              <Link to="/vault">Vault</Link>
            </li>
            <li>
              <img src={budgeticon} id="budgeticon" alt="budgeticon" />
              <Link to="/budgets">Budgets</Link>
            </li>
            <li>
              <img src={settingsicon} id="settingsicon" alt="settingsicon" />
              Settings
            </li>
            <li
              onClick={logout ? logout : () => console.error("Logout function is not passed correctly")}
            >
              Logout
            </li>
          </ul>     
        </nav>
      </div>
    );
  };
  
