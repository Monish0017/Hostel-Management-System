import React from 'react';
import Header from './Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './CSS/StudentHome.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, rollNo } = location.state || {};

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="container">
      <Header />
      <div className="user-info-container">
        <div className="user-info">
          <button className="back-button" onClick={handleBack}>Back</button>
          <div>
            <span>Name: {name || 'N/A'}</span>
            <span>Roll No: {rollNo || 'N/A'}</span>
          </div>
          <button className="logout-button">Log out</button>
        </div>
      </div>
      <div className="main1">
        <nav className="sidebar">
          <ul>
            <li>Student Profile</li>
            <li>IVRS</li>
            <li>Room</li>
            <li>Events</li>
            <li>Food</li>
            <li>Information</li>
            <li><Link to="/home/fee" style={{ textDecoration: 'none',color: 'inherit'}}>Fees</Link></li>


          </ul>
        </nav>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
