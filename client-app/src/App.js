import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import StudentHome from './Pages/StudentHome';
import Fee from './Pages/Fee';
import StudentProfile from './Pages/StudentProfile';
import Header from './Pages/Header';
import Layout from './Pages/Layout';
import AdminLogin from './Pages/AdminLogin';
import AdminRoomAllocation from './Pages/AdminRoomAllocation';
import RoomAllocation from './Pages/RoomAllocation';
import ApplicationPage from './Pages/ApplicationPage';
import LandingPage from './Pages/LandingPage'; // Import LandingPage

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as default route */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<StudentHome />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="fee" element={<Fee />} />
          <Route path="room-allocation" element={<RoomAllocation />} />
          <Route path="application" element={<ApplicationPage />} />
        </Route>
        <Route path="/admin/allocate-rooms" element={<AdminRoomAllocation />} />
      </Routes>
    </Router>
  );
};

export default App;
