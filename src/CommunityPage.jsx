import React, { useState } from 'react';
import './CommunityPage.css';
import BottomNavBar from './BottomNavBar'; // Assuming BottomNavBar is used here

const CommunityPage = () => {
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'popular'

    const posts = [
        {
            id: 1,
            avatar: '/images/seller-icon.png', // Placeholder
            username: '난난판다',
            role: '아날로그 독서가',
            title: '표지 예쁘고, 재밌는 책 추천 좀',
            content: '표지는 마음에 드는데 막상 내용은 별로일 때가 많아서 추천이 간절해요ㅠㅠ 취향 맞는 책 찾...',
            likes: 1,
            comments: 4,
            image: '/images/모순.jpg', // Placeholder
            time: '5분 전',
            type: 'all'
        },
        {
            id: 2,
            avatar: '/images/seller-icon.png', // Placeholder
            username: '판다다',
            role: '전자책 매니아',
            title: '최근 종이책이 유행이네요',
            content: '그런데 최근 책값이 많이 올라서 부담이 되네요 새 책은 너무 비싸서 중고로 사고 싶어서 가입...',
            likes: 3,
            comments: 14,
            image: '/images/불편한.png', // Placeholder
            time: '13분 전',
            type: 'popular'
        },
        {
            id: 3,
            avatar: '/images/seller-icon.png', // Placeholder
            username: '판따',
            role: '동화 육아 마스터',
            title: '잠자기 전에 동화책 매일 읽어줘요',
            content: '아이에게 좋다길래, 중고로 전권 구매했어요~ 좋은 거래자분 만나서 합리적인 가격에 얻을...',
            likes: 7,
            comments: 9,
            image: '/images/역행자.jpeg', // Placeholder
            time: '21분 전',
            type: 'my-posts'
        },
        {
            id: 4,
            avatar: '/images/seller-icon.png', // Placeholder
            username: '난난판다',
            role: '아날로그 독서가',
            title: '읽고 싶은 책이 너무 많아요',
            content: '요즘 읽고 싶은 책이 너무 많은데 시간이 없네요. 다들 어떻게 시간 관리하시나요?',
            likes: 5,
            comments: 2,
            image: '/images/세이노의 가르침.jpeg', // Placeholder
            time: '1시간 전',
            type: 'all'
        },
        {
            id: 5,
            avatar: '/images/seller-icon.png', // Placeholder
            username: '판다다',
            role: '전자책 매니아',
            title: '전자책 리더기 추천해주세요',
            content: '전자책 리더기 구매하려고 하는데 어떤 제품이 좋을까요? 사용 후기 부탁드립니다!',
            likes: 10,
            comments: 8,
            image: '/images/도둑맞은 집중력.jpeg', // Placeholder
            time: '2시간 전',
            type: 'popular'
        }
    ];

    const filteredPosts = posts.filter(post => {
        if (activeTab === 'all') {
            return true;
        } else {
            return post.type === activeTab;
        }
    });

    return (
        <main className="screen-content">
                <header className="community-header">
                    <h1 className="community-title">커뮤니티</h1>
                    <div className="header-icons">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <i className="fa-solid fa-bell"></i>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                </header>

                <nav className="community-tabs">
                    <button
                        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        전체
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
                        onClick={() => setActiveTab('popular')}
                    >
                        인기글
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'my-posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-posts')}
                    >
                        내 글
                    </button>
                </nav>

                <div className="post-list">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-user-info">
                                <img src={post.avatar} alt="avatar" className="user-avatar" />
                                <div className="user-details">
                                    <span className="username">{post.username}</span>
                                    <span className="user-role">{post.role}</span>
                                </div>
                            </div>
                            <div className="post-content-section">
                                <div className="post-text-content">
                                    <h2 className="post-title">{post.title}</h2>
                                    <p className="post-snippet">{post.content}</p>
                                    <div className="post-actions">
                                        <span className="action-item">
                                            <i className="fa-regular fa-heart"></i> {post.likes}
                                        </span>
                                        <span className="action-item">
                                            <i className="fa-regular fa-comment"></i> {post.comments}
                                        </span>
                                    </div>
                                </div>
                                <img src={post.image} alt="post" className="post-image" />
                            </div>
                            <span className="post-time">{post.time}</span>
                        </div>
                    ))}
                </div>
            </main>
    );
};

export default CommunityPage;
