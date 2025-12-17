
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CommunityPage.css';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { ReactComponent as BellIcon } from '../assets/bell.svg';
import { ReactComponent as MenuIcon } from '../assets/menu.svg';
import { ReactComponent as PlusIcon } from '../assets/plus.svg';


const CommunityPage = () => {
    const [activeFilter, setActiveFilter] = useState('all'); // 'all' or 'popular'

    // Dummy data for community posts - replace with actual data fetching
    const communityPosts = [
        {
            id: '1',
            author: '아날로그 독서가',
            time: '1일 전',
            title: '표지 예쁘고, 재밌는 책 추천 좀',
            content: '표지는 마음에 드는데 막상 내용은 별로일 때가 많아서 추천이 간절해요ㅠㅠ 취향 맞는 책 찾...',
            views: 8,
            image: 'http://localhost:3845/assets/b8c06d79ba2c3fd848ef38d508594c0d249e1885.png', // Placeholder image
            avatar: 'http://localhost:3845/assets/group-1707483572.png' // Placeholder avatar
        },
        {
            id: '3',
            author: '전자책 마니아',
            time: '2일 전',
            title: '최근 종이책이 유행이네요',
            content: '그런데 최근 책값이 많이 올라서 부담이 되네요 새 책은 너무 비싸서 중고로 사고 싶어서 가입⋯',
            views: 174,
            image: 'http://localhost:3845/assets/b8c06d79ba2c3fd848ef38d508594c0d249e1885.png', // Placeholder image
            avatar: 'http://localhost:3845/assets/group-1707483572.png' // Placeholder avatar
        },
        {
            id: '2',
            author: '아동화 육아 마스터',
            time: '2일 전',
            title: '잠자기 전에 동화책 매일 읽어줘요',
            content: '아이에게 좋다길래, 중고로 전권 구매했어요~ 좋은 거래자분 만나서 합리적인 가격에 얻을⋯',
            views: 26,
            image: 'http://localhost:3845/assets/b8c06d79ba2c3fd848ef38d508594c0d249e1885.png', // Placeholder image
            avatar: 'http://localhost:3845/assets/group-1707483572.png' // Placeholder avatar
        }
    ];

    const filteredPosts = activeFilter === 'all' ? communityPosts : communityPosts.filter(post => post.views > 50); // Example filter for popular

    return (
        <div className="community-page-container">
            <header className="community-header">
                <h1 className="community-title">커뮤니티</h1>
                <div className="header-icons">
                    <SearchIcon className="icon" />
                    <BellIcon className="icon" />
                    <MenuIcon className="icon" />
                </div>
            </header>

            <div className="community-filters-wrapper"> {/* New wrapper for filters */}
                <div className="community-filters">
                    <button
                        className={activeFilter === 'all' ? 'filter-button active' : 'filter-button'}
                        onClick={() => setActiveFilter('all')}
                    >
                        전체
                    </button>
                    <button
                        className={activeFilter === 'popular' ? 'filter-button active' : 'filter-button'}
                        onClick={() => setActiveFilter('popular')}
                    >
                        인기글
                    </button>
                </div>
            </div>

            <main className="community-post-list">
                {filteredPosts.map(post => (
                    <Link to={`/community/${post.id}`} key={post.id} className="community-post-item">
                        <div className="post-header">
                            <img src={post.avatar} alt={post.author} className="post-avatar" />
                            <span className="post-author">{post.author}</span>
                            <span className="post-time">{post.time}</span>
                        </div>
                        <div className="post-content-wrapper">
                            <div className="post-text-content">
                                <h2 className="post-title">{post.title}</h2>
                                <p className="post-snippet">{post.content}</p>
                                <span className="post-views">조회수 {post.views}</span>
                            </div>
                            {post.image && <img src={post.image} alt="Post thumbnail" className="post-thumbnail" />}
                        </div>
                    </Link>
                ))}
            </main>

            <button className="fab">
                <PlusIcon />
            </button>
        </div>
    );
};

export default CommunityPage;
