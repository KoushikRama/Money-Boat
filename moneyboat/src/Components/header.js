import React, { useEffect, useState ,useRef } from 'react';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const logo = '/MoneyBoatLogo.png';
const usericon = '/UserIcon.png'

export const Header = () => {
  const [isDropDownOpened, setIsDropDownOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true); // Added to track login status check

  const navigate = useNavigate();

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
            setUser(response.data.user); // Set user data
            setIsLoggedIn(true); // Set logged-in state after successful validation
            console.log("User profile fetched:", response.data.user);
            navigate('/home'); // Navigate to home
          } else {
            setIsLoggedIn(false); // Set logged out if user is not active
            setUser(null); // Clear user data
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          localStorage.removeItem('token'); // Remove invalid token
          setIsLoggedIn(false); // Mark as not logged in
          setUser(null); // Clear user data
        }
      } else {
        setIsLoggedIn(false); // No token, mark as not logged in
        setUser(null); // Clear user data
      }
      setIsCheckingLogin(false); // Finished checking login status
    };

    checkLogin(); // Call the checkLogin function when the component mounts
  }, [navigate]); // Dependencies: Only run when the component mounts or navigate changes

  // Second useEffect: Log the state change after login check is done
  useEffect(() => {
    if (!isCheckingLogin) {
      console.log('isLoggedIn state changed:', isLoggedIn);
    }
  }, [isLoggedIn, isCheckingLogin]);

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
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login'); // Redirect to login page
      } catch (error) {
        console.error('Error logging out:', error);
      }
    } else {
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const handleToggle = () => {
    setIsDropDownOpened(!isDropDownOpened);
  };

  // Handle click outside to close the dropdown
  const isClickedOutside = (event) => {
    if (!event.target.closest('#usericon') && !event.target.closest('.dropmenu')) {
      setIsDropDownOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', isClickedOutside);
    return () => {
      document.removeEventListener('click', isClickedOutside);
    };
  }, []);

  return (
    <nav className="navbar spot">
      <img src={logo} id="MoneyBoatLogo" alt="Logo" />
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li>Dashboard</li>
        {isLoggedIn ? (
          // Show user icon and dropdown when logged in
          <div id="usericon-container">
            <img
              src={usericon}
              alt="profile_icon"
              id="usericon"
              onClick={handleToggle}
            />
            {isDropDownOpened && (
              <div className='dropmenu' onClick={(e) => e.stopPropagation()}>
                <button className='dropitem'>Settings</button>
                <button className='dropitem' onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          // Show login link when not logged in
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};
