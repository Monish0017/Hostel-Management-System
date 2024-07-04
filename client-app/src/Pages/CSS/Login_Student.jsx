import React, { useState } from 'react'

const Login_Student = () => {

  const[show,setshow]=useState(true);  //setshow initialized true

  const signupLink = () => {
    setshow(false); // Show sign up form
  }
  const loginLink = () => {
    setshow(true); // Show login form
  }

  return (
    <div className='full'>
      {/* Login or Sign Up form based on showLoginForm state */}
      <div className='login'>
        <h1>{show ? 'Login' : 'Sign Up'}</h1>
        
        <form>
          <div className='input'>
            <input type='text' placeholder='Username' />
          </div>

          {/* Render Email input only when Sign Up form is shown */}
          {show ? null : (
            <div className='input'>
              <input type='text' placeholder='Email' />
            </div>
          )}

          <div className='input'>
            <input type='password' placeholder='Password' />
          </div>
        </form>

        <div className='forgot'>
          <a href='#'>Forgot password?</a>
        </div>

        {/* Button text and functionality based on show state */}
        <button className='but'>{show ? 'Login' : 'Sign Up'}</button>

        <div className='signup'>
          <p>
            {/* Text and link to toggle between Login and Sign Up forms */}
            {show ? "Don't have an account? " : 'Already have an account? '}
            <a href='#' onClick={show ? signupLink : loginLink}>
              {show ? 'Sign Up' : 'Login'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login_Student
