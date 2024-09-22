import React, { useState } from 'react';
import './CSS/IVRS.css';

const IVRS = () => {
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Sample data for previously applied leaves
  const previousLeaves = [
    { id: 1, applicationNo: '1001', leaveType: 'Leave', from: '2024-08-01 9:00 AM', to: '2024-08-03 6:00 PM', callCount: 2, reason: 'Personal', status: 'Closed' },
    { id: 2, applicationNo: '1002', leaveType: 'Outing', from: '2024-08-10 8:00 AM', to: '2024-08-10 2:00 PM', callCount: 1, reason: 'College Work', status: 'Cancelled' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Leave applied`);
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setLeaveType('');
    setFromDate('');
    setToDate('');
    setLeaveReason('');
    setIsFormVisible(false);
  };

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
              <label htmlFor="leaveType">Leave Type:</label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
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
              <select
                id="leaveReason"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                required
              >
                <option value="">Select Reason</option>
                <option value="personal">Personal</option>
                <option value="college_work">College Work</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="leaveReasonText">Leave Reason:</label>
              <textarea
                id="leaveReasonText"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit">Apply</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default IVRS;
