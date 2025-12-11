import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { allBooks } from './bookData';
import { chatData } from './chatData';
import './ChatPage.css';

const ChatPage = () => {
    const { id: chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const messagesEndRef = useRef(null);

    const [currentChat, setCurrentChat] = useState(null);
    const [currentBook, setCurrentBook] = useState(null);

    useEffect(() => {
        const chatInfo = chatData[chatId];
        if (chatInfo) {
            setCurrentChat(chatInfo);
            const bookInfo = allBooks[chatInfo.bookId];
            setCurrentBook(bookInfo);
        }

        const chatActivity = JSON.parse(localStorage.getItem('chatActivity')) || {};
        if (chatActivity[chatId]) {
            chatActivity[chatId].unread = 0;
            localStorage.setItem('chatActivity', JSON.stringify(chatActivity));
        }

        const allMessages = JSON.parse(localStorage.getItem('allMessages')) || {};
        setMessages(allMessages[chatId] || []);
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const updateChatActivityInLocalStorage = (chatId, lastMessage, timestamp, isOwnMessage = false) => {
        const chatActivity = JSON.parse(localStorage.getItem('chatActivity')) || {};
        const currentUnread = chatActivity[chatId] ? chatActivity[chatId].unread : 0;
        chatActivity[chatId] = { 
            lastMessage, 
            timestamp, 
            unread: isOwnMessage ? currentUnread : currentUnread + 1 
        };
        localStorage.setItem('chatActivity', JSON.stringify(chatActivity));
    };

    const getSellerResponse = (userText, tone, location, bookTitle) => {
        const normalizedText = userText.toLowerCase().replace(/\s+/g, '');

        const responses = {
            friendly: {
                default: "ㅎㅎ 잘 이해하지 못했어요. 다시 말씀해주시겠어요?",
                greeting: `안녕하세요! '${bookTitle}' 책에 관심 있으신가요? 편하게 문의해주세요.`,
                purchase: `네! 아직 책 팔고 있어요! 택배거래를 원하시나요? 직거래를 원하시나요?`,
                location: `직거래는 ${location} 근처에서 가능해요. 시간은 평일 저녁 7시 이후나 주말에 편하신 시간으로 조율해봐요!`,
                condition: "책 상태는 최상이에요. 거의 새 책 같답니다. 원하시면 사진 더 보내드릴까요?",
            },
            formal: {
                default: "죄송합니다. 문의하신 내용을 이해하지 못했습니다. 다시 질문해주십시오.",
                greeting: `안녕하십니까. '${bookTitle}' 도서에 대해 문의하실 점이 있으십니까?`,
                purchase: "네, 해당 도서는 현재 구매 가능하십니다. 거래 방식을 선택해주십시오 (택배/직거래).",
                location: `직거래의 경우, ${location}에서 가능합니다. 시간은 협의 후 결정하면 될 것 같습니다.`,
                condition: "도서 상태는 매우 양호합니다. 밑줄이나 접힘 없이 깨끗하게 보관되었습니다.",
            },
            direct: {
                default: "무슨 말씀이신지 모르겠네요.",
                greeting: `'${bookTitle}' 책 때문에 연락 주셨나요?`,
                purchase: "네, 구매 가능합니다. 직거래 원하세요, 택배 원하세요?",
                location: `직거래는 ${location}에서만 합니다. 시간 맞춰보시죠.`,
                condition: "책 상태 좋습니다. 사진 확인하세요.",
            }
        };

        const currentTone = responses[tone] || responses.friendly;

        if (normalizedText.includes('구매하고싶습니다') || normalizedText.includes('살게요') || normalizedText.includes('구매가능')) {
            return currentTone.purchase;
        }
        if (normalizedText.includes('안녕하세요')) {
            return currentTone.greeting;
        }
        if (normalizedText.includes('직거래')) {
            return currentTone.location;
        }
        if (normalizedText.includes('상태')) {
            return currentTone.condition;
        }
        
        return currentTone.default;
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !currentChat) return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: newMessage,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        const allMessages = JSON.parse(localStorage.getItem('allMessages')) || {};
        allMessages[chatId] = updatedMessages;
        localStorage.setItem('allMessages', JSON.stringify(allMessages));
        updateChatActivityInLocalStorage(chatId, newMessage, Date.now(), true);
        const userText = newMessage;
        setNewMessage('');

        setTimeout(() => {
            const responseText = getSellerResponse(userText, currentChat.tone, currentChat.location, currentBook.title);
            const sellerResponse = {
                id: updatedMessages.length + 1,
                sender: 'other',
                avatar: '/images/seller-icon.png',
                text: responseText,
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
            };
            
            const finalMessages = [...updatedMessages, sellerResponse];
            setMessages(finalMessages);

            const allMessages = JSON.parse(localStorage.getItem('allMessages')) || {};
            allMessages[chatId] = finalMessages;
            localStorage.setItem('allMessages', JSON.stringify(allMessages));
            updateChatActivityInLocalStorage(chatId, responseText, Date.now());
        }, 1500);
    };

    // ... (camera handling functions remain the same)

    if (!currentChat || !currentBook) {
        return <div>Loading chat...</div>;
    }

    return (
        <div className="iphone-container">
            {/* ... (status bar) */}
            <main className="screen-content">
                <header className="chat-header">
                    <button onClick={() => navigate('/chat')} className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className="header-title">
                        <span>{currentChat.sellerName}</span>
                        <div className="seller-rating">
                            {'★'.repeat(4)}{'☆'.repeat(1)}
                        </div>
                    </div>
                    <button className="more-options-button">
                        <i className="fa-solid fa-ellipsis-v"></i>
                    </button>
                </header>

                <Link to={`/books/${currentBook.id}`} className="chat-product-info-link">
                    <div className="chat-product-info">
                        <img src={currentBook.img} alt={currentBook.title} className="product-image" />
                        <div className="product-details">
                            <span className="product-status">{currentBook.badge}</span>
                            <span className="product-name">{currentBook.title}</span>
                            <span className="product-price">{currentBook.price}</span>
                        </div>
                    </div>
                </Link>

                <div className="chat-messages">
                    <div className="date-separator">2025년 11월 19일</div>
                    {messages.map((message, index) => {
                        if (message.type === 'system') {
                            return (
                                <div key={index} className="system-message">
                                    <span>{message.text}</span>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={`message-row ${message.sender === 'user' ? 'me' : 'other'}`}>
                                {message.sender === 'seller' && (
                                    <img src="/images/seller-icon.png" alt="avatar" className="message-avatar" />
                                )}
                                <div className="message-content">
                                    <div className="message-bubble">
                                        {message.text && message.text.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                        {message.image && <img src={message.image} alt="Captured" className="chat-image" />}
                                    </div>
                                    <span className="message-time">{new Date(message.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* ... (camera and input area) */}
             <div className="chat-input-area">
                <button className="attach-button">
                    <i className="fa-solid fa-plus"></i>
                </button>
                <input 
                    type="text" 
                    placeholder="메시지를 입력하세요"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatPage;