import React, { useState } from 'react';
import './CSS/RoomAllocation.css';

const RoomAllocation = () => {
  const [selectedRoomCapacity, setSelectedRoomCapacity] = useState('');
  const [blockName, setBlockName] = useState(''); // Block name state
  const [roommatePreferences, setRoommatePreferences] = useState([]);
  const [priorityStatus, setPriorityStatus] = useState('Normal');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoomSelection = (capacity) => {
    setSelectedRoomCapacity(capacity);
    const numRoommates = parseInt(capacity) - 1;
    const newRoommatePreferences = Array(numRoommates).fill('');
    setRoommatePreferences(newRoommatePreferences);
  };

  const handleRoommateChange = (index, value) => {
    const updatedRoommates = [...roommatePreferences];
    updatedRoommates[index] = value;
    setRoommatePreferences(updatedRoommates);
  };

  const handleSubmit = async () => {
    if (!selectedRoomCapacity) {
      setErrorMessage('Please select a room capacity.');
      return;
    }

    if (!blockName) {
      setErrorMessage('Please select a block.');
      return;
    }

    const allocationData = {
      preferredRoommatesRollNos: roommatePreferences.length > 0 ? roommatePreferences : ['Random'],
      roomType: selectedRoomCapacity,
      blockName,
      priorityStatus,
    };

    try {
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage
      const response = await fetch('http://localhost:3000/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send token in the x-auth-token header
        },
        body: JSON.stringify(allocationData),
      });

      if (response.ok) {
        setSuccessMessage('Room application Submitted successfully.');
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error allocating room.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="container1 mt-5">
      <h2>Room Allocation</h2>
      <p>Priority Status: {priorityStatus}</p>

      <div className="form-group1">
        <label>Select Block:</label>
        <select
          className="form-control"
          value={blockName}
          onChange={(e) => setBlockName(e.target.value)}
        >
          <option value="">-- Select Block --</option>
          <option value="Block 1">Block 1</option>
          <option value="Block 2">Block 2</option>
          <option value="Block 3">Block 3</option>
          <option value="Block 4">Block 4</option>
        </select>
      </div>

      <div className="form-group1">
        <label>Select Room Capacity:</label>
        <select
          className="form-control"
          value={selectedRoomCapacity}
          onChange={(e) => handleRoomSelection(e.target.value)}
        >
          <option value="">-- Select Room Capacity --</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
        </select>
      </div>

      {roommatePreferences.length > 0 && (
        <div className="form-group1 mt-3">
          <label>Enter Roommate Preferences:</label>
          {roommatePreferences.map((preference, index) => (
            <input
              key={index}
              type="text"
              className="form-control mt-2"
              value={preference}
              onChange={(e) => handleRoommateChange(index, e.target.value)}
            />
          ))}
        </div>
      )}

      <button className="btn1 btn-primary mt-3" onClick={handleSubmit}>
        Allocate Room
      </button>

      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </div>
  );
};

export default RoomAllocation;
