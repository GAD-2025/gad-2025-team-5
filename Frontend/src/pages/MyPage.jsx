import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user session/token
        localStorage.removeItem('token'); // Assuming token is stored in localStorage
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="mypage-container">
            <header className="app-header">
                <h1 className="logo">마이페이지</h1>
            </header>
            <main className="screen-content">
                <div className="profile-section">
                    <img src="/images/seller-icon.png" alt="Profile" className="profile-image" />
                    <div className="profile-info">
                        <p className="profile-name">수정님</p>
                        <p className="profile-email">email@example.com</p>
                    </div>
                </div>

                <div className="menu-section">
                    <div className="menu-item">
                        <span>판매 내역</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div className="menu-item">
                        <span>구매 내역</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div className="menu-item">
                        <span>관심 목록</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                </div>

                <div className="logout-section">
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MyPage;
