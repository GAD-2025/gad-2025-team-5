import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // We will create this file for specific styles

const RegisterPage = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        age: false,
    });

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleAgreementChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'all') {
            setAgreements({
                all: checked,
                terms: checked,
                privacy: checked,
                age: checked,
            });
        } else {
            const newAgreements = { ...agreements, [name]: checked };
            const allChecked = newAgreements.terms && newAgreements.privacy && newAgreements.age;
            setAgreements({ ...newAgreements, all: allChecked });
        }
    };
    
    const isFormValid = nickname && email && password && confirmPassword && password === confirmPassword && agreements.all;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
                navigate('/'); // Navigate to login page
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    };

    // Styles adapted from Register.js
    const labelStyle = {
        fontSize: '12pt',
        color: '#323232',
        fontWeight: '700',
        marginLeft: '11px',
        display: 'block',
        marginBottom: '10px'
    };

    const inputBoxStyle = {
        width: '100%',
        height: '41px',
        backgroundColor: '#F8F3E6',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 15px',
        boxSizing: 'border-box',
        marginBottom: '15px'
    };

    const inputStyle = {
        width: '100%',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '10pt',
        fontWeight: '400',
        color: '#323232',
        outline: 'none'
    };

    return (
        <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
            <header className="app-header-register">
                <Link to="/" className="back-button-register">
                    <i className="fa-solid fa-chevron-left"></i>
                </Link>
                <h1 className="header-title-register">회원가입</h1>
            </header>

            <main className="screen-content-register">
                <div className="profile-image-section" onClick={openFileDialog}>
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-image-preview" />
                    ) : (
                        <div className="profile-image-placeholder">
                            <i className="fa-solid fa-camera"></i>
                            <p>프로필 사진 등록(선택)</p>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                <div className="form-section">
                    <label style={labelStyle}>이름 <span style={{ color: '#C73C3C' }}>*</span></label>
                    <div style={inputBoxStyle}>
                        <input type="text" style={inputStyle} placeholder="이름을 입력하세요" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>

                    <label style={labelStyle}>이메일 <span style={{ color: '#C73C3C' }}>*</span></label>
                    <div style={inputBoxStyle}>
                        <input type="email" style={inputStyle} placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <label style={labelStyle}>비밀번호 <span style={{ color: '#C73C3C' }}>*</span></label>
                    <div style={inputBoxStyle}>
                        <input type="password" style={inputStyle} placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <label style={labelStyle}>비밀번호 확인 <span style={{ color: '#C73C3C' }}>*</span></label>
                    <div style={inputBoxStyle}>
                        <input type="password" style={inputStyle} placeholder="비밀번호를 다시 입력하세요" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>

                <div className="agreement-section">
                    <div className="agreement-all">
                        <label>
                            <input type="checkbox" name="all" checked={agreements.all} onChange={handleAgreementChange} />
                            전체 동의
                        </label>
                    </div>
                    <hr className="divider" />
                    <div className="agreement-item">
                        <label>
                            <input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreementChange} />
                            이용약관 동의 (필수)
                        </label>
                    </div>
                    <div className="agreement-item">
                        <label>
                            <input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} />
                            개인정보 수집 및 이용 동의 (필수)
                        </label>
                    </div>
                    <div className="agreement-item">
                        <label>
                            <input type="checkbox" name="age" checked={agreements.age} onChange={handleAgreementChange} />
                            만 14세 이상입니다 (필수)
                        </label>
                    </div>
                </div>

                <div className="bottom-button-container-register">
                     <button className="signup-button" onClick={handleSubmit} disabled={!isFormValid}>
                        가입하기
                    </button>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
