import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const Login = () => {
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotRollNo, setForgotRollNo] = useState(''); // Use rollNo for forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle modal for forgot password
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rollNo, password })
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Use the correct key here
      navigate('/home/profile');
    } catch (error) {
      setError('Invalid roll number or password');
      console.error('Error:', error);
    }
  };

  const handleRollNoChange = (e) => {
    // Automatically convert input to uppercase
    setRollNo(e.target.value.toUpperCase());
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverBaseUrl}/student/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rollNo: forgotRollNo }) // Send rollNo
      });

      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to send reset password email');
      }

      setSuccessMessage('Password reset link sent to your email.');
      setShowForgotPassword(false); // Close modal after success
    } catch (error) {
      setError('Failed to send reset password email');
      console.error('Error:', error);
    }
  };

  return (
    <div className="full">
      <div className="main">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="user">
            <div className="input">
              <input
                type="text"
                value={rollNo}
                onChange={handleRollNoChange} // Use the custom handler
                placeholder="Roll Number"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>
          <button type="submit" className="but">Login</button>
          <div
            className="forgot"
            onClick={() => setShowForgotPassword(true)} // Show forgot password modal
          >
            Forgot Password?
          </div>
        </form>
        {error && <div className="error-popup">{error}</div>}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal">
          <div className="modal-content">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="text"
                value={forgotRollNo} // Use state for forgot rollNo
                onChange={(e) => setForgotRollNo(e.target.value.toUpperCase())} // Automatically convert input to uppercase
                placeholder="Enter your Roll Number"
                required
              />
              <button type="submit" className="but">Send Reset Link</button>
              <button type="button" className="but" onClick={() => setShowForgotPassword(false)}>Cancel</button>
            </form>
            {successMessage && <div className="success-popup">{successMessage}</div>}
            {error && <div className="error-popup">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
