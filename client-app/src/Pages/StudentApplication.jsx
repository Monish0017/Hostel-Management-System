import React, { useEffect, useState } from 'react';
import './CSS/StudentApplication.css';
import profile from '../assets/profile.jpg';

const StudentApplication = () => {
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch student applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${serverBaseUrl}/application/getstudent`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'), // Assuming you have token stored in localStorage
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data.applications); // Update state with fetched applications
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplications();
  }, []);

  const handleConfirmAll = async () => {
    try {
      const response = await fetch(`${serverBaseUrl}/application/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to confirm students');
      }
  
      const data = await response.json();
  
      // Ensure confirmedRollNos is defined and is an array
      const confirmedRollNos = data.confirmedRollNos || [];
  
      setSuccessMessage(data.message);
  
      // Refetch applications to update the UI
      setApplications((prevApplications) => 
        prevApplications.filter(app => !confirmedRollNos.includes(app.rollNo))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteUnpaid = async () => {
    try {
      const response = await fetch(`${serverBaseUrl}/application/cleanup`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete unpaid applications');
      }
  
      const data = await response.json();
  
      // Ensure deletedRollNos is defined and is an array
      const deletedRollNos = data.deletedRollNos || [];
  
      setSuccessMessage(data.message);
  
      // Refetch applications to update the UI
      setApplications((prevApplications) => 
        prevApplications.filter(app => !deletedRollNos.includes(app.rollNo))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="student-app-container">
      <h1>Student Applications</h1>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <div className="student-grid">
        {applications.length === 0 ? (
          <p>No student applications found</p>
        ) : (
          applications.map((application) => (
            <div key={application.rollNo} className="student-box">
              <img src={application.image} alt={profile} className="profile-picture" />
              <div className="student-info">
              <p>Full Name: {application.fullName}</p>
              <p>Roll No: {application.rollNo}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="button-group">
        <button className="confirm-button" onClick={handleConfirmAll}>
          Confirm All Paid Students
        </button>
        <button className="delete-button" onClick={handleDeleteUnpaid}>
          Delete All Unpaid Applications
        </button>
      </div>
    </div>
  );
};

export default StudentApplication;
