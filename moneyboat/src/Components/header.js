import React, { useEffect, useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const logo = '/MoneyBoatLogo.png';
const usericon = '/UserIcon.png';

export const Header = () => {
   const [isDropDownOpened, setIsDropDownOpened] = useState(false);

   const handleToggle = () => {
      setIsDropDownOpened(!isDropDownOpened);
   };

   const isClickedOutside = (event) => {
      // Close dropdown if clicked outside of the profile icon and dropdown
      if (!event.target.closest('#usericon') && !event.target.closest('.dropmenu')) {
         setIsDropDownOpened(false);
      }
   };

   const handleMenuClick = (event) => {
      // Prevent event from bubbling to the document and closing the dropdown
      event.stopPropagation();
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
            <li><Link to="/dashboard">DashBoard</Link></li>
            <li><Link to="/login">Login</Link></li>
         </ul>
         <div id="usericon-container">
            <img 
               src={usericon} 
               alt="profile_icon" 
               id="usericon" 
               onClick={handleToggle} 
            />
            {isDropDownOpened && (
               <div className='dropmenu' onClick={handleMenuClick}>
                  <button className='dropitem'>Settings</button>
                  <button className='dropitem'>Logout</button>
               </div>
            )}
         </div>
      </nav>
   );
};
