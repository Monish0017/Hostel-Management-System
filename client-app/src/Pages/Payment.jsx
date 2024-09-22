import React from 'react';
import './CSS/Payment.css';

const Payment = ({ name, rollNo, block }) => {
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

  const handleBackendSubmit = (name, rollNo, block, totalFee) => {
    console.log('Submitting to backend:', { name, rollNo, block, totalFee });
    // Example POST request (uncomment if necessary)
    // fetch('/api/submitPayment', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, rollNo, block, totalFee }),
    // }).then(response => response.json())
    //   .then(data => {
    //     console.log('Payment submitted:', data);
    //   }).catch(error => console.error('Error:', error));
  };

  const handlePayment = () => {
    if (!name || !rollNo || !block) {
      alert('Please fill all the details');
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
        handleBackendSubmit(name, rollNo, block, totalFee);
      },
      prefill: {
        name,
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
      <button className="btn1 btn-primary mt-3" onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default Payment;
