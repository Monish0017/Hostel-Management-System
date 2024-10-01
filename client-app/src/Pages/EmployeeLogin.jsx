import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css'; // Add your styles here

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverBaseUrl}/employee/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password as payload
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Save token to localStorage

      // Redirect to the QR scanning page
      navigate('/employeeScan'); // Assuming you have a route for the QR scanning page
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="full">
      <div className="main">
        <h1>Employee Login</h1>
        <form onSubmit={handleLogin}>
          <div className="user">
            <div className="input">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
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
          <button type="submit" className="but">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
