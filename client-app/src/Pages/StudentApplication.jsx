import React from 'react';
import './CSS/StudentApplication.css';

const StudentApplication = () => {
  return (
    <div className="student-app-container">
      <h1>Student Application</h1>
      <div className="button-group">
        <button className="confirm-button">Confirm Student</button>
        <button className="delete-button">Delete Student</button>
      </div>
    </div>
  );
}

export default StudentApplication;
