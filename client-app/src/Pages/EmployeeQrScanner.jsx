import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import './CSS/EmployeeScanQR.css'; // Adjust according to your stylesheet
import { Navigate, useNavigate } from 'react-router-dom';

const EmployeeScanQR = () => {
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState(null);
  const [foodItemData, setFoodItemData] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 
  const [showZeroQuantityPopup, setShowZeroQuantityPopup] = useState(false);
  const html5QrCodeRef = useRef(null);
  
  const navigate=useNavigate();
  const token = localStorage.getItem('token');
  const serverBaseUrl = 'https://hostel-management-system-api.onrender.com';

  // Initialize QR scanner
  useEffect(() => {
    if (showScanner) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [showScanner]);

  // Handle QR code scan
  const handleScan = async (data) => {
    console.log('Token:', token);

    if (data) {
      setQrData(data);
      try {
        const response = await axios.post(`${serverBaseUrl}/employee/scan-qr`, {
          qrData: data,
        }, {
          headers: { 'x-auth-token': token },
        });

        setFoodItemData(response.data);
        console.log('Scan successful:', response.data);
      } catch (error) {
        setError('Failed to process scanned data');
        console.error('Scan error:', error);
      }
    }
  };

  // Clear token handler
  const clearToken = async (data) => {
    try {
      const response = await axios.post(`${serverBaseUrl}/employee/clear-token`, {
        qrData: data,
      }, {
        headers: { 'x-auth-token': token },
      });

      setShowPopup(true);

      if (response.data.foodItem.quantity === 0) {
        setShowZeroQuantityPopup(true);
      }

      console.log('Token cleared:', response.data);
    } catch (error) {
      setError('Failed to clear token');
      console.error('Clear token error:', error);
    }
  };

  // Start the QR scanner
  const startScanner = () => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText) => {
        handleScan(decodedText);
      },
      (errorMessage) => {
        // Handle error if needed
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

  // Handle scanner visibility
  const handleScannerToggle = () => {
    setShowScanner((prev) => !prev);
  };

  // Close popups
  const closePopup = () => {
    setShowPopup(false);
  };

  const closeZeroQuantityPopup = () => {
    setShowZeroQuantityPopup(false);
  };

  return (
    <div className="employee-scan-qr">
      <button className='logout1' onClick={() => navigate('/')}>Log Out</button>
      <h2>Employee QR Scanner</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleScannerToggle}>
        {showScanner ? 'Stop Scanner' : 'Start Scanner'}
      </button>
      {showScanner && <div id="reader" style={{ width: '250px' }}></div>}
      {qrData && <div>Scanned Data: {qrData}</div>}

      {foodItemData && (
        <div className="food-item-display">
          <h3>Food Item Details</h3>
          <p>Item Name: {foodItemData.foodItem.name}</p>
          <p>Quantity: {foodItemData.foodItem.quantity}</p>
          <p>Student Roll No: {foodItemData.student.rollNo}</p>
          <p>Student Name: {foodItemData.student.name}</p>
          {foodItemData.student.image && (
            <div>
              <img src={foodItemData.student.image} alt="Profile" />
              <button onClick={() => clearToken(qrData)}>Clear Token</button>
            </div>
          )}
        </div>
      )}

      {/* Popup Modal for successful token clear */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Success!</h3>
            <p>The token has been cleared successfully.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Popup Modal for zero quantity */}
      {showZeroQuantityPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Warning!</h3>
            <p>The token quantity is now zero.</p>
            <button onClick={closeZeroQuantityPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeScanQR;
