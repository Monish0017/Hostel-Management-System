import React, { useState, useEffect } from 'react';
import profile from '../assets/profile.jpg';

const EmployeeDetails = () => {
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    contactPhone: '',
    email: '',
    position: '',
    salary: '',
    address: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  const token = localStorage.getItem('token'); // Fetch token from localStorage

  useEffect(() => {
    fetch(`${serverBaseUrl}/admin/employees`, {
      headers: {
        'x-auth-token': token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched employee data:', data);
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setEmployees([]); // Fallback to an empty array if data is not an array
        }
      })
      .catch((error) => console.error('Error fetching employee data:', error));
  }, [token]);

  // Handle employee selection
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  };

  // Handle search by employee name
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle editing an employee
  const handleEditEmployee = (employee) => {
    setIsEditing(true);
    setNewEmployee(employee);
    setSelectedImage(null); // Reset selected image when editing
  };

  // Handle deleting an employee
  const handleDeleteEmployee = (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      fetch(`${serverBaseUrl}/admin/remove-employee/${employee._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      })
        .then((response) => response.json())
        .then(() => {
          const updatedEmployees = employees.filter((e) => e._id !== employee._id);
          setEmployees(updatedEmployees);
          setSelectedEmployee(null);
        })
        .catch((error) => console.error('Error deleting employee:', error));
    }
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); // Set selected image
  };

  // Handle form submission for adding or editing an employee
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const url = isEditing
      ? `${serverBaseUrl}/admin/modify-employee/${newEmployee._id}` // Update URL for editing
      : `${serverBaseUrl}/admin/add-employee`; // URL for adding

    const employeeData = new FormData();
    employeeData.append('fullName', newEmployee.fullName);
    employeeData.append('contactPhone', newEmployee.contactPhone);
    employeeData.append('email', newEmployee.email);
    employeeData.append('position', newEmployee.position);
    employeeData.append('salary', newEmployee.salary);
    employeeData.append('address', newEmployee.address);
    if (selectedImage) {
      employeeData.append('image', selectedImage); // Append image if selected
    }

    const method = isEditing ? 'PUT' : 'POST'; // Determine method based on editing state

    fetch(url, {
      method: method,
      headers: {
        'x-auth-token': token,
      },
      body: employeeData, // Send employee data as FormData
    })
      .then((response) => response.json())
      .then((data) => {
        if (isEditing) {
          const updatedEmployees = employees.map((emp) => (emp._id === newEmployee._id ? data : emp));
          setEmployees(updatedEmployees);
        } else {
          setEmployees([...employees, data]);
        }
        resetForm();
      })
      .catch((error) => console.error('Error saving employee data:', error));
  };

  // Filter employees by full name
  const filteredEmployees = employees.filter((employee) =>
    employee.fullName && employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset the form and state
  const resetForm = () => {
    setIsEditing(false);
    setSelectedEmployee(null);
    setNewEmployee({
      fullName: '',
      contactPhone: '',
      email: '',
      position: '',
      salary: '',
      address: '',
    }); // Reset newEmployee for adding
    setSelectedImage(null); // Reset selected image
  };

  return (
    <div>
      {!selectedEmployee && !isEditing ? ( // Render employee list only if no employee is selected and not in editing mode
        <>
            <h2>Employees List</h2>
            <div className="search-container">
            <input
              type="text"
              placeholder="Search by Employee Name"
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            {/* <button className="add-btn" onClick={() => {
              resetForm();
              setIsEditing(false); // Ensure we are in adding mode
            }}>Add Employee</button> */}
          </div>

            
          <div className="student-list">
          <div className="student-grid">
            {filteredEmployees.map((employee) => (
              <div key={employee._id} className="student-box" onClick={() => handleEmployeeClick(employee)}>
                <img src={employee.image || profile} alt="Profile" className="profile-picture" />
                <div className="student-info">
                  <h3>{employee.fullName}</h3>
                  <p>{employee.position}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </>
      ) : null}

      {selectedEmployee && !isEditing ? ( // Render details for the selected employee
        <>
          <h2>Employee Details</h2>
          <div className='modify-btn'>
            <button className="btn-det" onClick={() => handleEditEmployee(selectedEmployee)}>Edit</button>
            <button className="btn-det" onClick={() => handleDeleteEmployee(selectedEmployee)}>Delete</button>
          </div>
          <div className="student-details">
            <img src={selectedEmployee.image || profile} alt="Profile" className="profile-picture" />

            <p>Full Name: {selectedEmployee.fullName}</p>
            <p>Email: {selectedEmployee.email}</p>
            <p>Contact Phone: {selectedEmployee.contactPhone}</p>
            <p>Position: {selectedEmployee.position}</p>
            <p>Salary: {selectedEmployee.salary}</p>
            <p>Address: {selectedEmployee.address}</p> {/* Display address */}
            <button className="back-btn" onClick={() => setSelectedEmployee(null)}>Back to List</button>
          </div>
        </>
      ) : null}

      {(isEditing || !selectedEmployee) && ( // Render the form for adding or editing employee
        <form onSubmit={handleFormSubmit} className="student-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newEmployee.fullName}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="contactPhone"
            placeholder="Contact Phone"
            value={newEmployee.contactPhone}
            onChange={handleFormChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={newEmployee.position}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={newEmployee.salary}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newEmployee.address}
            onChange={handleFormChange}
            required
          />
          <input type="file" onChange={handleImageChange} /> {/* Input for image upload */}
          <button type="submit" >{isEditing ? 'Update Employee' : 'Add Employee'}</button>
          <button type="button" onClick={resetForm} className="reset-btn">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EmployeeDetails;
