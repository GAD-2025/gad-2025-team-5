import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ChatPage.css';

const ChatPage = () => {
    const { title } = useParams(); // Get the book title from the URL
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

    const sellerName = "난난판다";
    const sellerRating = 5; // Assuming 5 stars from the image
    const product = {
        image: '/images/모순.jpg', // Using the image from DetailPage.js
        status: '예약 중',
        name: title, // Use the dynamic title
        price: '10,800원'
    };

    const messages = [
        {
            id: 1,
            sender: 'me',
            text: '안녕하세요! 책 아직 구매 가능한가요?',
            time: '오후 4:18'
        },
        {
            id: 2,
            sender: 'other',
            avatar: '/images/seller-icon.png', // Placeholder for seller avatar
            text: '네, 아직 구매 가능합니다. 관심 가져주셔서 감사합니다!',
            time: '오후 4:19'
        },
        {
            id: 3,
            sender: 'me',
            text: '혹시 책 상태는 어떤가요? 밑줄이나 훼손된 부분은 없나요?',
            time: '오후 4:20'
        },
        {
            id: 4,
            sender: 'other',
            avatar: '/images/seller-icon.png', // Placeholder for seller avatar
            text: '네, 책 상태는 매우 좋습니다. 밑줄이나 훼손된 부분 전혀 없고, 깨끗하게 보관했습니다.',
            time: '오후 4:21'
        },
        {
            id: 5,
            sender: 'me',
            text: '알겠습니다. 혹시 직거래도 가능한가요?',
            time: '오후 4:22'
        },
        {
            id: 6,
            sender: 'other',
            avatar: '/images/seller-icon.png', // Placeholder for seller avatar
            text: '네, 직거래도 가능합니다. 어느 지역이 편하신가요?',
            time: '오후 4:23'
        }
    ];

    const toggleAttachmentOptions = () => {
        setShowAttachmentOptions(prevState => !prevState);
    };

    return (
        <div className="iphone-container">
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <main className="screen-content">
                <header className="chat-header">
                    <Link to={`/book/${title}`} className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <div className="header-title">
                        <span>{sellerName}</span>
                        <div className="seller-rating">
                            {'★'.repeat(sellerRating)}
                            {'☆'.repeat(5 - sellerRating)}
                        </div>
                    </div>
                    <button className="more-options-button">
                        <i className="fa-solid fa-ellipsis-v"></i>
                    </button>
                </header>

                <Link to={`/book/${title}`} className="chat-product-info-link">
                    <div className="chat-product-info">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-details">
                            <span className="product-status">{product.status}</span>
                            <span className="product-name">{product.name}</span>
                            <span className="product-price">{product.price}</span>
                        </div>
                    </div>
                </Link>

                <div className="chat-messages">
                    <div className="date-separator">2025년 11월 19일</div>
                    {messages.map(message => (
                        <div key={message.id} className={`message-row ${message.sender}`}>
                            {message.sender === 'other' && (
                                <img src={message.avatar} alt="avatar" className="message-avatar" />
                            )}
                            <div className="message-content">
                                <div className="message-bubble">
                                    {message.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                <span className="message-time">{message.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chat-input-area">
                    <button className="attach-button" onClick={toggleAttachmentOptions}>
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    {showAttachmentOptions && (
                        <div className="attachment-options">
                            <button className="attachment-option-button">카메라로 촬영하기</button>
                            <button className="attachment-option-button">갤러리에서 선택하기</button>
                        </div>
                    )}
                    <input type="text" placeholder="메시지를 입력하세요" className="message-input" />
                    <button className="send-button">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
