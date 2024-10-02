// src/components/StudentHome.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import Information from './Information';
import RoomAllocation from './RoomAllocation';
import FoodTokenPage from './FoodTokenPage';
import StudentComplaint from './StudentComplaint'; // Import StudentComplaint component
import './CSS/StudentHome.css';

const StudentHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState('StudentProfile');

  useEffect(() => {
    const path = location.pathname.split('/').pop(); // Get the last part of the path
    switch (path) {
      case 'fee':
        setActiveComponent('Fee');
        break;
      case 'ivrs':
        setActiveComponent('IVRS');
        break;
      case 'information':
        setActiveComponent('Information');
        break;
      case 'room-allocation':
        setActiveComponent('Room');
        break;
      case 'food-tokens':
        setActiveComponent('Food');
        break;
      case 'complaint':
        setActiveComponent('Complaint'); // Add case for Complaint
        break;
      default:
        setActiveComponent('StudentProfile');
        break;
    }
  }, [location.pathname]);

  const handleSidebarClick = (component, path) => {
    setActiveComponent(component);
    navigate(path); // Navigate to the respective route
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'StudentProfile':
        return <StudentProfile />;
      case 'Information':
        return <Information />;
      case 'Room':
        return <RoomAllocation />;
      case 'Food':
        return <FoodTokenPage />;
      case 'Complaint':
        return <StudentComplaint />; // Render StudentComplaint component
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
              className={activeComponent === 'StudentProfile' ? 'active' : ''}
              onClick={() => handleSidebarClick('StudentProfile')}
            >
              Student Profile
            </li>
            <li
              className={activeComponent === 'Room' ? 'active' : ''}
              onClick={() => handleSidebarClick('Room')}
            >
              Room
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
              className={activeComponent === 'Complaint' ? 'active' : ''} // Add Complaint to sidebar
              onClick={() => handleSidebarClick('Complaint')}
            >
              Complaint Management
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

export default StudentHome;
