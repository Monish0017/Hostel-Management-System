import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import Fee from './Fee';
import './CSS/StudentHome.css';

const StudentHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('StudentProfile');

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'StudentProfile':
        return <StudentProfile />;
      case 'Fee':
        return <Fee />;
      // Add more cases for other components if needed
      default:
        return <StudentProfile />;
    }
  };

  return (
    <div className="container">
      <div className="main1">
        <nav className="sidebar">
          <ul>
            <li
              className={activeComponent === 'StudentProfile' ? 'active' : ''}
              onClick={() => handleSidebarClick('StudentProfile')}
            >
              <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Student Profile</Link>
            </li>
            <li>IVRS</li>
            <li>Room</li>
            <li>Events</li>
            <li>Food</li>
            <li>Information</li>
            <li
              className={activeComponent === 'Fee' ? 'active' : ''}
              onClick={() => handleSidebarClick('Fee')}
            >
              <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Fees</Link>
            </li>
          </ul>
          <button
            className="logout-button"
            onClick={() => navigate('/login')}
          >
            Log out
          </button>
        </nav>
        <div className="content">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
