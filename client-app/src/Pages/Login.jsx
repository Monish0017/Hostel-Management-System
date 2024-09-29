import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const Login = () => {
  const serverBaseUrl = 'https://hostel-management-system-api-46-4gf7yz7n1.vercel.app'; // Adjust based on your server's URL
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
                onChange={(e) => setRollNo(e.target.value)}
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
            onClick={() => {
              // Handle password reset action
              console.log('Forgot Password clicked');
            }}
          >
            Forgot Password?
          </div>
        </form>
        {error && <div className="error-popup">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
