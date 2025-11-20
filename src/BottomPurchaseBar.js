import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomPurchaseBar.css';

<<<<<<< Updated upstream
const BottomPurchaseBar = ({ bookTitle }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/${bookTitle}`);
=======
const BottomPurchaseBar = ({ book }) => {
  const navigate = useNavigate();

  const handlePurchaseClick = () => {
    navigate('/payment', { state: { book: book } });
>>>>>>> Stashed changes
  };

  return (
    <div className="bottom-purchase-bar">
      <button className="chat-button" onClick={handleChatClick}>
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
