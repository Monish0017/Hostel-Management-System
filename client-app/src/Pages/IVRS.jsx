import React, { useState } from 'react';
import './CSS/IVRS.css'; 

const IVRS = () => {
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ leaveType, fromDate, toDate, leaveReason });
  };

  const handleCancel = () => {
    // Reset form fields
    setLeaveType('');
    setFromDate('');
    setToDate('');
    setLeaveReason('');
  };

  return (
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
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="annual">Annual Leave</option>
            <option value="maternity">Maternity Leave</option>
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
          <label htmlFor="leaveReason">Leave Reason:</label>
          <textarea
            id="leaveReason"
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
  );
};

export default IVRS;
