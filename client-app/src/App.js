import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import StudentHome from './Pages/StudentHome';
import Fee from './Pages/Fee';
import StudentProfile from './Pages/StudentProfile';
import Header from './Pages/Header';
import AdminLogin from './Pages/AdminLogin';
import AdminRoomAllocation from './Pages/AdminRoomAllocation';
import RoomAllocation from './Pages/RoomAllocation';
import ApplicationPage from './Pages/ApplicationPage';
import LandingPage from './Pages/LandingPage';
import AdminHome from './Pages/AdminHome';
import IVRS from './Pages/IVRS';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<StudentHome />}>
          <Route path="profile" element={<StudentProfile />} />
          <Route path="fee" element={<Fee />} />
          <Route path="ivrs" element={<IVRS />} />        
          <Route path="room-allocation" element={<RoomAllocation />} />
          <Route path="application" element={<ApplicationPage />} />
        </Route>
        <Route path="/admin/allocate-rooms" element={<AdminRoomAllocation />} />
        <Route path="/admin/AdminHome" element={<AdminHome />} />
      </Routes>
    </Router>
  );
};

export default App;
