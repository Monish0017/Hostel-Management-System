import React, { useState, useEffect } from 'react';
import './CSS/StudentDetails.css'; 
import profile from '../assets/profile.jpg';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/students.json')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching student data:', error));
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = () => {
    // Logic for adding a new student
  };

  const handleEditStudent = (student) => {
    // Logic for editing the selected student
  };

  const handleDeleteStudent = (student) => {
    // Logic for deleting the selected student
  };

  const filteredStudents = students.filter(student =>
    student.rollNo.toString().includes(searchTerm)
  );

  return (
    <div>
      {!selectedStudent ? (
        <>
          <h2>Student List</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Roll No"
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            <button onClick={handleAddStudent} className="add-button">Add</button>
          </div>
        </>
      ) : (
        <div className="student-details-header">
          <h2>Student Details</h2>
          <div>
            <button onClick={() => handleEditStudent(selectedStudent)}>Edit</button>
            <button onClick={() => handleDeleteStudent(selectedStudent)}>Delete</button>
          </div>
        </div>
      )}
      {selectedStudent ? (
        <div className="student-details">
          <p>Name: {selectedStudent.name}</p>
          <p>Roll No: {selectedStudent.rollNo}</p>
          <p>Fee Paid: {selectedStudent.feePaid ? 'Yes' : 'No'}</p>
          <p>Room No: {selectedStudent.roomNo}</p>
          <button onClick={() => setSelectedStudent(null)}>Back to List</button>
        </div>
      ) : (
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
