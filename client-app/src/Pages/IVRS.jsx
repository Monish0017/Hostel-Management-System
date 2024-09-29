import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/IVRS.css';

const IVRS = () => {
  const serverBaseUrl = 'https://hostel-management-system-api-46-4gf7yz7n1.vercel.app'; // Adjust based on your server's URL
  const [studentRollNo, setStudentRollNo] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveReasonText, setLeaveReasonText] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  const previousLeaves = [
    { id: 1, applicationNo: '1001', leaveType: 'Leave', from: '2024-08-01 9:00 AM', to: '2024-08-03 6:00 PM', callCount: 2, reason: 'Personal', status: 'Closed' },
    { id: 2, applicationNo: '1002', leaveType: 'Outing', from: '2024-08-10 8:00 AM', to: '2024-08-10 2:00 PM', callCount: 1, reason: 'College Work', status: 'Cancelled' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const leaveData = { studentRollNo,fromDate, toDate};

    try {
      const token = localStorage.getItem('token'); // Get the token from local storage

      // Apply for leave and get the applicationId
      const leaveResponse = await axios.post(`${serverBaseUrl}/api/ivrs/create-application`, leaveData, {
        headers: {
          'x-auth-token': token, // Set the token in headers
        },
      });

      console.log(leaveResponse.data);
      if (leaveResponse.data.success === 1) {
        const applicationId = leaveResponse.data.applicationId;
        setApplicationId(applicationId);
        setLeaveStatus('Leave application submitted successfully.');
      } else {
        alert('Failed to apply for leave.');
        setLeaveStatus('Failed to submit leave application.');
      }
    } catch (error) { 
      console.error('Error applying leave: ', error);
      alert(`Error applying leave: ${error.response ? error.response.data.message : error.message}`);
      setLeaveStatus('Error occurred while submitting leave application.');
    }

    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setStudentRollNo('');
    setLeaveType('');
    setFromDate('');
    setToDate('');
    setLeaveReason('');
    setLeaveReasonText('');
    setIsFormVisible(false);
  };

  useEffect(() => {
    if (applicationId) {
      const fetchLeaveStatus = async () => {
        try {
          const response = await axios.get(`${serverBaseUrl}/api/applications/status/${applicationId}`, {
            headers: {
              'x-auth-token': localStorage.getItem('x-auth-token'),
            },
          });
          setLeaveStatus(response.data.status);
          if (response.data.status === 'confirmed' || response.data.status === 'cancelled') {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Error fetching leave status', error);
        }
      };

      const intervalId = setInterval(fetchLeaveStatus, 5000);
      return () => clearInterval(intervalId);
    }
  }, [applicationId]);

  return (
    <>
      {!isFormVisible ? (
        <div className="ivrs-container">
          <h1>Leave History</h1>
          <table className="leave-history-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Application No</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Call Count</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {previousLeaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{index + 1}</td>
                  <td>{leave.applicationNo}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.from}</td>
                  <td>{leave.to}</td>
                  <td>{leave.callCount}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    <button onClick={() => alert(`Displaying details for leave ID: ${leave.id}`)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="apply-button" onClick={() => setIsFormVisible(true)}>+ Apply Leave</button>
        </div>
      ) : (
        <div className="leave-application-container">
          <h1>Apply Leave</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentRollNo">Student Roll No:</label>
              <input
                type="text"
                id="studentRollNo"
                value={studentRollNo}
                onChange={(e) => setStudentRollNo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leaveType">Leave Type:</label>
              <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                <option value="">Select Leave Type</option>
                <option value="leave">Leave</option>
                <option value="outing">Outing</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fromDate">From Date:</label>
              <input
                type="datetime-local"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="toDate">To Date:</label>
              <input
                type="datetime-local"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leaveReason">Reason Type:</label>
              <select id="leaveReason" value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required>
                <option value="">Select Reason</option>
                <option value="personal">Personal</option>
                <option value="college_work">College Work</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="leaveReasonText">Leave Reason:</label>
              <textarea
                id="leaveReasonText"
                value={leaveReasonText}
                onChange={(e) => setLeaveReasonText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit">Apply</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>

          {leaveStatus && <p>Leave Status: {leaveStatus}</p>}
        </div>
      )}
    </>
  );
};

export default IVRS;
