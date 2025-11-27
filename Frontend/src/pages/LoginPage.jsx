// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('handleLogin called. Email:', email, 'Password:', password);
        fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            console.log('Login API raw response:', response); // 응답 객체 전체를 확인
            if (!response.ok) {
                // HTTP 오류 상태 (예: 401 Unauthorized) 처리
                return response.json().then(errorData => {
                    throw new Error(errorData.message || '사용자 정보가 일치하지 않습니다. 계정이 없다면 회원가입을 해주세요.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Login API parsed data:', data); // JSON으로 변환된 데이터를 확인
            if (data.token) {
                localStorage.setItem('token', data.token);
                
                console.log('Is new user? ->', data.isNewUser); // isNewUser 값 확인

                // 백엔드에서 isNewUser 값을 보내준다고 가정
                if (data.isNewUser === true) {
                    console.log('Navigating to /onboarding...');
                    navigate('/onboarding');
                } else {
                    console.log('Navigating to /home...');
                    navigate('/home');
                }
            } else {
                // 백엔드가 200 OK를 반환하지만 토큰이 없는 경우 (논리적 실패)
                throw new Error(data.message || '로그인에 실패했습니다. 사용자 정보가 일치하지 않습니다.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert(error.message || '로그인 중 오류가 발생했습니다.'); // 구체적인 오류 메시지 표시
        });
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic here
        console.log('Forgot password clicked');
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
                        <button onClick={() => { console.log('Login button clicked!'); handleLogin(); }} className="login-button primary">
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
    );
};

export default LoginPage;
