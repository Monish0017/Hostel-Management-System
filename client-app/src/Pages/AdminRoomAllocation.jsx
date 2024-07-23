import React, { useState, useEffect } from 'react';

const AdminRoomAllocation = () => {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    // Fetch current allocations or room statuses from the backend
    const fetchAllocations = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/allocations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAllocations(data);
      } catch (error) {
        console.error('Error fetching allocations:', error);
      }
    };

    fetchAllocations();
  }, []);

  const handleAllocateRooms = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/allocate-rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to allocate rooms');
      }

      const data = await response.json();
      alert('Rooms allocated successfully');
      setAllocations(data); // Update the state with the new allocations
    } catch (error) {
      console.error('Error allocating rooms:', error);
      alert('Failed to allocate rooms');
    }
  };

  return (
    <div>
      <h1>Admin Room Allocation</h1>
      <button onClick={handleAllocateRooms}>Allocate Rooms</button>
      <h2>Current Allocations</h2>
      <ul>
        {allocations.map((allocation) => (
          <li key={allocation.studentId}>
            Student: {allocation.studentName} - Room: {allocation.roomNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRoomAllocation;
