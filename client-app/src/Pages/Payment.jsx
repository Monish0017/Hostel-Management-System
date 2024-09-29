import React from 'react';
import './CSS/Payment.css';

const Payment = ({ rollNo, block }) => {
  const messFee = 65000;

  const getFee = (block) => {
    switch (block) {
      case 'K-Block':
        return 23000;
      case 'L-Block':
        return 25000;
      case 'M-Block':
        return 67000;
      case 'N-Block':
        return 34000;
      case 'Q-Block':
        return 99000;
      default:
        return 0;
    }
  };

  const blockFee = getFee(block);
  const totalFee = blockFee + messFee;
  const token = localStorage.getItem('token');
  const serverBaseUrl = 'https://hostel-management-system-api.onrender.com'; // Adjust based on your server's URL

  const handleBackendSubmit = async (rollNo, totalFee) => {
    try {
      const response = await fetch(`${serverBaseUrl}/payments/submit-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Ensure correct token header
        },
        body: JSON.stringify({
          rollNo,
          amount: totalFee,
          status: 'paid',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Payment saved in the database:', data);
        alert('Payment has been successfully saved.');
      } else {
        console.error('Failed to save payment:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('There was a problem submitting the payment to the backend.');
    }
  };

  const handlePayment = () => {
    if (!block) {
      alert('Please select a block');
      return;
    }

    const options = {
      key: 'rzp_test_SlFpcOAGhSBkgX',
      key_secret: 'bpKEcQ4BZUpv4TQTVyyfG9WY',
      amount: totalFee * 100, // Razorpay works with paise
      currency: 'INR',
      name: 'Hostel Fee Payment',
      description: 'for testing purpose',
      handler: function (response) {
        alert('Payment successful! ID: ' + response.razorpay_payment_id);
        handleBackendSubmit(rollNo, totalFee); // Correctly passing rollNo
      },
      prefill: {
        email: 'spidy@123', // Replace with user's actual email if available
        contact: '65371781821', // Replace with user's actual contact if available
      },
      notes: {
        address: 'Razorpay corporate office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <div>
      <p><strong>Fee:</strong> Rs. {totalFee}</p> {/* Displaying only total fee */}
      <button className="pay-btn" onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default Payment;
