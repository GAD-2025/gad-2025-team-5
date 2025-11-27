import React from 'react';
import './BottomNavBar.css';

const BottomNavBar = () => {
    return (
        <div className="bottom-nav-bar">
            <button className="chat-button-2">
                <span role="img" aria-label="chat">💬</span>
                판매자와 채팅하기
            </button>
            <button className="purchase-button">
                구매하기
            </button>
        </div>
    );
};

export default BottomNavBar;
