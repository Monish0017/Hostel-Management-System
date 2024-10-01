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
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]; // Get the selected file
    setFormData((prevData) => ({
      ...prevData,
      image: selectedImage // Update the image in formData
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
    <div className='form-full'>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Roll No:</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />

          <label>Contact Phone:</label>
          <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />

          <label>Programme:</label>
          <input type="text" name="programme" value={formData.programme} onChange={handleChange} required />

          <label>Class Year:</label>
          <input type="text" name="classYear" value={formData.classYear} onChange={handleChange} required />

          <label>Father's Name:</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />

          <label>Residential Address:</label>
          <textarea name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} required></textarea>

          <label>Primary Mobile Number:</label>
          <input type="text" name="primaryMobileNumber" value={formData.primaryMobileNumber} onChange={handleChange} required />

          <label>Secondary Mobile Number:</label>
          <input type="text" name="secondaryMobileNumber" value={formData.secondaryMobileNumber} onChange={handleChange} required />

          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required /> {/* Image upload field */}

          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate('/')}>Back</button>
        </form>
      </div>
    </div>
  );
};

export default Apply;
