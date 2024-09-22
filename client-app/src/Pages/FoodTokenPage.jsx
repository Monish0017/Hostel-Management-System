import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CSS/FoodTokenPage.css'; 
import Modal from 'react-modal'; 

Modal.setAppElement('#root');

const FoodTokenPage = () => {
  const [foodItems] = useState(['Chicken-biryani', 'Vegetable-curry']); 
  const [foodItemName, setFoodItemName] = useState('');  // Added this line
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const authToken = localStorage.getItem('token');

  const fetchTokens = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/food/student/tokens', {
        headers: { 'x-auth-token': authToken },
      });
      if (response.data && response.data.tokens.length > 0) {
        setTokens(response.data.tokens);
      } else {
        setTokens([]);
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch tokens');
      setModalTitle('Error Fetching Tokens');
      setModalIsOpen(true);
    }
  }, [authToken]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleBookToken = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/food/student/food-token',
        { foodItemName, quantity, bookingDate },
        { headers: { 'x-auth-token': authToken } }
      );
      if (response.status === 201) {
        fetchTokens(); // Refresh tokens after successful booking
        setFoodItemName('');  // Reset food item
        setQuantity(1);
        setBookingDate('');
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;  // Removed 'status' here
        setError(data.message || 'Failed to book token');
        setModalIsOpen(true);
      } else {
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
      fetchTokens(); // Refresh tokens after cancellation
    } catch (err) {
      console.error('Error canceling token:', err);
      setError('Failed to cancel token');
      setModalTitle('Error Cancelling Token');
      setModalIsOpen(true);
    }
  };

  const handleGenerateQRCode = async (tokenId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/food/student/food-token/${tokenId}/qrcode`,
        { headers: { 'x-auth-token': authToken } }
      );
      setQrCode(response.data.qrCode);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
      setModalTitle('Error Generating QR Code');
      setModalIsOpen(true);
    }
  };

  return (
    <div className="food-token-page">
      <h1>Food Management</h1>

      <div className="book-token-form">
        <h2>Book Food Token</h2>
        <select
          value={foodItemName}
          onChange={(e) => setFoodItemName(e.target.value)}
          className="food-item-dropdown"
        >
          <option value="" disabled>Select Food Item</option>
          {foodItems.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="input-field"
        />
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="input-field"
        />
        <button onClick={handleBookToken} className="book-button">Book Token</button>
      </div>

      <div className="tokens-list">
        <h2>Your Tokens</h2>
        {tokens.length > 0 ? (
          <ul>
            {tokens.map((token) => (
              <li key={token._id} className="token-item">
                <span>
                  Token ID: {token._id}, Food Item: {token.foodItemName}, Quantity: {token.quantity}, Booking Date: {token.bookingDate}
                </span>
                <button onClick={() => handleCancelToken(token._id)} className="cancel-button">Cancel Token</button>
                <button onClick={() => handleGenerateQRCode(token._id)} className="qr-button">Generate QR Code</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Tokens</p> 
        )}
      </div>

      <div className="qr-code">
        <h2>QR Code</h2>
        {qrCode ? <img src={qrCode} alt="QR Code" /> : <p>No QR code generated yet.</p>}
      </div>

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
