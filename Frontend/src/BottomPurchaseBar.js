import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomPurchaseBar.css';

const BottomPurchaseBar = ({ book, onPurchaseClick, onChatClick }) => {
  const navigate = useNavigate();

  return (
    <div className="bottom-purchase-bar">
      <button className="chat-button" onClick={onChatClick}>
        채팅하기
      </button>      
      <button className="purchase-button" onClick={onPurchaseClick}>
        구매하기
      </button>
    </div>
  );
};

export default BottomPurchaseBar;