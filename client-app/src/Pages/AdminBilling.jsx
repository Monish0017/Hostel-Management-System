// src/components/AdminBilling.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/AdminBilling.css'; // Make sure to create and style this CSS file if needed

const AdminBilling = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const serverBaseUrl = 'http://localhost:3000'; 
  
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Check if token exists
        if (!token) {
          setError('Authorization token is missing.');
          setLoading(false);
          return;
        }
        
        // Make the GET request with the token in the headers
        const response = await axios.get(`${serverBaseUrl}/food/admin/billing`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        setBillingData(response.data.billingData);
        console.log(response.data.billingData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch billing data.');
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  if (loading) {
    return <p>Loading billing data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-billing">
      <h2>Billing Information</h2>
      <table>
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Quantity</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {billingData.map((item, index) => (
            <tr key={index}>
              <td>{item._id}</td>
              <td>{item.totalQuantity}</td>
              <td>{item.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBilling;
