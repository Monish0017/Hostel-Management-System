import React, { useState, useEffect } from 'react';
import './CSS/StudentDetails.css'; 
import profile from '../assets/profile.jpg';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    rollNo: '',
    contactPhone: '',
    programme: '',
    classYear: '',
    fatherName: '',
    residentialAddress: '',
    primaryMobileNumber: '',
    secondaryMobileNumber: '',
    feePaid: false,
    blockNo: '',
    roomNo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null); // State to hold uploaded file

  const token = localStorage.getItem('token'); // Fetch token from localStorage

  // Fetch all students from MongoDB
  useEffect(() => {
    fetch('http://localhost:3000/admin/students', {
      headers: {
        'x-auth-token': token,
      }
    })
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching student data:', error));
  }, []);

  // Handle student selection
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
  };

  // Handle search by roll number
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUpload = (event) => {
    setFile(event.target.files[0]); // Set the uploaded file
  };

  const handleFileSubmit = () => {
    if (!file) {
      alert('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3000/admin/add-students', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error uploading student data:', data.error);
          alert(`Error: ${data.error}`);
        } else {
          setStudents(data); // Update students list
          setFile(null); // Reset file input
          alert('File uploaded successfully.');
        }
      })
      .catch(error => console.error('Error uploading student data:', error));
  };

  // Handle editing a student
  const handleEditStudent = (student) => {
    setIsEditing(true);
    setNewStudent(student);
  };

  // Handle deleting a student
  const handleDeleteStudent = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.fullName}?`)) {
      fetch(`http://localhost:3000/admin/remove-student/${student.rollNo}`, {
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

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // URL for updating student data
    const url = `http://localhost:3000/admin/modify-student/${selectedStudent.rollNo}`;
  
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(newStudent),
    })
      .then(response => response.json())
      .then(data => {
        const updatedStudents = students.map(s =>
          s.rollNo === selectedStudent.rollNo ? data : s
        );
        setStudents(updatedStudents);
        setIsEditing(false);
        setSelectedStudent(null);
        setNewStudent({ // Reset form
          fullName: '',
          rollNo: '',
          contactPhone: '',
          programme: '',
          classYear: '',
          fatherName: '',
          residentialAddress: '',
          primaryMobileNumber: '',
          secondaryMobileNumber: '',
          feePaid: false,
          blockNo: '',
          roomNo: ''
        });
      })
      .catch(error => console.error('Error saving student data:', error));
  };
  
  // Handle deleting all students
  const handleDeleteAllStudents = () => {
    if (window.confirm('Are you sure you want to delete all students?')) {
      fetch('http://localhost:3000/admin/remove-all-students', {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        }
      })
        .then(response => response.json())
        .then(() => {
          setStudents([]); // Clear the students list
          alert('All students have been deleted successfully.');
        })
        .catch(error => console.error('Error deleting all students:', error));
    }
  };

  // Filter students by roll number
  const filteredStudents = students.filter(student =>
    student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
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
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleUpload}
            />
            <button className="upload-btn" onClick={handleFileSubmit}>Upload</button>
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
          <p>Full Name: {selectedStudent.fullName}</p>
          <p>Email: {selectedStudent.email}</p>
          <p>Roll No: {selectedStudent.rollNo}</p>
          <p>Contact Phone: {selectedStudent.contactPhone}</p>
          <p>Programme: {selectedStudent.programme}</p>
          <p>Class Year: {selectedStudent.classYear}</p>
          <p>Father's Name: {selectedStudent.fatherName}</p>
          <p>Residential Address: {selectedStudent.residentialAddress}</p>
          <p>Primary Mobile Number: {selectedStudent.primaryMobileNumber}</p>
          <p>Secondary Mobile Number: {selectedStudent.secondaryMobileNumber}</p>
          <button className="back-btn" onClick={() => setSelectedStudent(null)}>Back to List</button>
        </div>
      ) : null}

      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="student-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newStudent.fullName}
            onChange={handleFormChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newStudent.email}
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
            name="contactPhone"
            placeholder="Contact Phone"
            value={newStudent.contactPhone}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="programme"
            placeholder="Programme"
            value={newStudent.programme}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="classYear"
            placeholder="Class Year"
            value={newStudent.classYear}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="fatherName"
            placeholder="Father's Name"
            value={newStudent.fatherName}
            onChange={handleFormChange}
            required
          />
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
            name="primaryMobileNumber"
            placeholder="Primary Mobile Number"
            value={newStudent.primaryMobileNumber}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="secondaryMobileNumber"
            placeholder="Secondary Mobile Number"
            value={newStudent.secondaryMobileNumber}
            onChange={handleFormChange}
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
          <button type="submit">{isEditing ? 'Update' : 'Add'} Student</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : null}

      {!isEditing && !selectedStudent ? (
        <div>
          <div className="student-grid">
            {filteredStudents.map(student => (
              <div key={student.rollNo} onClick={() => handleStudentClick(student)} className="student-box">
                <img src={profile} alt="Profile" className="profile-picture"/>
                <p>Full Name: {student.fullName}</p>
                <p>Roll No: {student.rollNo}</p>
              </div>
            ))}
          </div>
        <button className="delete-all-btn" onClick={handleDeleteAllStudents}>Delete All Students</button>
        </div>
        
      ) : null}
    </div>
  );
};

export default StudentDetails;
