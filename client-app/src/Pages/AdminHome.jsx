import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDetails from './StudentDetails';
import './CSS/StudentHome.css'; // Ensure the correct relative path

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('');

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'StudentDetails':
        return <StudentDetails />;
      // Add more cases for other components if needed
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="main1">
        <nav className="sidebar">
          <ul>
            <li
              className={activeComponent === 'StudentDetails' ? 'active' : ''}
              onClick={() => handleSidebarClick('StudentDetails')}
            >
              Student Details
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
          </ul>
          <button
            className="logout-button"
            onClick={() => navigate('/adminLogin')}
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

export default AdminHome;