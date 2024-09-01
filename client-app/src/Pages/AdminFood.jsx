import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/AdminFood.css';

const AdminFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItemName, setFoodItemName] = useState('');
  const [foodItemImage, setFoodItemImage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Fetch all food items (admin only)
  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/food-items', {
        headers: { 'x-auth-token': token },
      });
      setFoodItems(response.data.foodItems); // Adjust according to the API response structure
    } catch (error) {
      setError('Failed to fetch food items');
    }
  };

  // Add a new food item (admin only)
  const handleAddFoodItem = async () => {
    try {
      const formData = new FormData();
      formData.append('name', foodItemName);
      formData.append('image', foodItemImage);
      formData.append('availableDays', JSON.stringify(selectedDays));

      await axios.post('http://localhost:3000/admin/food-item', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFoodItemName('');
      setFoodItemImage(null);
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
      await axios.delete(`http://localhost:3000/admin/food-item/${itemId}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchFoodItems(); // Refresh the food items list
    } catch (error) {
      setError('Failed to delete food item');
    }
  };

  return (
    <div className="admin-food">
      <h2>Food Management</h2>
      {error && <p className="error">{error}</p>}
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
      <ul className="food-list">
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <li key={item._id}>
              <span>{item.name}</span>
              <img src={`http://localhost:3000/${item.image}`} alt={item.name} className="food-item-image" />
              <div>
                Available Days: {item.availableDays.join(', ')}
              </div>
              <button onClick={() => handleDeleteFoodItem(item._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminFood;
