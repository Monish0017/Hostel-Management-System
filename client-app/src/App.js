import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import HomePage from './Pages/HomePage';

import StudentProfile from './Pages/StudentProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/" element={<Login />} />
        <Route path="/StudentProfile" element={<StudentProfile/>} />
       
        
      </Routes>
    </Router>
  );
};

export default App;
