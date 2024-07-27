import React, { useState, useEffect } from 'react';

const ApplicationPage = () => {
  const [preferredRoommates, setPreferredRoommates] = useState('');
  const [roomType, setRoomType] = useState('four-seater');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch the list of students to populate the roommate selection
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:3000/students/profile');
      const data = await response.json();
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const preferredRoommatesArray = preferredRoommates.split(',').map(rollNo => rollNo.trim());

    if (roomType === 'three-seater' && preferredRoommatesArray.length > 2) {
      alert('You can select up to 2 preferred roommates for a three-seater room.');
      return;
    }

    if (roomType === 'four-seater' && preferredRoommatesArray.length > 3) {
      alert('You can select up to 3 preferred roommates for a four-seater room.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ preferredRoommates: preferredRoommatesArray, roomType })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      alert('Application submitted successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting application');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Room Preference Form</h2>

      <label>
        Room Type:
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="three-seater">Three-Seater</option>
          <option value="four-seater">Four-Seater</option>
        </select>
      </label>

      <label>
        Preferred Roommates (Enter Roll Numbers):
        <input
          type="text"
          value={preferredRoommates}
          onChange={(e) => setPreferredRoommates(e.target.value)}
          placeholder="Enter roll numbers separated by commas"
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ApplicationPage;
