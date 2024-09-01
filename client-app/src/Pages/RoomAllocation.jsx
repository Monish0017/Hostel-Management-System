import React, { useState } from 'react';
import './CSS/RoomAllocation.css';

const RoomAllocation = ()=> {
  const [studentName, setStudentName] = useState('');
  const [selectedRoomCapacity, setSelectedRoomCapacity] = useState('');
  const [roommatePreferences, setRoommatePreferences] = useState([]);
  const [priorityStatus, setPriorityStatus] = useState('Normal'); // Placeholder status, can be dynamic
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoomSelection = (capacity) => {
    setSelectedRoomCapacity(capacity);
    
    // Adjust roommate preferences array length based on room capacity (minus 1 for the current user)
    const numRoommates = parseInt(capacity) - 1;
    const newRoommatePreferences = Array(numRoommates).fill('');
    setRoommatePreferences(newRoommatePreferences);
  };

  const handleRoommateChange = (index, value) => {
    const updatedRoommates = [...roommatePreferences];
    updatedRoommates[index] = value;
    setRoommatePreferences(updatedRoommates);
  };

  const handleSubmit = () => {
    if (!studentName) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!selectedRoomCapacity) {
      setErrorMessage('Please select a room capacity.');
      return;
    }

    const allocationData = {
      studentName,
      roomCapacity: selectedRoomCapacity,
      roommatePreferences: roommatePreferences.length > 0 ? roommatePreferences : ['Random'],
      priorityStatus
    };

    // Simulate API call to allocate room (replace with actual API call)
    console.log('Submitting Room Allocation:', allocationData);
    setSuccessMessage('Room allocated successfully.');
    setErrorMessage('');
  };

  return (
    <div className="container1 mt-5">
      <h2>Room Allocation</h2>
      <p>Priority Status: {priorityStatus}</p>

      <div className="form-group1">
        <label>Student Name:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
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
}

export default RoomAllocation;