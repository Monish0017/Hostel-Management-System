import React from 'react';
import Header from './Header';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import './CSS/StudentHome.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, rollNo } = location.state || {};

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="container">
      <Header />
      <div className="main1">
        <nav className="sidebar">
          <ul>
            <li>Student Profile</li>
            <li>IVRS</li>
            <li>Room</li>
            <li>Events</li>
            <li>Food</li>
            <li>Information</li>
            <li><Link to="/home/fee" style={{ textDecoration: 'none', color: 'inherit' }}>Fees</Link></li>
          </ul>
        </nav>
        <div className="content">
          <Outlet /> {/* This is where nested routes will be rendered */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
