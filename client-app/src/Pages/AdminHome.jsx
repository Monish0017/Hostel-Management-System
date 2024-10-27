// src/components/AdminHome.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDetails from './StudentDetails';
import EmployeeDetails from './EmployeeDetails';
import AdminRoom from './AdminRoom';
import AdminFood from './AdminFood';
import StudentApplication from './StudentApplication';
import AdminComplaint from './AdminComplaint';
import AdminBilling from './AdminBilling'; // Import AdminBilling component
import './CSS/StudentHome.css'; // Ensure the correct relative path

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
      case 'EmployeeDetails': 
        return <EmployeeDetails />;
      case 'Room':
        return <AdminRoom />;
      case 'AFood':
        return <AdminFood />;
      case 'Apply':
        return <StudentApplication />;
      case 'Complaint':
        return <AdminComplaint />;
      case 'Billing': // Add case for AdminBilling
        return <AdminBilling />;
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
              className={activeComponent === 'EmployeeDetails' ? 'active' : ''}
              onClick={() => handleSidebarClick('EmployeeDetails')}
            >
              Employee Details
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
            <li
              className={activeComponent === 'Apply' ? 'active' : ''}
              onClick={() => handleSidebarClick('Apply')}
            >
              Application
            </li>
            <li
              className={activeComponent === 'Complaint' ? 'active' : ''}
              onClick={() => handleSidebarClick('Complaint')}
            >
              Suggestions
            </li>
            <li
              className={activeComponent === 'Billing' ? 'active' : ''} // Add Billing section
              onClick={() => handleSidebarClick('Billing')}
            >
              Billing
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
