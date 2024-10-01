import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/LandingPage.css'; // You can add styles here

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-page">
        <h1>Welcome to PSG Tech Hostels</h1>
        <h3>Home Away From Home!</h3>
        <div className="button-container">
          <button onClick={() => navigate('/login')} className="btn">
            Student
          </button>
          <button onClick={() => navigate('/adminLogin')} className="btn">
            Admin
          </button>
        </div>
      </div>

        <div className="top-buttons">
          <button onClick={() => navigate('/apply')} className="top-btn1">
            Student Application
          </button>
          <button onClick={() => navigate('/fee')} className="top-btn2">
            Make Payment
          </button>
        </div>
    </>
  );
};

export default LandingPage;
