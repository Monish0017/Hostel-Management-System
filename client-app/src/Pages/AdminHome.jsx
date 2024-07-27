import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './CSS/StudentHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSidebarClick = (component) => {
    if (component === 'StudentDetails') {
      fetch('/students.json')
        .then(response => response.json())
        .then(data => setStudents(data))
        .catch(error => console.error('Error fetching student data:', error));
    }
    setActiveComponent(component);
    setSelectedStudent(null); // Reset selected student when switching components
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = students.filter(student =>
    student.rollNo.toString().includes(searchTerm)
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case 'StudentDetails':
        return (
          <div>
            <h2>Student List</h2>
            <input
              type="text"
              placeholder="Search by Roll No"
              value={searchTerm}
              onChange={handleSearch}
            />
            {selectedStudent ? (
              <div>
                <h3>Student Details</h3>
                <p>Name: {selectedStudent.name}</p>
                <p>Roll No: {selectedStudent.rollNo}</p>
                <p>Fee Paid: {selectedStudent.feePaid ? 'Yes' : 'No'}</p>
                <p>Room No: {selectedStudent.roomNo}</p>
                <button onClick={() => setSelectedStudent(null)}>Back to List</button>
              </div>
            ) : (
              <div>
                {filteredStudents.length > 0 ? (
                  <ul>
                    {filteredStudents.map((student, index) => (
                      <li key={index} onClick={() => handleStudentClick(student)}>
                        {student.name} (Roll No: {student.rollNo})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No student found</p>
                )}
              </div>
            )}
          </div>
        );
      // Add more cases for other components if needed
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="main1">
        <nav className="sidebar">
          <ul>
            <li
              className={activeComponent === 'StudentDetails' ? 'active' : ''}
              onClick={() => handleSidebarClick('StudentDetails')}
            >
              Student Details
            </li>
            <li
              className={activeComponent === 'IVRS' ? 'active' : ''}
              onClick={() => handleSidebarClick('IVRS')}
            >
              IVRS
            </li>
            <li
              className={activeComponent === 'Room' ? 'active' : ''}
              onClick={() => handleSidebarClick('Room')}
            >
              Room
            </li>
          </ul>
          <button
            className="logout-button"
            onClick={() => navigate('/adminLogin')}
          >
            Log out
          </button>
        </nav>
        <div className="content">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
