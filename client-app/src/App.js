import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import StudentHome from './Pages/StudentHome';
import Fee from './Pages/Fee';
import StudentProfile from './Pages/StudentProfile';
import Header from './Pages/Header';
import AdminLogin from './Pages/AdminLogin';
import RoomAllocation from './Pages/RoomAllocation';
import LandingPage from './Pages/LandingPage';
import AdminHome from './Pages/AdminHome';
import AdminFood from './Pages/AdminFood';
import IVRS from './Pages/IVRS';
import Information from './Pages/Information';
import FoodTokenPage from './Pages/FoodTokenPage';

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
          <Route path="food-tokens" element={<FoodTokenPage />} />

          <Route path="information" element={<Information />} />        
          <Route path="room-allocation" element={<RoomAllocation />} />
        </Route>
        <Route path="/admin/AdminHome" element={<AdminHome />} />
        <Route path="/admin/AdminFood" element={<AdminFood/>} />
      </Routes>
    </Router>
  );
};

export default App;