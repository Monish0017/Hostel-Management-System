import React, { useState, useEffect } from 'react';
import './CSS/StudentDetails.css'; 
import profile from '../assets/profile.jpg';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    feePaid: false,
    blockNo: '',
    roomNo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/students.json')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching student data:', error));
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = () => {
    setIsEditing(true);
    setSelectedStudent(null);
    setNewStudent({
      name: '',
      rollNo: '',
      feePaid: false,
      blockNo: '',
      roomNo: ''
    });
  };

  const handleEditStudent = (student) => {
    setIsEditing(true);
    setNewStudent(student);
  };

  const handleDeleteStudent = (student) => {
    const updatedStudents = students.filter(s => s.rollNo !== student.rollNo);
    setStudents(updatedStudents);
    setSelectedStudent(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedStudent) {
      const updatedStudents = students.map(s => 
        s.rollNo === selectedStudent.rollNo ? newStudent : s
      );
      setStudents(updatedStudents);
    } else {
      setStudents([...students, newStudent]);
    }
    setIsEditing(false);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(student =>
    student.rollNo.toString().includes(searchTerm)
  );

  return (
    <div>
      {!isEditing && !selectedStudent ? (
        <>
          <h2>Students List</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Roll No"
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            <button className="add-btn" onClick={handleAddStudent}>Add</button>
          </div>
        </>
      ) : null}

      {selectedStudent && !isEditing ? (
        <div className="student-details-header">
          <h2>Student Details</h2>
          <div>
            <button className='btn-det' onClick={() => handleEditStudent(selectedStudent)}>Edit</button>
            <button className='btn-det' onClick={() => handleDeleteStudent(selectedStudent)}>Delete</button>
          </div>
        </div>
      ) : null}

      {!isEditing && selectedStudent ? (
        <div className="student-details">
          <p>Name: {selectedStudent.name}</p>
          <p>Roll No: {selectedStudent.rollNo}</p>
          <p>Fee Paid: {selectedStudent.feePaid ? 'Yes' : 'No'}</p>
          <p>Block No: {selectedStudent.blockNo}</p>
          <p>Room No: {selectedStudent.roomNo}</p>
          <button className="back-btn" onClick={() => setSelectedStudent(null)}>Back to List</button>
        </div>
      ) : null}

      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="student-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newStudent.name}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="rollNo"
            placeholder="Roll No"
            value={newStudent.rollNo}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="blockNo"
            placeholder="Block No"
            value={newStudent.blockNo}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="roomNo"
            placeholder="Room No"
            value={newStudent.roomNo}
            onChange={handleFormChange}
            required
          />
          <label>
            <input
              type="checkbox"
              name="feePaid"
              checked={newStudent.feePaid}
              onChange={handleFormChange}
            />
            Fee Paid
          </label>
          <button type="submit">{selectedStudent ? 'Update' : 'Add'} Student</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : null}

      {!selectedStudent && !isEditing && (
        <div className="student-grid">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <div key={index} className="student-box" onClick={() => handleStudentClick(student)}>
                <img src={profile} alt="Profile" className="profile-picture" />
                <p>{student.name}</p>
                <p>Roll No: {student.rollNo}</p>
              </div>
            ))
          ) : (
            <p>No student found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDetails;