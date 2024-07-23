import React, { useState, useEffect } from 'react';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');

  useEffect(() => {
    // Fetch available rooms from the backend
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ roomId: selectedRoom })
      });

      if (!response.ok) {
        throw new Error('Failed to apply for room');
      }

      alert('Room application submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  };

  return (
    <div>
      <h1>Room Allocation</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Room:
          <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} required>
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                Room {room.roomNumber} - {room.capacity} Capacity
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Apply for Room</button>
      </form>
    </div>
  );
};

export default RoomAllocation;
