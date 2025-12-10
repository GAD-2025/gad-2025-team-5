import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import './style.css'; // Assuming style.css contains bottom-nav styles

const Layout = () => {
    const location = useLocation();

    return (
        <div className="iphone-container">
            <Outlet />
            <nav className="bottom-nav">
                <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
                    <i className="fa-solid fa-house"></i>
                    <span>홈</span>
                </Link>
                <Link to="/community" className={`nav-item ${location.pathname === '/community' ? 'active' : ''}`}>
                    <i className="fa-regular fa-user-group"></i>
                    <span>커뮤니티</span>
                </Link>
                <Link to="/register" className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}>
                    <i className="fa-regular fa-square-plus"></i>
                    <span>등록</span>
                </Link>
                <Link to="/chat" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
                    <i className="fa-regular fa-comment-dots"></i>
                    <span>채팅</span>
                </Link>
                <Link to="/mypage" className={`nav-item ${location.pathname === '/mypage' ? 'active' : ''}`}>
                    <i className="fa-regular fa-user"></i>
                    <span>마이</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
