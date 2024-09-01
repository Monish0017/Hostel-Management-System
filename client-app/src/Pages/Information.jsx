import React, { useState, useEffect } from 'react';
import './CSS/Information.css'; 
import profile from '../assets/profile.jpg'; // Placeholder image for details

const Information = () => {
  const [wardens, setwardens] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [view, setView] = useState('wardens'); // Toggle between 'wardens' and 'faculty'

  useEffect(() => {
    fetch('/warden.json')
      .then(response => response.json())
      .then(data => setwardens(data))
      .catch(error => console.error('Error fetching warden data:', error));
    
    fetch('/faculty.json')
      .then(response => response.json())
      .then(data => setFaculty(data))
      .catch(error => console.error('Error fetching faculty data:', error));
  }, []);

  const handleWardenClick = (warden) => {
    setSelectedWarden(warden);
    setView('wardens');
  };

  const handleFacultyClick = (faculty) => {
    setSelectedFaculty(faculty);
    setView('faculty');
  };

  const handleBack = () => {
    setSelectedWarden(null);
    setSelectedFaculty(null);
  };

  return (
    <div className="details">
      {selectedWarden || selectedFaculty ? (
        <div className="details-header">
          <h2>{selectedWarden ? 'Warden Details' : 'Faculty Details'}</h2>
          <button onClick={handleBack} className="back-button">Back</button>
        </div>
      ) : (
        <div className="view-toggle">
          <button onClick={() => setView('wardens')} className={`toggle-button ${view === 'wardens' ? 'active' : ''}`}>Warden Details</button>
          <button onClick={() => setView('faculty')} className={`toggle-button ${view === 'faculty' ? 'active' : ''}`}>Faculty Details</button>
        </div>
      )}

      {view === 'wardens' && !selectedWarden && (
        <div className="details-grid">
          {wardens.length > 0 ? (
            wardens.map((warden, index) => (
              <div key={index} className="details-box" onClick={() => handleWardenClick(warden)}>
                <img src={profile} alt="Profile" className="profile-picture" />
                <p>Name: {warden.name}</p>
                <p>Supervising: {warden.handling}</p>
              </div>
            ))
          ) : (
            <p>No warden found</p>
          )}
        </div>
      )}

      {view === 'faculty' && !selectedFaculty && (
        <div className="details-grid">
          {faculty.length > 0 ? (
            faculty.map((member, index) => (
              <div key={index} className="details-box" onClick={() => handleFacultyClick(member)}>
                <img src={profile} alt="Profile" className="profile-picture" />
                <p>Name: {member.name}</p>
                <p>Supervising: {member.handling}</p>
              </div>
            ))
          ) : (
            <p>No faculty found</p>
          )}
        </div>
      )}

      {selectedWarden && (
        <div className="details-info">
            <p>Name: {selectedWarden.name}</p>
            <p>Phone No: {selectedWarden.phone}</p>
            <p>Block No: {selectedWarden.block}</p>
            <p>Supervising: {selectedWarden.handling}</p>
        </div>
      )}

      {selectedFaculty && (
        <div className="details-info">
            <p>Name: {selectedFaculty.name}</p>
            <p>Phone No: {selectedFaculty.phone}</p>
            <p>Block No: {selectedFaculty.block}</p>
            <p>Supervising: {selectedFaculty.handling}</p>
        </div>
      )}
    </div>
  );
};

export default Information;
