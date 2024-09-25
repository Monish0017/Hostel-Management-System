import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode'; // Import the html5-qrcode library
import './CSS/AdminFood.css';

const AdminFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItemName, setFoodItemName] = useState('');
  const [foodItemImage, setFoodItemImage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null); // Store scanned QR data
  const [showScanner, setShowScanner] = useState(false);
  const html5QrCodeRef = useRef(null); // Reference for the HTML5 QR Code instance

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount

  // Initialize QR scanner
  useEffect(() => {
    if (showScanner) {
      startScanner();
    } else {
      stopScanner();
    }

    // Cleanup on unmount
    return () => {
      stopScanner();
    };
  }, [showScanner]); // Re-run when showScanner changes

  // Add a new food item (admin only)
  const handleAddFoodItem = async () => {
    try {
      const formData = new FormData();
      formData.append('name', foodItemName);
      formData.append('image', foodItemImage);
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

  // Handle QR code scan
  const handleScan = async (data) => {
    if (data) {
      setQrData(data); // Store the scanned QR data
      const tokenId = extractTokenId(data); // Extract the token ID from QR data
      if (tokenId) {
        try {
          // Send the token ID to your server to clear the specific token
          await axios.delete(`${serverBaseUrl}/food/admin/clear-tokens`, {
            headers: { 'x-auth-token': token },
            data: { tokenId }, // Send tokenId in request body
          });
          stopScanner(); // Stop the scanner after successful scan
          fetchFoodItems(); // Refresh food items or tokens as needed
        } catch (error) {
          setError('Failed to clear tokens');
        }
      }
    }
  };

  // Extract Token ID from QR data
  const extractTokenId = (data) => {
    const match = data.match(/Token ID: (\w+)/);
    return match ? match[1] : null; // Return the token ID if found
  };

  // Start the QR scanner
  const startScanner = () => {
    const html5QrCode = new Html5Qrcode("reader"); // Create an instance of Html5Qrcode
    html5QrCode.start(
      { facingMode: "environment" }, // Use environment camera
      {
        fps: 10, // Frames per second
        qrbox: 250 // Width and height of the QR box
      },
      (decodedText, decodedResult) => {
        handleScan(decodedText); // Handle scanned QR data
      },
      (errorMessage) => {
        // Handle error if needed
      }
    ).catch(err => {
      console.error(err);
      setError('Error starting the QR code scanner');
    });
    html5QrCodeRef.current = html5QrCode; // Store the instance in the ref
  };

  // Stop the QR scanner
  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear(); // Clear the scanner
        html5QrCodeRef.current = null; // Reset the ref
      }).catch(err => {
        console.error(err);
        setError('Error stopping the QR code scanner');
      });
    }
  };

  // Handle scanner visibility
  const handleScannerToggle = () => {
    setShowScanner((prev) => !prev); // Toggle the scanner visibility
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

      {/* QR Scanner Button */}
      <button className="qr-btn" onClick={handleScannerToggle}>
        {showScanner ? 'Close Scanner' : 'Scan QR'}
      </button>

      {showScanner && (
        <div className="qr-scanner">
          <div id="reader" style={{ width: '100%' }} /> {/* QR Code Reader container */}
        </div>
      )}

      <div className="food-list">
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <ul key={item._id}>
              <span>{item.name}</span>
              <img 
                src={item.image} // Using the image URL directly from Firebase
                alt={item.name} 
                className="food-image" 
              />
              <div>
                Available Days: {item.availableDays.join(', ')}
              </div>
              <button onClick={() => handleDeleteFoodItem(item._id)}>Delete</button>
            </ul>
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminFood;
