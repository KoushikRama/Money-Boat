import React, { useEffect, useState } from 'react';
import './header.css';
import { Sidebar } from './sidebar.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const logo = '/MoneyBoatLogo.png';
const usericon = '/UserIcon.png'

export const Header = ({isLoggedIn,setIsLoggedIn,isSideBarOpen,setIsSideBarOpen}) => {
  const [isCheckingLogin, setIsCheckingLogin] = useState(false); // Added to track login status check

  const navigate = useNavigate();
  const handleToggle = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (token) {
        try {
          console.log("Checking login status...");
          console.log("Token:", token);
          const response = await axios.get('http://localhost:5000/profile', {
            headers: { Authorization: `Bearer ${token}` } // Send the token if using JWT
          });

          // Check if the user is active
          if (response.data.user && response.data.user.is_active) {
            setIsLoggedIn(true); // Set logged-in state after successful validation
            setIsCheckingLogin(true);
            console.log("User profile fetched:", response.data.user);
          } else {
            setIsLoggedIn(false); // Set logged out if user is not active
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          localStorage.removeItem('token'); // Remove invalid token
          setIsLoggedIn(false); // Mark as not logged in
        }
      } else {
        setIsLoggedIn(false); // No token, mark as not logged in
        setIsCheckingLogin(false); // Finished checking login status
      }
      
    };

    checkLogin(); // Call the checkLogin function when the component mounts
  },[isLoggedIn]); // Dependencies: Only run when the component mounts or navigate changes

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isCheckingLogin===false) {
      console.log('isLoggedIn state changed:', isLoggedIn);
      navigate('/login'); // Navigate to login
    }else{
      console.log('isLoggedIn state changed:', isLoggedIn);
      navigate('/home'); // Navigate to home
    }
  },[isCheckingLogin]); // Explicitly exclude `navigate`

  const logout = async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (token) {
      try {
        await axios.post('http://localhost:5000/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}` // Send token to backend for invalidation
          }
        });
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsSideBarOpen(false);
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login page
      } catch (error) {
        console.error('Error logging out:', error);
      }
    } else {
      setIsSideBarOpen(false);
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar spot">
      {isLoggedIn ? (<div id="usericon-container">
            <img
              src={usericon}
              alt="profile_icon"
              id="usericon"
              onClick={handleToggle}
            />
            <Sidebar isOpen={isSideBarOpen} isClose={handleToggle} logout={logout}/>
          </div>) :
      (<img src={logo} id="MoneyBoatLogo" alt="Logo" />)}
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>

    </nav>
  );
};
