import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const userType = location.state?.userType || 'Guest';

  return (
    <div>
      <h1>{userType} Dashboard</h1>
      <p>Welcome to the {userType} dashboard!</p>
    </div>
  );
};

export default Dashboard;
