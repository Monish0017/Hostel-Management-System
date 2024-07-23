import React, { useState } from 'react';

const ApplicationPage = () => {
  const [application, setApplication] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    roomPreferences: ['', '', ''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication({
      ...application,
      [name]: value,
    });
  };

  const handlePreferenceChange = (index, value) => {
    const newPreferences = [...application.roomPreferences];
    newPreferences[index] = value;
    setApplication({
      ...application,
      roomPreferences: newPreferences,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(application)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      alert('Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  };

  return (
    <div>
      <h1>Room Application</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={application.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Roll Number:
          <input
            type="text"
            name="rollNumber"
            value={application.rollNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={application.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={application.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Room Preference 1:
          <input
            type="text"
            value={application.roomPreferences[0]}
            onChange={(e) => handlePreferenceChange(0, e.target.value)}
            required
          />
        </label>
        <label>
          Room Preference 2:
          <input
            type="text"
            value={application.roomPreferences[1]}
            onChange={(e) => handlePreferenceChange(1, e.target.value)}
            required
          />
        </label>
        <label>
          Room Preference 3:
          <input
            type="text"
            value={application.roomPreferences[2]}
            onChange={(e) => handlePreferenceChange(2, e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplicationPage;
