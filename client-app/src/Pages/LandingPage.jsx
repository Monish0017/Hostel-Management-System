import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/LandingPage.css'; // You can add styles here

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-page">
        <h1>Welcome to  Hostel Management System</h1>
        <div className="button-container">
          <button onClick={() => navigate('/login')} className="btn">
            Login as Student
          </button>
          <button onClick={() => navigate('/adminLogin')} className="btn">
            Login as Admin
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
