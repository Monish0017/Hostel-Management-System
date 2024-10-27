import React, { useState } from 'react';
import Payment from './Payment'; // Import the Payment component
import './CSS/Fee.css';
import { useNavigate } from 'react-router-dom';

function Fee() {
  const [rollNo, setRollNo] = useState('');
  const [block, setBlock] = useState('');
  const navigate = useNavigate();

  // Convert rollNo to uppercase as user types
  const handleRollNoChange = (e) => {
    setRollNo(e.target.value.toUpperCase());
  };

  return (
    <div className='payment-container'>
      <h2>Fee Payment</h2>
      <button className='logout2' onClick={() => navigate('/')}>Back</button>
      <div className='form-group'>
        <input
          type="text"
          value={rollNo}
          onChange={handleRollNoChange} // Apply the handler
          placeholder="Enter your roll number"
        />
      </div>
      <div className='form-group'>
        <select value={block} onChange={(e) => setBlock(e.target.value)}>
          <option value="">Select Block</option>
          <option value="Block 1">Block 1</option>
          <option value="Block 2">Block 2</option>
          <option value="Block 3">Block 3</option>
          <option value="Block 4">Block 4</option>
          <option value="Block 5">Block 5</option>
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
