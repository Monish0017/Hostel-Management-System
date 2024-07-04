import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login'; // Ensure this path is correct
import Dashboard from './Pages/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/' element={<Login />} /> {/* Default route to login */}
      </Routes>
    </Router>
  );
};

export default App;
