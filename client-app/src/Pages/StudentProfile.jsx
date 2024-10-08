import React, { useState, useEffect } from 'react';
import './CSS/StudentProfile.css';
import profile from '../assets/profile.jpg';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const serverBaseUrl = 'https://hostel-management-system-api.onrender.com'; // Adjust based on your server's URL

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Verify token retrieval

    if (!token) {
      setError('No token found');
      return;
    }

    try {
      const response = await fetch(`${serverBaseUrl}/student/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Ensure correct token header
        }
      });

      console.log('Response status:', response.status); // Log response status

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profile data:', data); // Log profile data
      setProfileData(data);
    } catch (error) {
      setError(`Error fetching profile: ${error.message}`);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <div className="profile-header">
          <img src={profileData.image || profile} alt="Profile" className="profile-picture" />
          <h2>Hello {profileData.fullName}!</h2>
        </div>
        <div className="profile-details">
          <div className="general-info box">
            <h3>General Information</h3>
            <p><strong>Roll No:</strong> {profileData.rollNo}</p>
            <p><strong>Amount:</strong> {profileData.amount}</p>
            <p><strong>Father's Name:</strong> {profileData.fatherName}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Contact Phone:</strong> {profileData.contactPhone}</p>
            <p><strong>Primary Mobile No:</strong> {profileData.primaryMobileNumber}</p>
            <p><strong>Secondary Mobile No:</strong> {profileData.secondaryMobileNumber}</p>
            <p><strong>Residential Address:</strong> {profileData.residentialAddress}</p>
          </div>
          <div className="academic-info box">
            <h3>Academic Information</h3>
            <p><strong>Programme:</strong> {profileData.programme}</p>
            <p><strong>Class Year:</strong> {profileData.classYear}</p>
          </div>
          <div className="hostel-info box">
            <h3>Hostel Information</h3>
            <p><strong>Block Name:</strong> {profileData.blockName || 'Not Allocated'}</p>
            <p><strong>Room No:</strong> {profileData.roomNo || 'Not Allocated'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
