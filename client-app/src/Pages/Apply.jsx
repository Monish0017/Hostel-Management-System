import React, { useState } from 'react';
import './CSS/Apply.css';
import { useNavigate } from 'react-router-dom';

const Apply = () => {
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNo: '',
    contactPhone: '',
    programme: '',
    classYear: '',
    fatherName: '',
    residentialAddress: '',
    primaryMobileNumber: '',
    secondaryMobileNumber: '',
    image: '', // Initialize the image attribute
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]; // Get the selected file
    setFormData((prevData) => ({
      ...prevData,
      image: selectedImage, // Update the image in formData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    // Append form fields to FormData object
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${serverBaseUrl}/application/apply`, {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Application submitted successfully:', data);
        navigate('/');  // Navigate to home or success page after submission
      } else {
        const errorData = await response.json();
        console.error('Error submitting application:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-full">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} required />
          <input type="text" name="contactPhone" placeholder="Contact Phone" value={formData.contactPhone} onChange={handleChange} required />
          <input type="text" name="programme" placeholder="Programme" value={formData.programme} onChange={handleChange} required />
          <input type="text" name="classYear" placeholder="Class Year" value={formData.classYear} onChange={handleChange} required />
          <input type="text" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} required />
          <textarea name="residentialAddress" placeholder="Residential Address" value={formData.residentialAddress} onChange={handleChange} required></textarea>
          <input type="text" name="primaryMobileNumber" placeholder="Primary Mobile Number" value={formData.primaryMobileNumber} onChange={handleChange} required />
          <input type="text" name="secondaryMobileNumber" placeholder="Secondary Mobile Number" value={formData.secondaryMobileNumber} onChange={handleChange} required />
          <input type="file" accept="image/*" onChange={handleImageChange} required /> {/* Image upload field */}

          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate('/')}>Back</button>
        </form>
      </div>
    </div>
  );
};

export default Apply;
