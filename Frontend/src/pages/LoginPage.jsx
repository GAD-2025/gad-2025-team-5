// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import ErrorModal from '../components/ErrorModal'; // Import the modal

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const handleLogin = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    // Pass the specific error message from backend
                    throw new Error(errorData.message || '로그인 처리 중 문제가 발생했습니다.');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                if (data.isNewUser === true) {
                    navigate('/onboarding');
                } else {
                    navigate('/home');
                }
            } else {
                throw new Error(data.message || '로그인에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Login error:', error.message);
            // Check the error message to show the correct modal
            if (error.message.includes('잘못된 인증 정보입니다.')) {
                setModalInfo({
                    show: true,
                    title: '로그인 실패',
                    message: '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.'
                });
            } else {
                // Generic error for network issues etc.
                setModalInfo({
                    show: true,
                    title: '로그인 오류',
                    message: '서버에 연결할 수 없거나 네트워크에 문제가 발생했습니다.'
                });
            }
        });
    };

    const closeModal = () => {
        setModalInfo({ show: false, title: '', message: '' });
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    return (
        <>
            <ErrorModal 
                show={modalInfo.show}
                onClose={closeModal}
                title={modalInfo.title}
                message={modalInfo.message}
                buttonText="다시 시도"
            />
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
                            <input 
                                type="email" 
                                placeholder="이메일" 
                                className="login-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <input 
                                type="password" 
                                placeholder="비밀번호" 
                                className="login-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <button onClick={handleLogin} className="login-button primary">
                                로그인
                            </button>
                            <button onClick={handleForgotPassword} className="forgot-password-link">비밀번호를 잊으셨나요?</button>
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
        </>
    );
};

export default LoginPage;
