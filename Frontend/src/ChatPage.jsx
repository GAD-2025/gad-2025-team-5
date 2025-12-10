import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ChatPage.css';

const ChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    useEffect(() => {
        const getInitialMessages = (chatId) => {
            switch (chatId) {
                case '1':
                    return [
                        { id: 1, sender: 'other', avatar: '/images/seller-icon.png', text: '안녕하세요! 책 상태는 어떤가요?', time: '오전 11:15' },
                        { id: 2, sender: 'me', text: '안녕하세요! 책 상태가 궁금합니다.', time: '오전 11:20' },
                        { id: 3, sender: 'other', avatar: '/images/seller-icon.png', text: '네, 책 상태는 매우 좋습니다. 밑줄이나 훼손된 부분 전혀 없고, 깨끗하게 보관했습니다.', time: '오전 11:25' },
                    ];
                case '2':
                    return [
                        { id: 1, sender: 'other', avatar: '/images/seller-icon.png', text: '안녕하세요! 혹시 직거래도 가능할까요?', time: '오후 1:00' },
                        { id: 2, sender: 'me', text: '네, 직거래 가능합니다. 어느 지역이 편하신가요?', time: '오후 1:05' },
                        { id: 3, sender: 'other', avatar: '/images/seller-icon.png', text: '강남역 근처에서 가능할까요?', time: '오후 1:10' },
                    ];
                case '3':
                    return [
                        { id: 1, sender: 'other', avatar: '/images/seller-icon.png', text: '혹시 다른 책도 파시나요?', time: '오후 3:00' },
                        { id: 2, sender: 'me', text: '네, 몇 권 더 있습니다. 어떤 종류 찾으세요?', time: '오후 3:05' },
                        { id: 3, sender: 'other', avatar: '/images/seller-icon.png', text: '소설책 위주로 보고 있어요!', time: '오후 3:10' },
                    ];
                default:
                    return [];
            }
        };
        setMessages(getInitialMessages(id));
    }, [id]);

    const sellerName = "난난판다";
    const sellerRating = 5;
    const product = {
        image: '/images/모순.png',
        status: '예약 중',
        name: '모순',
        price: '9,800원'
    };

    const updateChatActivityInLocalStorage = (chatId, lastMessage, timestamp) => {
        const chatActivity = JSON.parse(localStorage.getItem('chatActivity')) || {};
        chatActivity[chatId] = { lastMessage, timestamp };
        localStorage.setItem('chatActivity', JSON.stringify(chatActivity));
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
        };

        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        const userText = newMessage;
        setNewMessage('');

        setTimeout(() => {
            let responseText = "죄송합니다. 잘 이해하지 못했어요. 다시 질문해주세요.";

            if (userText.includes('상태') || userText.includes('깨끗')) {
                responseText = "네, 책 상태는 매우 좋습니다. 밑줄이나 훼손된 부분 전혀 없고, 깨끗하게 보관했습니다.";
            } else if (userText.includes('직거래') || userText.includes('만나서')) {
                responseText = "네, 직거래도 가능합니다. 어느 지역이 편하신가요?";
            } else if (userText.includes('가격') || userText.includes('네고')) {
                responseText = "가격 조정은 조금 어렵습니다. 죄송합니다.";
            } else if (userText.includes('구매 가능')) {
                responseText = "네, 아직 구매 가능합니다. 관심 가져주셔서 감사합니다!";
            }

            const sellerResponse = {
                id: currentMessages.length + 1,
                sender: 'other',
                avatar: '/images/seller-icon.png',
                text: responseText,
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
            };
            setMessages(prevMessages => [...prevMessages, sellerResponse]);
            updateChatActivityInLocalStorage(id, responseText, Date.now());
        }, 1000);
    };

    const handleCameraClick = async () => {
        setShowAttachmentOptions(false);
        if (isCameraActive) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsCameraActive(false);
            setCapturedImage(null);
        } else {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                setIsCameraActive(true);
            } catch (err) {
                console.error("Error accessing camera: ", err);
                alert("카메라 접근에 실패했습니다. 권한을 확인해주세요.");
            }
        }
    };

    const handleCapturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');
            setCapturedImage(imageData);
        }
    };

    const handleSendPhoto = () => {
        if (capturedImage) {
            const photoMessage = {
                id: messages.length + 1,
                sender: 'me',
                image: capturedImage,
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
            };
            setMessages(prevMessages => [...prevMessages, photoMessage]);
            updateChatActivityInLocalStorage(id, "사진을 보냈습니다.", Date.now());
            handleCameraClick(); // Turn off camera after sending
        }
    };
    
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

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
                    <button onClick={() => navigate('/chat')} className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
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

                <Link to={`/detail/${id}`} className="chat-product-info-link">
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
                                    {message.text && message.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                    {message.image && <img src={message.image} alt="Captured" className="chat-image" />}
                                </div>
                                <span className="message-time">{message.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {isCameraActive && (
                <div className="camera-preview-container">
                    <video ref={videoRef} autoPlay playsInline className="camera-preview"></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    <div className="camera-controls">
                        {!capturedImage && <button onClick={handleCapturePhoto} className="capture-button">사진 찍기</button>}
                        {capturedImage && <button onClick={handleSendPhoto} className="send-photo-button">사진 보내기</button>}
                        <button onClick={handleCameraClick} className="cancel-camera-button">취소</button>
                    </div>
                </div>
            )}

            <div className="chat-input-area">
                <button className="attach-button" onClick={toggleAttachmentOptions}>
                    <i className="fa-solid fa-plus"></i>
                </button>
                {showAttachmentOptions && (
                    <div className="attachment-options">
                        <button className="attachment-option-button" onClick={handleCameraClick}>카메라로 촬영하기</button>
                        <button className="attachment-option-button">갤러리에서 선택하기</button>
                    </div>
                )}
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
