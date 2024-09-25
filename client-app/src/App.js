import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import StudentHome from './Pages/StudentHome';
import Fee from './Pages/Fee';
import StudentProfile from './Pages/StudentProfile';
import Header from './Pages/Header';
import RoomAllocation from './Pages/RoomAllocation';
import LandingPage from './Pages/LandingPage';
import IVRS from './Pages/IVRS';
import Information from './Pages/Information';
import FoodTokenPage from './Pages/FoodTokenPage';

import AdminLogin from './Pages/AdminLogin';
import AdminHome from './Pages/AdminHome';
import AdminFood from './Pages/AdminFood';
import AdminRoom from './Pages/AdminRoom';
import Apply from './Pages/Apply';
import StudentApplication from './Pages/StudentApplication';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="fee" element={<Fee />} />
        <Route path="/home" element={<StudentHome />}>
          <Route path="profile" element={<StudentProfile />} />
          <Route path="ivrs" element={<IVRS />} />
          <Route path="food-tokens" element={<FoodTokenPage />} />

          <Route path="information" element={<Information />} />        
          <Route path="room-allocation" element={<RoomAllocation />} />
        </Route>
        <Route path="/admin/AdminHome" element={<AdminHome />} />
        <Route path="/admin/AdminFood" element={<AdminFood/>} />
        <Route path="/admin/AdminRoom" element={<AdminRoom/>} />
        <Route path="/admin/apply" element={<StudentApplication />} />

      </Routes>
    </Router>
  );
};

export default App;