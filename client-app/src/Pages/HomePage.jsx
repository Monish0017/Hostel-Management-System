import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Fee from './Fee';
import StudentProfile from './StudentProfile';
 // Assuming Payment is the component for fees

const HomePage = () => {
  return (
    <Layout>
      <Routes>
        <Route path="fee" element={<Fee />} />
        {/* Add other routes here */}
        <Route path="StudentProfile" element={<StudentProfile/>}/>
      </Routes>
    </Layout>
  );
};

export default HomePage;
