// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // 실제 인증 로직 없이 온보딩 첫 페이지로 이동
        navigate('/onboarding');
    };

    const handleCreateAccount = () => {
        navigate('/register-page');
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
                <div className="login-page-content">
                    <div className="login-header">
                        <div className="logo-icon"></div>
                        <h1 className="login-title">다시 돌아오신 걸 환영해요.</h1>
                        <p className="login-subtitle">이메일과 비밀번호를 입력해 주세요.</p>
                    </div>

                    <div className="login-form">
                        <input type="email" placeholder="이메일" className="login-input" />
                        <input type="password" placeholder="비밀번호" className="login-input" />
                        <button onClick={handleLogin} className="login-button primary">
                            로그인
                        </button>
                        <a href="#" className="forgot-password-link">비밀번호를 잊으셨나요?</a>
                    </div>

                    <div className="separator">
                        <span className="separator-text">또는</span>
                    </div>

                    <button onClick={handleCreateAccount} className="login-button dark">
                        회원가입
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
