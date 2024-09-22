import React, { useState, useEffect } from 'react';
import './CSS/AdminRoom.css';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    hostelName: '',
    blockName: '',
    roomNo: '',
    floor: '',
    roomType: '',
    capacity: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [studentRollNo, setStudentRollNo] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/admin/rooms', {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsEditing(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = () => {
    setIsEditing(true);
    setNewRoom({
      hostelName: '',
      blockName: '',
      roomNo: '',
      floor: '',
      roomType: '',
      capacity: '',
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditing && selectedRoom) {
      await fetch(`/api/admin/rooms/${selectedRoom.roomNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(newRoom),
      });
      fetchRooms();
    } else {
      await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(newRoom),
      });
      fetchRooms();
    }
    setIsEditing(false);
    setSelectedRoom(null);
  };

  const handleAssignRoom = async () => {
    try {
      await fetch('/api/admin/assign-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          studentRollNo,
          blockName: selectedRoom.blockName,
          roomNo: selectedRoom.roomNo,
        }),
      });
      alert('Student assigned successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error assigning room:', error);
      alert('Failed to assign student');
    }
  };

  const handleRemoveStudent = async (studentRollNo) => {
    try {
      await fetch('/api/admin/remove-student-from-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ studentRollNo }),
      });
      alert('Student removed successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student');
    }
  };

  const handleDeleteRoom = async (room) => {
    try {
      await fetch(`/api/admin/rooms/${room.roomNo}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      fetchRooms();
      setSelectedRoom(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div className="room-allocation-container">
      <div className="top-right-button">
        <button className="view-application-btn">View Application Forms</button>
      </div>

      <h2>Room Allocation</h2>
      <div className="room-actions">
        <button className="action-btn" onClick={handleAddRoom}>Add Room</button>
        <button className="action-btn" onClick={() => setIsEditing(false)}>Allocate Room (Based on Application)</button>
      </div>

      {selectedRoom ? (
        <div className="room-details">
          <h3>Room Details</h3>
          <p>Hostel Name: {selectedRoom.hostelName}</p>
          <p>Block Name: {selectedRoom.blockName}</p>
          <p>Room No: {selectedRoom.roomNo}</p>
          <p>Floor: {selectedRoom.floor}</p>
          <p>Room Type: {selectedRoom.roomType}</p>
          <p>Capacity: {selectedRoom.capacity}</p>

          <h4>Students in this room:</h4>
          <ul>
            {selectedRoom.students.map((student) => (
              <li key={student.rollNo}>
                {student.fullName} ({student.rollNo})
                <button onClick={() => handleRemoveStudent(student.rollNo)}>Remove Student</button>
              </li>
            ))}
          </ul>

          <div className="room-details-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Modify</button>
            <button className="delete-btn" onClick={() => handleDeleteRoom(selectedRoom)}>Delete</button>
          </div>

          <h4>Assign Student to this room</h4>
          <input
            type="text"
            placeholder="Student Roll No"
            value={studentRollNo}
            onChange={(e) => setStudentRollNo(e.target.value)}
          />
          <button onClick={handleAssignRoom}>Assign Room</button>
        </div>
      ) : (
        <div className="room-grid">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <div key={index} className="room-box" onClick={() => handleRoomClick(room)}>
                <p>{room.hostelName}</p>
                <p>{room.blockName}</p>
                <p>Room No: {room.roomNo}</p>
              </div>
            ))
          ) : (
            <p>No rooms available</p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleFormSubmit} className="room-form">
          <input
            type="text"
            name="hostelName"
            placeholder="Hostel Name"
            value={newRoom.hostelName}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="blockName"
            placeholder="Block Name"
            value={newRoom.blockName}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="roomNo"
            placeholder="Room No"
            value={newRoom.roomNo}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="floor"
            placeholder="Floor"
            value={newRoom.floor}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="roomType"
            placeholder="Room Type (Single/Double/Triple)"
            value={newRoom.roomType}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={newRoom.capacity}
            onChange={handleFormChange}
            required
          />
          <button type="submit" className="submit-btn">
            {selectedRoom ? 'Update Room' : 'Add Room'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default RoomAllocation;
