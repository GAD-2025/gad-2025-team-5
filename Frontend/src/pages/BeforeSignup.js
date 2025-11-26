import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BeforeSignup.css';

const BeforeSignup = () => {
    const navigate = useNavigate();

    return (
        <div className="beforesignup-container">
            <header className="beforesignup-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#1C1E21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </header>
            <div className="beforesignup-content">
                <h1>책의 세계로<br />빠져보세요</h1>
                <p>새 계정을 만들거나 기존 계정으로 로그인하세요.</p>
                
                <button className="beforesignup-button email" onClick={() => navigate('/signup')}>
                    이메일로 시작하기
                </button>
                <button className="beforesignup-button google">
                    Google로 시작하기
                </button>
                <button className="beforesignup-button apple">
                    Apple로 시작하기
                </button>

                <p className="login-prompt">
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </p>
            </div>
        </div>
    );
};

export default BeforeSignup;
