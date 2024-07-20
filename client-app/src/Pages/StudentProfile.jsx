import React from 'react';

import { useNavigate } from 'react-router-dom';
import './CSS/StudentProfile.css';
import profile from '../assets/profile.jpg'; 

const StudentProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="StudentProfile" >
      <header>
        <h1>PSG Hostel</h1>
      </header>
      <main>
      <aside className="sidebar">
          <nav>
            <ul>
              <li><a href="/academic">Academic</a></li>
            </ul>
          </nav>
        </aside>
        <section className="profile">
          <div className="profile-header">
            <img src={profile} alt="Profile" className="profile-picture" />
            <h2></h2>
          </div>
          <div className="profile-details">
            <div className="general-info">
              <h3>General Information</h3>
              <p><strong>Roll No:</strong> </p>
              <p><strong>Gender:</strong></p>
              <p><strong>Father's Name:</strong>  </p>
              <p><strong>Date Of Birth:</strong> -</p>
              <p><strong>Email:</strong> -</p>
              <p><strong>Student Mobile No:</strong> </p>
              <p><strong>IVR No:</strong> </p>
            </div>
            <div className="academic-info">
              <h3>Academic Information</h3>
              <p><strong>Department:</strong> </p>
              <p><strong>Program:</strong> </p>
              <p><strong>Batch:</strong></p>
              <p><strong>Admission Type:</strong> </p>
              <p><strong>Register No:</strong></p>
            </div>
            <div className="hostel-info">
              <h3>Hostel Information</h3>
              <p><strong>Hostel:</strong> </p>
              <p><strong>Room No:</strong> </p>
              <p><strong>Finger Print ID:</strong> </p>
              <p><strong>Approval No:</strong> </p>
              <p><strong>Language:</strong> </p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 PSG Hostel</p>
      </footer>
    </div>
  );
}

export default StudentProfile;
