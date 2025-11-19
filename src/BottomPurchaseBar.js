import React from 'react';
import './BottomPurchaseBar.css';

const BottomPurchaseBar = () => {
  return (
    <div className="bottom-purchase-bar">
      <button className="chat-button">
        <span role="img" aria-label="chat">💬</span>
        판매자와 채팅하기
      </button>      
      <button className="purchase-button">
        구매하기
      </button>
    </div>
  );
};

export default BottomPurchaseBar;
