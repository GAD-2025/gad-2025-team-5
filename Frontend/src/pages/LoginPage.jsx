import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import ErrorModal from '../components/ErrorModal'; // Import the modal
import logo from '../assets/logo.png'; // Import the logo image

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
            if (error.message.includes('잘못된 인증 정보입니다.')) {
                setModalInfo({
                    show: true,
                    title: '로그인 실패',
                    message: '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.'
                });
            } else {
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
            <div className="login-container" data-name="로그인" data-node-id="666:2480">
                <div className="logo-section">
                    <img src={logo} alt="Logo" className="app-logo" />
                </div>

                <div className="form-section">
                    <p className="label" data-node-id="885:2654">이메일</p>
                    <div className="input-container" data-node-id="885:2655">
                        <input 
                            type="email" 
                            placeholder="이메일을 입력해주세요." 
                            className="input-field" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    
                    <div className="password-section" data-node-id="885:2657">
                        <p className="label" data-node-id="885:2659">비밀번호</p>
                        <div className="input-container" data-node-id="885:2660">
                            <input 
                                type="password" 
                                placeholder="비밀번호를 입력해주세요." 
                                className="input-field"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                <div className="login-button-section" data-node-id="885:2663">
                    <button onClick={handleLogin} className="login-button" data-node-id="885:2664">
                        로그인
                    </button>
                </div>
                
                <div className="links-section" data-node-id="885:2673">
                    <p className="link-text" data-node-id="885:2668">아이디 찾기</p>
                    <div className="separator-line" data-node-id="885:2672">
                    </div>
                    <p onClick={handleForgotPassword} className="link-text" data-node-id="885:2670">비밀번호 찾기</p>
                </div>

                <div className="signup-section" data-node-id="885:2687">
                    <p className="signup-prompt" data-node-id="885:2688">이메일이 없으신가요?</p>
                    <div className="signup-link-container" data-node-id="885:2698">
                        <p onClick={handleCreateAccount} className="signup-link" data-node-id="885:2696">회원가입 하러가기</p>
                        <div className="signup-link-underline" data-node-id="885:2697">
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
