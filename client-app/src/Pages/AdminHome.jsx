import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDetails from './StudentDetails';
import './CSS/StudentHome.css'; 
import AdminFood from './AdminFood';
import AdminRoom from './AdminRoom';

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Details');

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Details':
        return <StudentDetails />;
      case 'Room':
        return <AdminRoom />;
      case 'AFood':
        return <AdminFood />;
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
              className={activeComponent === 'Details' ? 'active' : ''}
              onClick={() => handleSidebarClick('Details')}
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
              className={activeComponent === 'AFood' ? 'active' : ''}
              onClick={() => handleSidebarClick('AFood')}
            >
              Food Token
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
