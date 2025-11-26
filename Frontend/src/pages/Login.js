import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                alert('Login successful!');
                navigate('/onboarding');
            } else {
                const message = await response.text();
                alert(`Login failed: ${message}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        }
    };

    return (
        <div className="login-container">
            <header className="login-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#1C1E21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </header>
            <main className="login-content">
                <h1>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">로그인</button>
                </form>
                <p className="signup-prompt">
                    계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </p>
            </main>
        </div>
    );
};

export default Login;
