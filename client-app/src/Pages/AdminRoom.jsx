import React, { useState, useEffect } from 'react';
import './CSS/AdminRoom.css';

const AdminRoom = () => {
  const serverBaseUrl = 'https://hostel-management-system-api-46-4gf7yz7n1.vercel.app'; // Adjust based on your server's URL
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
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [showManualAssignmentForm, setShowManualAssignmentForm] = useState(false);
  const [manualAssignment, setManualAssignment] = useState({
    rollNo: '',
    blockName: '',
    roomNo: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${serverBaseUrl}/admin/rooms`, {
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
    setShowAddRoomForm(false);
    setShowManualAssignmentForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = () => {
    setShowAddRoomForm(true);
    setSelectedRoom(null);
    setNewRoom({
      hostelName: '',
      blockName: '',
      roomNo: '',
      floor: '',
      roomType: '',
      capacity: '',
    });
    setShowManualAssignmentForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = `${serverBaseUrl}/admin/add-room`;

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

  const handleManualAssignRoom = async (e) => {
    e.preventDefault();

    // Debugging output to verify state before sending
    console.log('Manual Assignment:', manualAssignment);

    const { rollNo, blockName, roomNo } = manualAssignment;

    if (!rollNo || !blockName || !roomNo) {
      alert("All fields are required for manual assignment.");
      return; // Prevent sending if any field is empty
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${serverBaseUrl}/admin/assign-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(manualAssignment),
      });

      const data = await response.json();
      alert(data.message || 'Student assigned successfully');
      fetchRooms();
      resetManualAssignmentForm(); // Reset manual assignment fields
    } catch (error) {
      console.error('Error assigning student manually:', error);
      alert('Failed to assign student');
    }
  };

  const resetManualAssignmentForm = () => {
    setManualAssignment({ rollNo: '', blockName: '', roomNo: '' }); // Reset fields
    setShowManualAssignmentForm(false); // Hide form after submission
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${serverBaseUrl}/admin/rooms/${roomId}`, {
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

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setShowAddRoomForm(false);
    setShowManualAssignmentForm(false);
  };

  const handleRemoveStudentFromRoom = async (studentRollNo) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${serverBaseUrl}/admin/remove-student-from-room`, {
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

  const handleManualAssignmentChange = (e) => {
    const { name, value } = e.target;
    setManualAssignment({ ...manualAssignment, [name]: value });
  };

  return (
    <div className="room-allocation-container">
      <div className="top-right-button">
        <button
          className="manual-assign-btn"
          onClick={() => {
            setShowManualAssignmentForm(!showManualAssignmentForm);
            setShowAddRoomForm(false); // Hide add room form when showing manual assignment
            if (showManualAssignmentForm) {
              resetManualAssignmentForm(); // Reset form if switching back to show
            }
          }}
        >
          Manual Assignment of Room
        </button>
      </div>

      <h2>Room Allocation</h2>

      {!selectedRoom && !showAddRoomForm && !showManualAssignmentForm ? (
        <>
          <div className="room-actions">
            <button className="action-btn" onClick={handleAddRoom}>
              Add Room
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

          <h4>Students:</h4>
          {selectedRoom.students && selectedRoom.students.length > 0 ? (
            <ul>
              {selectedRoom.students.map((student) => (
                <li key={student}>
                  {student}
                  <button className="remove-btn" onClick={() => handleRemoveStudentFromRoom(student)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No students in this room.</p>
          )}

          <div className="room-details-actions">
            <button className="delete-btn" onClick={() => handleDeleteRoom(selectedRoom._id)}>
              Delete Room
            </button>
          </div>
        </div>
      ) : showAddRoomForm ? (
        <div className="room-form">
          <button className="back-btn" onClick={handleBackToRooms}>
            Back to Rooms
          </button>
          <h3>{isEditing ? 'Edit Room' : 'Add Room'}</h3>
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
              type="number"
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
            <button type="submit" className="submit-btn">
              {isEditing ? 'Update Room' : 'Add Room'}
            </button>
          </form>
        </div>
      ) : (
        showManualAssignmentForm && (
          <div className="manual-assignment-form">
            <button className="back-btn" onClick={handleBackToRooms}>
              Back to Rooms
            </button>
            <h3>Manual Room Assignment</h3>
            <form onSubmit={handleManualAssignRoom}>
              <input
                type="text"
                name="rollNo"
                value={manualAssignment.rollNo}
                placeholder="Student Roll Number"
                onChange={handleManualAssignmentChange}
                required
              />
              <input
                type="text"
                name="blockName"
                value={manualAssignment.blockName}
                placeholder="Block Name"
                onChange={handleManualAssignmentChange}
                required
              />
              <input
                type="text"
                name="roomNo"
                value={manualAssignment.roomNo}
                placeholder="Room Number"
                onChange={handleManualAssignmentChange}
                required
              />
              <button type="submit" className="submit-btn">
                Assign Room
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
};

export default AdminRoom;
