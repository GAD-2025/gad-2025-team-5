import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChats } from '../chatManager';
import { allBooks } from '../bookData';
import './ConversationListPage.css';

const ConversationListPage = () => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const chatActivity = JSON.parse(localStorage.getItem('chatActivity')) || {};
        const chatData = getChats(); // Fetch from localStorage

        const loadedConversations = Object.keys(chatData).map(chatId => {
            const chat = chatData[chatId];
            const book = allBooks[chat.bookId];
            const activity = chatActivity[chatId];

            const lastMessage = activity ? activity.lastMessage : (book ? `'${book.title}'에 대한 대화` : '대화');
            const time = activity ? new Date(activity.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
            const unread = activity ? activity.unread : 0;
            const timestamp = activity ? activity.timestamp : 0;

            return {
                id: chatId,
                nickname: chat.sellerName,
                lastMessage,
                time,
                unread,
                image: book ? book.img : '/images/placeholder.png', // Fallback image
                timestamp,
            };
        });

        const sorted = loadedConversations.sort((a, b) => b.timestamp - a.timestamp);

        setConversations(sorted);
    }, []);

    return (
        <div className="conversation-list-container">
            <header className="page-header">
                <h1>채팅</h1>
            </header>
            <main className="conversation-list">
                {conversations.length === 0 ? (
                    <p>아직 대화 내역이 없습니다.</p>
                ) : (
                    conversations.map(convo => (
                        <Link to={`/chat/${convo.id}`} key={convo.id} className="conversation-item">
                            <img src={convo.image} alt={convo.nickname} className="conversation-image" />
                            <div className="conversation-details">
                                <div className="conversation-header">
                                    <span className="conversation-nickname">{convo.nickname}</span>
                                    <span className="conversation-time">{convo.time}</span>
                                </div>
                                <div className="conversation-message">
                                    <p>{convo.lastMessage}</p>
                                    {convo.unread > 0 && <span className="unread-count">{convo.unread}</span>}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </main>
        </div>
    );
};

export default ConversationListPage;
