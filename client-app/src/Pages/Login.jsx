import React, { useState } from 'react';
import './CSS/Login.css';
// Updated Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAB2Uq3XedJaloEfad8jfQR73dMHmBiuJU",
  authDomain: "alpine-avatar-428418-b2.firebaseapp.com",
  projectId: "alpine-avatar-428418-b2",
  storageBucket: "alpine-avatar-428418-b2.appspot.com",
  messagingSenderId: "809476538533",
  appId: "1:809476538533:web:20fe12f918ff027d444d4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const [show, setShow] = useState(true);
  const [userType, setUserType] = useState('Student'); // Default to Student

  const toggleForm = () => {
    setShow(!show);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('Google user:', user);
        // Implement your login logic with Google user data here
      })
      .catch((error) => {
        console.error('Google sign-in error:', error.message); // Log error message
        // Display error message to the user (optional)
        alert(`Google sign-in error: ${error.message}`);
      });
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

        {/* Google Sign-in Button */}
        <button className='but' onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Login;
