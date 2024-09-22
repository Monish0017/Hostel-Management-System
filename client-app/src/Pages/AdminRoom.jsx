import React, { useState, useEffect } from 'react';
import './CSS/AdminRoom.css';

const AdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [applications, setApplications] = useState([]);
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
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);

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

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/admin/applications', {
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
      setApplications(data);
      setShowApplications(true);
      setShowAddRoomForm(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsEditing(false);
    setShowAddRoomForm(false);
    setShowApplications(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = () => {
    setShowAddRoomForm(true);
    setSelectedRoom(null);
    setShowApplications(false);
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
    const url = 'http://localhost:3000/admin/add-room';

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(newRoom),
      });
      fetchRooms();
      setShowAddRoomForm(false);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleAssignRoom = async (rollNo, applicationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/admin/assign-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          studentRollNo: rollNo,
          applicationId,
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
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/admin/remove-student-from-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
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

  const handleDeleteRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      fetchRooms();
      setSelectedRoom(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleVacateAllRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/admin/rooms/vacate-all', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
      });
      alert('All rooms vacated successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error vacating rooms:', error);
      alert('Failed to vacate rooms');
    }
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setShowAddRoomForm(false);
    setShowApplications(false);
  };

  return (
    <div className="room-allocation-container">
      <div className="top-right-button">
        <button className="view-application-btn" onClick={fetchApplications}>
          View Application Forms
        </button>
      </div>

      <h2>Room Allocation</h2>

      {!selectedRoom && !showAddRoomForm && !showApplications ? (
        <>
          <div className="room-actions">
            <button className="action-btn" onClick={handleAddRoom}>
              Add Room
            </button>
            <button className="action-btn" onClick={fetchApplications}>
              Allocate Room (Based on Application)
            </button>
          </div>

          <div className="room-grid">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div
                  key={room._id}
                  className="room-box"
                  onClick={() => handleRoomClick(room)}
                >
                  <p>{room.hostelName}</p>
                  <p>{room.blockName}</p>
                  <p>Room No: {room.roomNo}</p>
                </div>
              ))
            ) : (
              <p>No rooms available</p>
            )}
          </div>

          {/* "Vacate All Rooms" button at the bottom of the room page */}
          <div className="vacate-all-rooms-section">
            <button className="vacate-all-btn" onClick={handleVacateAllRooms}>
              Vacate All Rooms
            </button>
          </div>
        </>
      ) : selectedRoom ? (
        <div className="room-details">
          <button className="back-btn" onClick={handleBackToRooms}>
            Back to Rooms
          </button>
          <h3>Room Details</h3>
          <p>Hostel Name: {selectedRoom.hostelName}</p>
          <p>Block Name: {selectedRoom.blockName}</p>
          <p>Room No: {selectedRoom.roomNo}</p>
          <p>Floor: {selectedRoom.floor}</p>
          <p>Room Type: {selectedRoom.roomType}</p>
          <p>Capacity: {selectedRoom.capacity}</p>

          <h4>Students in this room:</h4>
          <ul>
            {selectedRoom.students.length > 0 ? (
              selectedRoom.students.map((rollNo) => (
                <li key={rollNo}>
                  {rollNo}
                  <button onClick={() => handleRemoveStudent(rollNo)}>
                    Remove Student
                  </button>
                </li>
              ))
            ) : (
              <p>No students in this room.</p>
            )}
          </ul>
          <div className="room-details-actions">
            <button className="delete-btn" onClick={() => handleDeleteRoom(selectedRoom._id)}>
              Delete Room
            </button>
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
      ) : showAddRoomForm ? (
        <div className="room-form">
          <button className="back-btn" onClick={handleBackToRooms}>
            Back to Rooms
          </button>
          <h3>{isEditing ? 'Modify Room' : 'Add Room'}</h3>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="hostelName"
              value={newRoom.hostelName}
              placeholder="Hostel Name"
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="blockName"
              value={newRoom.blockName}
              placeholder="Block Name"
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="roomNo"
              value={newRoom.roomNo}
              placeholder="Room Number"
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="floor"
              value={newRoom.floor}
              placeholder="Floor"
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="roomType"
              value={newRoom.roomType}
              placeholder="Room Type"
              onChange={handleFormChange}
              required
            />
            <input
              type="number"
              name="capacity"
              value={newRoom.capacity}
              placeholder="Capacity"
              onChange={handleFormChange}
              required
            />
            <button type="submit">{isEditing ? 'Save' : 'Add Room'}</button>
          </form>
        </div>
      ) : showApplications ? (
        <div className="application-form-section">
          <button className="back-btn" onClick={handleBackToRooms}>
            Back to Rooms
          </button>
          <h3>Application Forms</h3>
          {applications.length > 0 ? (
            <div className="application-grid">
              {applications.map((app) => (
                <div key={app._id} className="application-box">
                  <p>Student RollNo: {app.studentRollNo}</p>
                  <p>Room Type: {app.roomType}</p>
                  <p>Block: {app.blockName}</p>
                  <button
                    onClick={() => handleAssignRoom(app.studentRollNo, app._id)}
                  >
                    Allocate Room
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications found</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AdminRoom;
