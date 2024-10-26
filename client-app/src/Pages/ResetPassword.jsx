import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/ResetPassword.css';

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/student/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password.');
    }
  };

  return (
    <div className="full">
      <div className="main">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="newPassword">New Password:</label>
          <input 
            id="newPassword"
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="reset-button">Reset Password</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
