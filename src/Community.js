import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const Community = () => {
    const location = useLocation();

    return (
        <div className="iphone-container" style={{ backgroundColor: '#ffffff' }}>
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
                <header className="app-header">
                    <h1 className="logo">커뮤니티</h1>
                </header>
                <div style={{ padding: '20px', color: 'black' }}>
                    <p>커뮤니티 페이지입니다.</p>
                </div>
            </main>
            <nav className="bottom-nav">
                <Link to="/home" className="nav-item">
                    <i className="fa-solid fa-house"></i>
                    <span>홈</span>
                </Link>
                <Link to="/community" className={`nav-item ${location.pathname === '/community' ? 'active' : ''}`}>
                    <i className="fa-regular fa-user-group"></i>
                    <span>커뮤니티</span>
                </Link>
                <Link to="/register" className="nav-item">
                    <i className="fa-regular fa-square-plus"></i>
                    <span>등록</span>
                </Link>
                <div className="nav-item">
                    <i className="fa-regular fa-comment-dots"></i>
                    <span>채팅</span>
                </div>
                <div className="nav-item">
                    <i className="fa-regular fa-user"></i>
                    <span>마이</span>
                </div>
            </nav>
        </div>
    );
};

export default Community;
