import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ConversationListPage.css';

const ConversationListPage = () => {
    const initialConversations = [
        { id: 1, nickname: '북마스터', lastMessage: '네, 구매 가능합니다.', time: '오후 3:40', unread: 2, image: '/images/seller-icon.png' },
        { id: 2, nickname: '책방주인', lastMessage: '안녕하세요! 책 상태는 어떤가요?', time: '오전 11:20', unread: 0, image: '/images/seller-icon.png' },
        { id: 3, nickname: '헌책수집가', lastMessage: '혹시 다른 책도 파시나요?', time: '어제', unread: 1, image: '/images/seller-icon.png' },
    ];

    const [sortedConversations, setSortedConversations] = useState(initialConversations);

    useEffect(() => {
        const chatActivity = JSON.parse(localStorage.getItem('chatActivity')) || {};

        const conversationsWithActivity = initialConversations.map(convo => {
            const activity = chatActivity[convo.id];
            if (activity) {
                const date = new Date(activity.timestamp);
                const formattedTime = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
                return { ...convo, lastMessage: activity.lastMessage, time: formattedTime, timestamp: activity.timestamp };
            }
            return { ...convo, timestamp: 0 }; // Add a default timestamp for sorting if no activity
        });

        const sorted = [...conversationsWithActivity].sort((a, b) => {
            return b.timestamp - a.timestamp;
        });

        setSortedConversations(sorted);
    }, []);

    return (
        <div className="conversation-list-container">
            <header className="page-header">
                <h1>채팅</h1>
            </header>
            <main className="conversation-list">
                {sortedConversations.length === 0 ? (
                    <p>아직 대화 내역이 없습니다.</p>
                ) : (
                    sortedConversations.map(convo => (
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
