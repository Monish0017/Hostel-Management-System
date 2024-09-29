import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const serverBaseUrl = 'https://hostel-management-system-api-46-4gf7yz7n1.vercel.app'; // Adjust based on your server's URL

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverBaseUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      // Redirect to admin Home page
      navigate('/admin/AdminHome'); // Use navigate instead of window.location
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid username or password');
    }
  };

  return (
    <div className="full">
      <div className="main">
        <h1>Admin Login</h1>
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
          <button type="submit" className="but">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
