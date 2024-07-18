import React from 'react';
import './CSS/Header.css';
import logo from '../assets/logo.png'; 

const Header = () => {
  return (
    <div className='header'>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Hostel Management System</h1>
      </div>
  );
};

export default Header;
