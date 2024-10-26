import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/AdminFood.css';

const AdminFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItemName, setFoodItemName] = useState('');
  const [foodItemImage, setFoodItemImage] = useState(null);
  const [foodItemPrice, setFoodItemPrice] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);
  const [reduceAmount, setReduceAmount] = useState(''); // State for the amount to reduce

  const token = localStorage.getItem('token');
  const serverBaseUrl = 'http://localhost:3000';

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${serverBaseUrl}/food/admin/food-items`, {
        headers: { 'x-auth-token': token },
      });
      setFoodItems(response.data || []);
    } catch (error) {
      setError('Failed to fetch food items');
      setFoodItems([]);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleAddFoodItem = async () => {
    try {
      const formData = new FormData();
      formData.append('name', foodItemName);
      formData.append('image', foodItemImage);
      formData.append('price', foodItemPrice);
      formData.append('availableDays', JSON.stringify(selectedDays));

      await axios.post(`${serverBaseUrl}/food/admin/food-item`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFoodItemName('');
      setFoodItemImage(null);
      setFoodItemPrice('');
      setSelectedDays([]);
      fetchFoodItems();
    } catch (error) {
      setError('Failed to add food item');
    }
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDays((prevDays) => 
      prevDays.includes(day) 
      ? prevDays.filter(d => d !== day) 
      : [...prevDays, day]
    );
  };

  const handleDeleteFoodItem = async (itemId) => {
    try {
      await axios.delete(`${serverBaseUrl}/food/admin/food-item/${itemId}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchFoodItems();
    } catch (error) {
      setError('Failed to delete food item');
    }
  };

  const handleCleanupExpiredTokens = async () => {
    try {
      const response = await axios.delete(`${serverBaseUrl}/food/cleanup-expired-tokens`, {
        headers: { 'x-auth-token': token },
      });
      alert(response.data.message);
      fetchFoodItems();
    } catch (error) {
      setError('Failed to clean up expired tokens');
    }
  };

  // Add the handler for reducing money
  const handleReduceMoney = async () => {
    try {
      const response = await axios.post(`${serverBaseUrl}/admin/reduce-money`, {
        amount: reduceAmount, // Send the reduceAmount
      }, {
        headers: { 'x-auth-token': token },
      });
      alert(response.data.message); // Notify the admin about the result
      setReduceAmount(''); // Reset the amount input
      fetchFoodItems(); // Refresh the food items list if needed
    } catch (error) {
      setError('Failed to reduce money');
    }
  };

  return (
    <div className="admin-food">
      <h2>Food Management</h2>
      {error && <p className="error-food">{error}</p>}
      <div className="add-food">
        <input
          type="text"
          value={foodItemName}
          onChange={(e) => setFoodItemName(e.target.value)}
          placeholder="Enter new food item"
        />
        <input
          type="file"
          onChange={(e) => setFoodItemImage(e.target.files[0])}
        />
        <input
          type="number"
          value={foodItemPrice}
          onChange={(e) => setFoodItemPrice(e.target.value)}
          placeholder="Enter price for food item"
        />
        <div className="available-days">
          <label>Select Available Days:</label>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={selectedDays.includes(day)}
                onChange={handleDayChange}
              />
              {day}
            </label>
          ))}
        </div>
        <button onClick={handleAddFoodItem}>Add Food Item</button>
      </div>
      <div className="food-list">
        {foodItems.map((item) => (
          <div key={item._id} className="food-item">
            <h4>{item.name}</h4>
            <img        
                src={item.image} 
                alt={item.name} 
                className="food-image" 
              />
            <div>
              Price: ${item.price}
            </div>
            <div>Available Days: {item.availableDays.join(', ')}</div>
            <button onClick={() => handleDeleteFoodItem(item._id)}>Delete</button>
          </div>
        ))}
      </div>
      <button className='cancel' onClick={handleCleanupExpiredTokens}>Cancel Expired Tokens</button>

      {/* Reduce Money Section */}
      <div className="reduce-money-section">
        <h3>Reduce Money for Daily Mess</h3>
        <input
          type="number"
          value={reduceAmount}
          onChange={(e) => setReduceAmount(e.target.value)}
          placeholder="Enter amount to reduce"
        />
        <button className='cancel' onClick={handleReduceMoney}>Reduce Money</button>
      </div>
    </div>
  );
};

export default AdminFood;
