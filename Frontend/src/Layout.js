import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import './style.css'; // Assuming style.css contains bottom-nav styles

const Layout = () => {
    const location = useLocation();
    const showNavBar = !['/register', '/register2', '/splash', '/login'].includes(location.pathname) && !location.pathname.startsWith('/books/');

    const activeColor = "#389D4F"; // 메인 컬러
    const inactiveColor = "lightgrey"; // 비활성 컬러 (BottomNavBar.css의 기본값)

    return (
        <div className={`iphone-container ${showNavBar ? 'has-bottom-nav' : ''}`}>
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <div className="screen-content">
                <div className="scrollable-content">
                    <Outlet />
                </div>
            </div>
            {showNavBar && (
                <nav className="bottom-nav">
                    <Link to="/home" className="nav-item">
                        <i className="fa-solid fa-house" style={{ color: location.pathname === '/home' ? activeColor : inactiveColor }}></i>
                        <span style={{ color: location.pathname === '/home' ? activeColor : inactiveColor }}>홈</span>
                    </Link>
                    <Link to="/community" className="nav-item">
                        <i className="fa-regular fa-user-group" style={{ color: location.pathname === '/community' ? activeColor : inactiveColor }}></i>
                        <span style={{ color: location.pathname === '/community' ? activeColor : inactiveColor }}>커뮤니티</span>
                    </Link>
                    <Link to="/register" className="nav-item">
                        <i className="fa-regular fa-square-plus" style={{ color: location.pathname === '/register' ? activeColor : inactiveColor }}></i>
                        <span style={{ color: location.pathname === '/register' ? activeColor : inactiveColor }}>등록</span>
                    </Link>
                    <Link to="/chat" className="nav-item">
                        <i className="fa-regular fa-comment-dots" style={{ color: location.pathname === '/chat' ? activeColor : inactiveColor }}></i>
                        <span style={{ color: location.pathname === '/chat' ? activeColor : inactiveColor }}>채팅</span>
                    </Link>
                    <Link to="/mypage" className="nav-item">
                        <i className="fa-regular fa-user" style={{ color: location.pathname === '/mypage' ? activeColor : inactiveColor }}></i>
                        <span style={{ color: location.pathname === '/mypage' ? activeColor : inactiveColor }}>마이</span>
                    </Link>
                </nav>
            )}
        </div>
    );
};

export default Layout;
