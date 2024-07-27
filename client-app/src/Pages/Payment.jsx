// src/Pages/Fee.js
import React from 'react';
import './CSS/Payment.css';
const Payment = ({ block }) => {
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

  const handlePayment = () => {
    var options = {
      key: 'rzp_test_SlFpcOAGhSBkgX', 
      key_secret: 'bpKEcQ4BZUpv4TQTVyyfG9WY',
      amount: totalFee * 100,
      currency: 'INR',
      name: 'Hostel Fee Payment',
      description: 'for testing purpose',
      handler: function (response) {
        alert(response.razorpay_payment_id);
      },
      prefill: {
        name: 'Monish Rajan',
        email: 'spidy@123',
        contact: '65371781821',
      },
      notes: {
        address: 'Razorpay corporate office',
      },
      theme: {
        color: '#3399cc',
      },
    };
    var pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <div className='payment-detail'>
      <h3>Payment Details</h3>
      <p>Selected Block: <b>{block}</b></p>
      <p>Block Fee: <b>Rs. {blockFee}</b></p>
      <p>Mess Fee: <b>Rs. {messFee}</b></p>
      <p>Total Fee: <b>Rs. {totalFee}</b></p>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default Payment;
