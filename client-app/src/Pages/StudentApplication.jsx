import React from 'react';
import './CSS/StudentApplication.css';
import profile from '../assets/profile.jpg';


const StudentApplication = () => {
  return (
    <div className="student-app-container">
      <h1>Student Application</h1>
      <div className="button-group">
        <button className="confirm-button">Confirm Student</button>
        <button className="delete-button">Delete Student</button>
      </div>
      <div className="student-grid">
              <div className="student-box">
                <img src={profile} alt="Profile" className="profile-picture"/>
                <p>Full Name: Monish</p>
                <p>Roll No: 22z240</p>
              </div>
              <div className="student-box">
                <img src={profile} alt="Profile" className="profile-picture"/>
                <p>Full Name: Kabhinya</p>
                <p>Roll No: 22z229</p>
              </div>
        </div>
    </div>
  );
}

export default StudentApplication;
