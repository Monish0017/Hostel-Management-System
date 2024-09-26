import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import './CSS/AdminFood.css'; // Assuming custom CSS for styling

const AdminFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItemName, setFoodItemName] = useState('');
  const [foodItemImage, setFoodItemImage] = useState(null);
  const [foodItemPrice, setFoodItemPrice] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);
  const [scannedTokens, setScannedTokens] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const html5QrCodeRef = useRef(null);
  const readerRef = useRef(null); // Ref for the QR reader element
  const token = localStorage.getItem('token'); // Admin token
  const serverBaseUrl = 'http://localhost:3000'; // Your API endpoint

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
  }, []);

  useEffect(() => {
    if (showScanner) {
      // Start the scanner if the scanner is enabled and the readerRef is available
      if (readerRef.current) {
        startScanner();
      }
    } else {
      stopScanner();
    }

    return () => {
      stopScanner(); // Clean up scanner on component unmount
    };
  }, [showScanner]);

  // Handle adding a new food item
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
      // Reset input fields after successful submission
      setFoodItemName('');
      setFoodItemImage(null);
      setFoodItemPrice('');
      setSelectedDays([]);
      fetchFoodItems(); // Refresh the food items
    } catch (error) {
      setError('Failed to add food item');
    }
  };

  // Handle available days for the food item
  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  // Delete a food item
  const handleDeleteFoodItem = async (itemId) => {
    try {
      await axios.delete(`${serverBaseUrl}/food/admin/food-item/${itemId}`, {
        headers: { 'x-auth-token': token },
      });
      fetchFoodItems(); // Refresh the list after deletion
    } catch (error) {
      setError('Failed to delete food item');
    }
  };

  // Handle scanning and stop the scanner on successful scan
  const handleScan = async (data) => {
    if (data) {
      const tokenId = extractTokenId(data);
      if (tokenId) {
        try {
          const response = await axios.get(`${serverBaseUrl}/food/admin/token-details/${tokenId}`, {
            headers: { 'x-auth-token': token },
          });
          setScannedTokens((prevTokens) => [...prevTokens, response.data]);
          stopScanner(); // Stop the scanner after successful scan
        } catch (error) {
          setError('Failed to fetch token details');
        }
      }
    }
  };

  // Extract token ID from the scanned QR code data
  const extractTokenId = (data) => {
    const match = data.match(/Token ID: (\w+)/);
    return match ? match[1] : null;
  };

  // Start the QR scanner
  const startScanner = () => {
    if (!readerRef.current) {
      console.error("HTML Element with id='reader' not found");
      return;
    }

    const html5QrCode = new Html5Qrcode(readerRef.current.id);
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText, decodedResult) => {
        handleScan(decodedText); // Process scan result
      }
    ).catch(err => {
      console.error(err);
      setError('Error starting the QR code scanner');
    });
    html5QrCodeRef.current = html5QrCode;
  };

  // Stop the QR scanner
  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }).catch(err => {
        console.error(err);
        setError('Error stopping the QR code scanner');
      });
    }
  };

  // Toggle scanner visibility
  const handleScannerToggle = () => {
    setShowScanner((prev) => !prev);
  };

  // Clear a specific token
  const handleClearToken = async (tokenId) => {
    try {
      await axios.delete(`${serverBaseUrl}/food/admin/clear-token/${tokenId}`, {
        headers: { 'x-auth-token': token },
      });
      setScannedTokens((prevTokens) => prevTokens.filter((token) => token._id !== tokenId));
    } catch (error) {
      setError('Failed to clear token');
    }
  };

  // Clear all expired tokens
  const handleClearExpiredTokens = async () => {
    try {
      await axios.delete(`${serverBaseUrl}/food/admin/cleanup-expired-tokens`, {
        headers: { 'x-auth-token': token },
      });
      setScannedTokens([]); // Optionally clear scanned tokens
      fetchFoodItems(); // Refresh food items if needed
    } catch (error) {
      setError('Failed to clear expired tokens');
    }
  };

  // Handle image upload and scan for QR code
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && readerRef.current) {
      const html5QrCode = new Html5Qrcode(readerRef.current.id);
      try {
        const result = await html5QrCode.scanFile(file, true);
        handleScan(result);
      } catch (error) {
        console.error(error);
        setError('Failed to scan QR code from image');
      }
    } else {
      setError('QR code reader is not available');
    }
  };

  return (
    <div className="admin-food">
      <h2>Food Management</h2>
      {error && <p className="error-food">{error}</p>}
      
      {/* Add Food Form */}
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
      
      {/* Food Item List */}
      <div className="food-list">
        {foodItems.map((item) => (
          <div key={item._id} className="food-item">
            <h4>{item.name}</h4>
            <img src={item.image} alt={item.name} className="food-image" />
            <div>Price: ${item.price}</div>
            <div>Available Days: {item.availableDays.join(', ')}</div>
            <button onClick={() => handleDeleteFoodItem(item._id)}>Delete</button>
          </div>
        ))}
      </div>
      
      {/* QR Code Scanner */}
      <button onClick={handleScannerToggle}>
        {showScanner ? 'Stop Scanner' : 'Start Scanner'}
      </button>
      {showScanner && <div ref={readerRef} id="reader" style={{ width: '250px' }}></div>}
      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleImageUpload}
      />
      
      {/* Scanned Tokens */}
      {scannedTokens.length > 0 && (
        <div>
          <h3>Scanned Tokens</h3>
          {scannedTokens.map((token) => (
            <div key={token._id}>
              <span>{token.tokenId} - {token.status}</span>
              <button onClick={() => handleClearToken(token._id)}>Clear Token</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleClearExpiredTokens}>Clear Expired Tokens</button>
    </div>
  );
};

export default AdminFood;
