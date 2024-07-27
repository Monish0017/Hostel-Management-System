import React from 'react'
import { useState } from 'react';
import Payment from './Payment';
import "./CSS/Fee.css";

function Fee() {
    const [selects , setSelects] = useState('');
  return (
    <>
       <div className='choose-container'>
          <h2>Fee Payment</h2>
          <select value={selects} onChange={(e)=>setSelects(e.target.value)}>
        <option value="" disabled>Select a Block</option>
        <option value="K-Block">K-Block</option>
        <option value="L-Block">L-Block</option>
        <option value="M-Block">M-Block</option>
        <option value="N-Block">N-Block</option>
        <option value="Q-Block">Q-Block</option>
        </select>
        {selects&&<div className="payment-receipt">
            <p><b>{selects}</b></p>
            <Payment block={selects} />
        </div>}
        
      </div>
    </>
    
  )
}

export default Fee;