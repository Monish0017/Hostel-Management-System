import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
              Student Profile
            </li>
            <li
              className={activeComponent === 'IVRS' ? 'active' : ''}
              onClick={() => handleSidebarClick('IVRS')}
            >
              IVRS
            </li>
            <li
              className={activeComponent === 'Room' ? 'active' : ''}
              onClick={() => handleSidebarClick('Room')}
            >
              Room
            </li>
            <li
              className={activeComponent === 'Events' ? 'active' : ''}
              onClick={() => handleSidebarClick('Events')}
            >
              Events
            </li>
            <li
              className={activeComponent === 'Food' ? 'active' : ''}
              onClick={() => handleSidebarClick('Food')}
            >
              Food
            </li>
            <li
              className={activeComponent === 'Information' ? 'active' : ''}
              onClick={() => handleSidebarClick('Information')}
            >
              Information
            </li>
            <li
              className={activeComponent === 'Fee' ? 'active' : ''}
              onClick={() => handleSidebarClick('Fee')}
            >
              Fees
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
