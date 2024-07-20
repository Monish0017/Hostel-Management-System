import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const Login = () => {
  const [userType, setUserType] = useState('Student'); // Default to Student
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (userType === 'Student') {
      if (rollNo && password) {
        navigate('/home');
      } else {
        alert('Please fill in all required fields.');
      }
    } else if (userType === 'Admin') {
      if (email && password) {
        // Implement admin login logic here
        alert('Admin login functionality not implemented.');
      } else {
        alert('Please fill in all required fields.');
      }
    } else if (userType === 'Faculty') {
      if (username && password) {
        // Implement faculty login logic here
        alert('Faculty login functionality not implemented.');
      } else {
        alert('Please fill in all required fields.');
      }
    }
  };

  return (
    <div className='full'>
      <div className='main'>
        <div className='login'>
          <h1>LOGIN</h1>
          <form>
            <div className='user'>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value='Student'>Student</option>
                <option value='Admin'>Admin</option>
                <option value='Faculty'>Faculty</option>
              </select>
            </div>

            {userType === 'Student' && (
              <div className='input'>
                <input
                  type='text'
                  placeholder='Roll No'
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>
            )}

            {userType === 'Admin' && (
              <div className='input'>
                <input
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            {userType === 'Faculty' && (
              <div className='input'>
                <input
                  type='text'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className='input'>
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          <div className='forgot'>
            <p>Forgot password?</p>
          </div>

          <button className='but' onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
