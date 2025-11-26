import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3001/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 201) {
                alert('Signup successful! Please login.');
                navigate('/login');
            } else {
                const message = await response.text();
                alert(`Signup failed: ${message}`);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup.');
        }
    };

    return (
        <div className="signup-container">
            <header className="signup-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#1C1E21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </header>
            <main className="signup-content">
                <h1>회원가입</h1>
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
                    <div className="input-group">
                        <label htmlFor="confirm-password">비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button">회원가입</button>
                </form>
                <p className="login-prompt">
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </p>
            </main>
        </div>
    );
};

export default Signup;
