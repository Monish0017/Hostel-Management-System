import React from 'react';
import './CSS/Header.css';
import logo from '../assets/logo.png'; 

const Header = () => {
  return (
    <div className='header'>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Smart Hostel 2.0</h1>
      </div>
  );
};

export default Header;
