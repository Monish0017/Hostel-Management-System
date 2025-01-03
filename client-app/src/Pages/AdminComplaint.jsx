import React, { useState, useEffect } from 'react';
import './CSS/AdminComplaint.css';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const token = localStorage.getItem('token'); // Assuming JWT for admin is stored
  const serverBaseUrl = 'https://hostel-management-system-api.onrender.com'; // Adjust based on your server's URL

  useEffect(() => {
    fetch(`${serverBaseUrl}/admin/complaints`, {
      headers: { 'x-auth-token': token },
    })
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => console.error('Error fetching complaints:', error));
  }, [token]);

  const handleDelete = (id) => {
    fetch(`${serverBaseUrl}/admin/complaints/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    })
      .then((response) => response.json())
      .then(() => {
        setComplaints(complaints.filter((complaint) => complaint._id !== id));
        setSelectedComplaint(null);
      })
      .catch((error) => console.error('Error deleting complaint:', error));
  };

  // Function to handle deleting all complaints
  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all complaints?')) {
      fetch(`${serverBaseUrl}/admin/delete-complaints`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      })
        .then((response) => response.json())
        .then(() => {
          setComplaints([]); // Clear the complaints state
          alert('All complaints deleted successfully');
        })
        .catch((error) => console.error('Error deleting all complaints:', error));
    }
  };

  return (
    <div>
      <h2>All Suggestions</h2>
      <button onClick={handleDeleteAll} className="delete-all-button">Delete All Complaints</button>
      {selectedComplaint ? (
        <div className="complaint-details1">
          <h3>Suggestion Details</h3>
          <p>{selectedComplaint.complaintText}</p>
          <p>Status: {selectedComplaint.status}</p>
          <button onClick={() => handleDelete(selectedComplaint._id)}>Delete Suggestion</button>
          <button onClick={() => setSelectedComplaint(null)}>Back to List</button>
        </div>
      ) : (
        <div className="complaint-grid1">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-box1" onClick={() => setSelectedComplaint(complaint)}>
              <p>{complaint.studentName}</p>
              <p>Status: {complaint.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
