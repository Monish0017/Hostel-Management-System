import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDetails from './StudentDetails';
import AdminRoomAllocation from './AdminRoomAllocation';
import AdminFood from './AdminFood'; // Import the new AdminFood component
import './CSS/StudentHome.css'; // Ensure the correct relative path

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('StudentDetails');

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'StudentDetails':
        return <StudentDetails />;
      case 'Room':
        return <AdminRoomAllocation />;
      case 'AdminFood': // Add case for AdminFood
        return <AdminFood />;
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
            <li
              className={activeComponent === 'AdminFood' ? 'active' : ''}
              onClick={() => handleSidebarClick('AdminFood')}
            >
              Food
            </li>
          </ul>
          <button
            className="logout-button"
            onClick={() => navigate('/')}
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
