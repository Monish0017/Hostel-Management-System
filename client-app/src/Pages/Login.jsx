import React, { useState } from 'react';
import './CSS/Login.css';

const Login = () => {
  const [show, setShow] = useState(true);
  const [userType, setUserType] = useState('Student'); // Default to Student

  const toggleForm = () => {
    setShow(!show);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div className='full'>
      <div className='login'>
        <h1>{show ? 'Login' : 'Sign Up'}</h1>
        
        <form>
          <div className='input'>
            <select value={userType} onChange={handleUserTypeChange}>
              <option value='Student'>Student</option>
              <option value='Admin'>Admin</option>
              <option value='Faculty'>Faculty</option>
            </select>
          </div>
          <div className='input'>
            <input type='text' placeholder='Username' />
          </div>

          {!show && (
            <div className='input'>
              <input type='text' placeholder='Email' />
            </div>
          )}

          <div className='input'>
            <input type='password' placeholder='Password' />
          </div>
        </form>

        <div className='forgot'>
          <button className='link-button'>Forgot password?</button>
        </div>

        <button className='but'>{show ? 'Login' : 'Sign Up'}</button>

        <div className='signup'>
          <p>
            {show ? "Don't have an account? " : 'Already have an account? '}
            <button className='link-button' onClick={toggleForm}>
              {show ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
