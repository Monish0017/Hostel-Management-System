import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CSS/FoodTokenPage.css'; // Import your CSS file
import Modal from 'react-modal'; // Import the modal component

// Ensure modal root element is added to the body
Modal.setAppElement('#root');

const FoodTokenPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItemName, setFoodItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState(''); // State to control modal title

  const authToken = localStorage.getItem('token');

  const fetchFoodItems = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/food/student/food-items', {
        headers: { 'x-auth-token': authToken },
      });
      if (response.data) {
        setFoodItems(response.data);
      } else {
        setError('Invalid data format for food items');
        setModalTitle('Error Fetching Food Items');
        setModalIsOpen(true); // Open modal if there's an error
      }
    } catch (err) {
      console.error('Error fetching food items:', err);
      setError('Failed to fetch food items');
      setModalTitle('Error Fetching Food Items');
      setModalIsOpen(true); // Open modal if there's an error
    }
  }, [authToken]);

  const fetchTokens = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/food/student/tokens', {
        headers: { 'x-auth-token': authToken },
      });
      if (response.data) {
        setTokens(response.data.tokens);
      } else {
        setError('Invalid data format for tokens');
        setModalTitle('Error Fetching Tokens');
        setModalIsOpen(true); // Open modal if there's an error
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch tokens');
      setModalTitle('Error Fetching Tokens');
      setModalIsOpen(true); // Open modal if there's an error
    }
  }, [authToken]);

  useEffect(() => {
    fetchFoodItems();  // Fetch available food items for booking
    fetchTokens();     // Fetch existing tokens for display
  }, [fetchFoodItems, fetchTokens]);

  const handleBookToken = async () => {
    try {
        const response = await axios.post('http://localhost:3000/food/student/food-token', {
            foodItemName: foodItemName,
            quantity,
            bookingDate,
        }, {
            headers: { 'x-auth-token': authToken },
        });

        // If the status is 201, the token was successfully booked
        if (response.status === 201) {
            fetchTokens(); // Refresh the tokens list
            setFoodItemName('');
            setQuantity(1);
            setBookingDate('');
        }
    } catch (err) {
        // Check if the error response has a status code
        if (err.response) {
            const { status, data } = err.response;

            if (status === 400 && data.message === 'Food item is not available') {
                setError('FoodNotAvailable on this date');
                console.log(data.message);
                setModalIsOpen(true); // Open modal with the specific error message
            } else if (status === 404 && data.message === 'Student not found') {
                setError('Student not found');
                console.log(data.message);
                setModalIsOpen(true); // Open modal for student not found
            } else if (status === 404 && data.message === 'Food item not found') {
                setError('Food item not found');
                console.log(data.message);
                setModalIsOpen(true); // Open modal for food item not found
            } else {
                setError('Failed to book token');
                console.log(data.message);
                setModalIsOpen(true); // Open modal for any other error
            }
        } else {
            // Handle network errors or unexpected issues
            console.error('Unexpected error:', err);
            setError('Unexpected error occurred');
            setModalIsOpen(true);
        }
    }
};


  const handleCancelToken = async (tokenId) => {
    try {
      await axios.delete(`http://localhost:3000/food/student/food-token/${tokenId}`, {
        headers: { 'x-auth-token': authToken },
      });
      fetchTokens(); // Refresh the tokens list
    } catch (err) {
      console.error('Error canceling token:', err);
      setError('Failed to cancel token');
      setModalTitle('Error Cancelling Token');
      setModalIsOpen(true); // Open modal if there's an error
    }
  };

  const handleGenerateQRCode = async (tokenId) => {
    try {
      const response = await axios.get(`http://localhost:3000/food/student/food-token/${tokenId}/qrcode`, {
        headers: { 'x-auth-token': authToken },
      });
      setQrCode(response.data.qrCode);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
      setModalTitle('Error Generating QR Code');
      setModalIsOpen(true); // Open modal if there's an error
    }
  };

  return (
    <div className="food-token-page">
      <h1>Food Management</h1>

      <div className="food-item-list">
        <h2>Available Food Items</h2>
        {foodItems.length > 0 ? (
          <ul>
            {foodItems.map(item => (
              <li key={item._id} className="food-item">
                <img src={`http://localhost:3000${item.image}`} alt={item.name} className="food-item-image" />
                <div className="food-item-details">
                  <span className="food-item-name">{item.name}</span>
                  <span className="food-item-days">Available on: {item.availableDays.join(', ')}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No food items available.</p>
        )}
      </div>

      <div className="book-token-form">
        <h2>Book Food Token</h2>
        <input
          type="text"
          placeholder="Food Item"
          value={foodItemName}
          onChange={(e) => setFoodItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />
        <button onClick={handleBookToken}>Book Token</button>
      </div>

      <div className="tokens-list">
        <h2>Your Tokens</h2>
        {tokens.length > 0 ? (
          <ul>
            {tokens.map(token => (
              <li key={token._id} className="token-item">
                <span>Token ID: {token._id}, Food Item: {token.foodItemName}, Quantity: {token.quantity}, Booking Date: {token.bookingDate}</span>
                <button onClick={() => handleCancelToken(token._id)}>Cancel Token</button>
                <button onClick={() => handleGenerateQRCode(token._id)}>Generate QR Code</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tokens booked yet.</p>
        )}
      </div>

      <div className="qr-code">
        <h2>QR Code</h2>
        {qrCode ? (
          <img src={qrCode} alt="QR Code" />
        ) : (
          <p>No QR code generated yet.</p>
        )}
      </div>

      {/* Modal for displaying errors */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel={modalTitle}
        className="error-modal"
        overlayClassName="error-modal-overlay"
      >
        <h2>{modalTitle}</h2>
        <p>{error}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default FoodTokenPage;
