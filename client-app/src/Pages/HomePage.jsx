import React from 'react';
import './CSS/HomePage.css';
import hostelImage from '../assets/hostel.jpeg';

const HomePage = () => {
  return (
    <div className="container">
        <div className="user-info">
          <span>Name:</span>
          <span>Roll No:</span>
          <button className="logout-button">Log out</button>
        </div>
      <div className="main">
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
          <img src={hostelImage} alt="Hostel" className="image" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
