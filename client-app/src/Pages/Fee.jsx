import React, { useState } from 'react';
import Payment from './Payment'; // Import the Payment component
import './CSS/Fee.css';

function Fee() {
  const [rollNo, setRollNo] = useState('');
  const [block, setBlock] = useState('');

  return (
    <div className='payment-container'>
      <h2>Fee Payment</h2>
      <div className='form-group'>
        <label>Roll No:</label>
        <input
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter your roll number"
        />
      </div>
      <div className='form-group'>
        <label>Select Block:</label>
        <select value={block} onChange={(e) => setBlock(e.target.value)}>
          <option value="">Select Block</option>
          <option value="K-Block">K-Block</option>
          <option value="L-Block">L-Block</option>
          <option value="M-Block">M-Block</option>
          <option value="N-Block">N-Block</option>
          <option value="Q-Block">Q-Block</option>
        </select>
      </div>

      {block && (
        <div className='payment-details'>
          <Payment rollNo={rollNo} block={block} />
        </div>
      )}
    </div>
  );
}

export default Fee;
