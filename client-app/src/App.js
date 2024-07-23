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
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/adminLogin" element={<AdminLogin/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<StudentHome />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="fee" element={<Fee />} />
          <Route path="room-allocation" element={<RoomAllocation />} /> {/* Add RoomAllocation */}
          <Route path="application" element={<ApplicationPage />} /> {/* Add ApplicationPage */}
        </Route>
        <Route path="/admin/allocate-rooms" element={<AdminRoomAllocation />} />
      </Routes>
    </Router>
  );
};

export default App;
