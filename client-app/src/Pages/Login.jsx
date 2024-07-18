import React, { useState } from 'react';
import './CSS/Login.css';
import logo from '../assets/logo.png'; 


const Login = () => {
  const [userType, setUserType] = useState('Student'); // Default to Student

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  
  return (
    <div className='full'>
      <div className='header'>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Hostel Management System</h1>
      </div>

      <div className='main'>
        <div className='login'>
          <h1>LOGIN</h1>
          
          <form>
            <div className='user'>
              <select value={userType} onChange={handleUserTypeChange}>
                <option value='Student'>Student</option>
                <option value='Admin'>Admin</option>
                <option value='Faculty'>Faculty</option>
              </select>
            </div>

            {userType === 'Student' && (
              <div className='input'>
                <input type='text' placeholder='Roll No' />
              </div>
            )}

            {userType === 'Admin' && (
              <div className='input'>
                <input type='text' placeholder='Email' />
              </div>
            )}

            {userType === 'Faculty' && (
              <div className='input'>
                <input type='text' placeholder='Username' />
              </div>
            )}

            <div className='input'>
              <input type='password' placeholder='Password' />
            </div>
          </form>

          <div className='forgot'>
            <p>Forgot password?</p>
          </div>

          <button className='but'>Login</button>

        </div>

      </div>

    </div>
  );
};

export default Login;
