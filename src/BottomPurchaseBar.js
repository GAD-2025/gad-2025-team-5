import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomPurchaseBar.css';

const BottomPurchaseBar = () => {
  const navigate = useNavigate();

  const handlePurchaseClick = () => {
    navigate('/payment');
  };

  return (
    <div className="bottom-purchase-bar">
      <button className="chat-button">
        <span role="img" aria-label="chat">💬</span>
        판매자와 채팅하기
      </button>      
      <button className="purchase-button" onClick={handlePurchaseClick}>
        구매하기
      </button>
    </div>
  );
};

export default BottomPurchaseBar;
