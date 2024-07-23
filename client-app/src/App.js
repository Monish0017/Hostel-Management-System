import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import StudentHome from './Pages/StudentHome';
import Fee from './Pages/Fee';
import StudentProfile from './Pages/StudentProfile';
import Header from './Pages/Header';
import Layout from './Pages/Layout';

const App = () => {
  return (
    <Router>
      <Header/>
      <Layout/>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<StudentHome/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/profile" element={<StudentProfile/>} />
        <Route path="/fee" element={<Fee/>} />
      </Routes>
    </Router>
  );
};

export default App;
