import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/AdminFood.css';

const AdminFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItemName, setFoodItemName] = useState('');
  const [foodItemImage, setFoodItemImage] = useState(null);
  const [foodItemPrice, setFoodItemPrice] = useState(''); // State for food item price
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const serverBaseUrl = 'http://localhost:3000'; // Adjust based on your server's URL

  // Fetch all food items (admin only)
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
  }, []); // Run only on mount

  // Add a new food item (admin only)
  const handleAddFoodItem = async () => {
    try {
      const formData = new FormData();
      formData.append('name', foodItemName);
      formData.append('image', foodItemImage);
      formData.append('price', foodItemPrice); // Add the price here
      formData.append('availableDays', JSON.stringify(selectedDays));

      await axios.post(`${serverBaseUrl}/food/admin/food-item`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      // Clear the input fields
      setFoodItemName('');
      setFoodItemImage(null);
      setFoodItemPrice(''); // Clear the price input
      setSelectedDays([]);
      fetchFoodItems(); // Refresh the food items list
    } catch (error) {
      setError('Failed to add food item');
    }
  };

  // Handle day selection
  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDays((prevDays) => 
      prevDays.includes(day) 
      ? prevDays.filter(d => d !== day) 
      : [...prevDays, day]
    );
  };

  // Delete a food item (admin only)
  const handleDeleteFoodItem = async (itemId) => {
    try {
      await axios.delete(`${serverBaseUrl}/food/admin/food-item/${itemId}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchFoodItems(); // Refresh the food items list
    } catch (error) {
      setError('Failed to delete food item');
    }
  };

  // Cleanup expired tokens
  const handleCleanupExpiredTokens = async () => {
    try {
      const response = await axios.delete(`${serverBaseUrl}/food/cleanup-expired-tokens`, {
        headers: { 'x-auth-token': token },
      });
      alert(response.data.message); // Notify the user about the result
      fetchFoodItems(); // Refresh the food items list if needed
    } catch (error) {
      setError('Failed to clean up expired tokens');
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
                src={item.image} // Using the image URL directly
                alt={item.name} 
                className="food-image" 
              />
            <div>
              Price: ${item.price} {/* Displaying the price */}
            </div>
            <div>Available Days: {item.availableDays.join(', ')}</div>
            <button onClick={() => handleDeleteFoodItem(item._id)}>Delete</button>
          </div>
        ))}
      </div>
      <button className='cancel' onClick={handleCleanupExpiredTokens}>Cancel Expired Tokens</button>
    </div>
  );
};

export default AdminFood;
