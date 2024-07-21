import React, { useState } from 'react';
import './CSS/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
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
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Redirect to profile or another page
      window.location.href = '/profile';
    } catch (error) {
      setError('Invalid email or password'); // Set error message
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
          <button
            type="button"
            className="forgot"
            onClick={() => {
              // Handle password reset action
              console.log('Forgot Password clicked');
            }}
          >
            Forgot Password?
          </button>
        </form>
        {error && <div className="error-popup">{error}</div>} {/* Display error message */}
      </div>
    </div>
  );
};

export default Login;
