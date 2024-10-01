import React, { useState, useEffect } from 'react';
import './CSS/StudentDetails.css';
import profile from '../assets/profile.jpg';

const StudentDetails = () => {
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // State for Add Student
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    rollNo: '',
    contactPhone: '',
    programme: '',
    amount: '',
    classYear: '',
    fatherName: '',
    residentialAddress: '',
    primaryMobileNumber: '',
    secondaryMobileNumber: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null); // State to hold uploaded file

  const token = localStorage.getItem('token'); // Fetch token from localStorage

  // Fetch all students from MongoDB
  useEffect(() => {
    fetch(`${serverBaseUrl}/admin/students`, {
      headers: {
        'x-auth-token': token,
      }
    })
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching student data:', error));
  }, [token]);

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  // Handle form submission for adding or editing a student
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Prepare form data for file upload
    const formData = new FormData();
    Object.keys(newStudent).forEach(key => formData.append(key, newStudent[key]));

    if (file) {
      formData.append('image', file); // Attach file if available
    }

    // Determine if adding or editing
    const url = isAdding
      ? `${serverBaseUrl}/admin/add-student` // New student endpoint
      : `${serverBaseUrl}/admin/modify-student/${selectedStudent.rollNo}`; // Existing student modification

    fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'x-auth-token': token,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (isAdding) {
          setStudents([...students, data]); // Add new student to the list
          setIsAdding(false); // Exit add mode
        } else {
          const updatedStudents = students.map(s =>
            s.rollNo === selectedStudent.rollNo ? data : s
          );
          setStudents(updatedStudents);
          setIsEditing(false);
          setSelectedStudent(null);
        }

        // Reset form and file
        setNewStudent({
          fullName: '',
          email: '',
          rollNo: '',
          contactPhone: '',
          programme: '',
          amount: '',
          classYear: '',
          fatherName: '',
          residentialAddress: '',
          primaryMobileNumber: '',
          secondaryMobileNumber: '',
        });
        setFile(null);
      })
      .catch(error => console.error('Error saving student data:', error));
  };

  // Handle deleting a student
  const handleDeleteStudent = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.fullName}?`)) {
      fetch(`${serverBaseUrl}/admin/remove-student/${student.rollNo}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        }
      })
        .then(response => response.json())
        .then(() => {
          const updatedStudents = students.filter(s => s.rollNo !== student.rollNo);
          setStudents(updatedStudents);
          setSelectedStudent(null);
        })
        .catch(error => console.error('Error deleting student:', error));
    }
  };

  // Handle adding a new student
  const handleAddStudent = () => {
    setIsAdding(true); // Trigger the Add Student form to appear
  };

  // Handle editing a student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setNewStudent(student);
    setIsEditing(true);
  };

  // Filter students by roll number
  const filteredStudents = students.filter(student =>
    student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {!isEditing && !selectedStudent && !isAdding ? (
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
            <button className="add-btn" onClick={handleAddStudent}>Add Student</button>
          </div>
          <div className="student-list">
            <div className="student-grid">
              {filteredStudents.map(student => (
                <div key={student.rollNo} className="student-box" onClick={() => setSelectedStudent(student)}>
                  <img
                    className="profile-picture"
                    src={student.image ? student.image : profile}
                    alt="Profile"
                  />
                  <div className="student-info">
                    <h3>{student.fullName}</h3>
                    <p>{student.rollNo}</p>
                  </div>
                </div>
              ))} 
            </div>
          </div>
          <button className="delete-all-btn" onClick={() => {
            if (window.confirm('Are you sure you want to delete all students?')) {
              fetch(`${serverBaseUrl}/admin/remove-all-students`, {
                method: 'DELETE',
                headers: {
                  'x-auth-token': token,
                }
              })
                .then(response => response.json())
                .then(() => {
                  setStudents([]);
                  setSelectedStudent(null);
                })
                .catch(error => console.error('Error deleting all students:', error));
            }
          }}>
            Delete All Students
          </button>
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
          <p>Full Name: {selectedStudent.fullName}</p>
          <p>Email: {selectedStudent.email}</p>
          <p>Roll No: {selectedStudent.rollNo}</p>
          <p>Contact Phone: {selectedStudent.contactPhone}</p>
          <p>Amount: {selectedStudent.amount}</p>
          <p>Programme: {selectedStudent.programme}</p>
          <p>Class Year: {selectedStudent.classYear}</p>
          <p>Father's Name: {selectedStudent.fatherName}</p>
          <p>Residential Address: {selectedStudent.residentialAddress}</p>
          <p>Primary Mobile Number: {selectedStudent.primaryMobileNumber}</p>
          <p>Secondary Mobile Number: {selectedStudent.secondaryMobileNumber}</p>
          <button className="back-btn" onClick={() => setSelectedStudent(null)}>Back to List</button>
        </div>
      ) : null}

      {isEditing || isAdding ? (
        <form onSubmit={handleFormSubmit} className="student-form">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newStudent.fullName}
            onChange={handleFormChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newStudent.email}
            onChange={handleFormChange}
            required
          />

          {/* Roll No */}
          <input
            type="text"
            name="rollNo"
            placeholder="Roll No"
            value={newStudent.rollNo}
            onChange={handleFormChange}
            required
          />

          {/* Contact Phone */}
          <input
            type="text"
            name="contactPhone"
            placeholder="Contact Phone"
            value={newStudent.contactPhone}
            onChange={handleFormChange}
            required
          />

          {/* Programme */}
          <input
            type="text"
            name="programme"
            placeholder="Programme"
            value={newStudent.programme}
            onChange={handleFormChange}
            required
          />

          {/* Class Year */}
          <input
            type="text"
            name="classYear"
            placeholder="Class Year"
            value={newStudent.classYear}
            onChange={handleFormChange}
            required
          />

          {/* Father's Name */}
          <input
            type="text"
            name="fatherName"
            placeholder="Father's Name"
            value={newStudent.fatherName}
            onChange={handleFormChange}
            required
          />

          {/* Residential Address */}
          <input
            type="text"
            name="residentialAddress"
            placeholder="Residential Address"
            value={newStudent.residentialAddress}
            onChange={handleFormChange}
            required
          />

          <input
            type="text"
            name="amount"
            placeholder="Amount"
            value={newStudent.amount}
            onChange={handleFormChange}
            required
          />

          {/* Primary Mobile Number */}
          <input
            type="text"
            name="primaryMobileNumber"
            placeholder="Primary Mobile Number"
            value={newStudent.primaryMobileNumber}
            onChange={handleFormChange}
            required
          />

          {/* Secondary Mobile Number */}
          <input
            type="text"
            name="secondaryMobileNumber"
            placeholder="Secondary Mobile Number"
            value={newStudent.secondaryMobileNumber}
            onChange={handleFormChange}
          />

          {/* File Upload */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">{isAdding ? 'Add Student' : 'Update Student'}</button>
          <button type="button" onClick={() => {
            setIsEditing(false);
            setIsAdding(false);
            setNewStudent({
              fullName: '',
              email: '',
              rollNo: '',
              contactPhone: '',
              programme: '',
              classYear: '',
              fatherName: '',
              residentialAddress: '',
              primaryMobileNumber: '',
              secondaryMobileNumber: '',
            });
            setFile(null);
          }}>
            Cancel
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default StudentDetails;
