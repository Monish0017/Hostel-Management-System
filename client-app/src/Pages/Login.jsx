import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const Login = () => {
  const serverBaseUrl = 'https://hostel-management-system-api.onrender.com'; // Adjust based on your server's URL
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotRollNo, setForgotRollNo] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
      localStorage.setItem('token', data.token);
      navigate('/home/profile');
    } catch (error) {
      setError('Invalid roll number or password');
      console.error('Error:', error);
    }
  };

  const handleRollNoChange = (e) => {
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
        body: JSON.stringify({ rollNo: forgotRollNo })
      });

      if (!response.ok) {
        throw new Error('Failed to send reset password email');
      }

      setSuccessMessage('Password reset link sent to your email.');
      setShowForgotPassword(false);
    } catch (error) {
      setError('Failed to send reset password email');
      console.error('Error:', error);
    }
  };

  return (
    <div className="full">
      <div className="main">
        <h1>{showForgotPassword ? 'Forgot Password' : 'Login'}</h1>
        {!showForgotPassword ? (
          <form onSubmit={handleLogin}>
            <div className="user">
              <div className="input">
                <input
                  type="text"
                  value={rollNo}
                  onChange={handleRollNoChange}
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
            <div className="forgot" onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="input">
              <input
                type="text"
                value={forgotRollNo}
                onChange={(e) => setForgotRollNo(e.target.value.toUpperCase())}
                placeholder="Enter your Roll Number"
                required
              />
            </div>
            <div className='res1'>
            <button type="submit" className="res">Send Reset Link</button>
            <button type="button" className="but-can" onClick={() => setShowForgotPassword(false)}>Cancel</button>
            </div>
            
          </form>
        )}
        {error && <div className="error-popup">{error}</div>}
        {successMessage && <div className="success-popup">{successMessage}</div>}
      </div>
    </div>
  );
};

export default Login;
