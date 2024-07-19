import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CSS/HomePage.css';
import Header from './Header'; // Ensure you import the Header

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, rollNo } = location.state || {}; // Retrieve name and rollNo from state

  const handleBack = () => {
    navigate('/login');
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
            <li>Fees</li>
          </ul>
        </nav>

        <div className="content">
          {/* Main content goes here */}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
