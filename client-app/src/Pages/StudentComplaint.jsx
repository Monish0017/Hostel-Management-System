import React, { useState, useEffect } from 'react';
import './CSS/Complaint.css';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [complaintText, setComplaintText] = useState('');
  const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
  const serverBaseUrl = 'https://hostel-management-system-api.onrender.com'; // Adjust based on your server's URL

  useEffect(() => {
    // Fetch the complaints submitted by the student
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${serverBaseUrl}/student/my-complaints`, {
          headers: { 'x-auth-token': token },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setComplaints(data); // Set complaints if data is an array
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Send the complaint text to the server
    try {
      const response = await fetch(`${serverBaseUrl}/student/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send token in the header
        },
        body: JSON.stringify({ complaintText }), // Send only the complaintText
      });
      const data = await response.json();

      if (data && data.complaint) {
        setComplaints([...complaints, data.complaint]); // Update complaints list with new complaint
        setComplaintText(''); // Reset the input field
      } else {
        console.error('Error in response:', data);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div className='comp'>
      <h2>Submit a Suggestion</h2>
      <form>
        <textarea
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          placeholder="Describe your issue..."
          required
        />
      </form>
      <button type="submit" onClick={handleSubmit}>Submit Suggestion</button> {/* Move the button inside the form */}


      <h3>Your Suggestions</h3>
      {complaints.length === 0 ? (
        <p>No suggestions submitted yet.</p>
      ) : (
        <div className="complaint-grid">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-box">
              <p><strong>Complaint:</strong> {complaint.complaintText || 'No description provided'}</p>
              <p><strong>Status:</strong> {complaint.status || 'Pending'}</p>
              <p><strong>Date Submitted:</strong> {new Date(complaint.dateSubmitted).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
