import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // We will create this file for specific styles
import ErrorModal from '../components/ErrorModal'; // Import the ErrorModal
import plusSvg from '../assets/plus.svg'; // Import the new plus SVG

const imgVector = "http://localhost:3845/assets/893ccd5d26b74629b9dbc064548537d083654fa0.svg";
const imgGroup1686556883 = "http://localhost:3845/assets/e373279521517c19a33128e2d6f1d8ed115916d8.svg";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    
    const [nicknameStatus, setNicknameStatus] = useState('idle'); // idle, checking, available, taken
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', buttonText: '다시 시도' });

    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        refund: false, // Changed from age to refund based on new design
    });

    const fileInputRef = useRef(null);

    const closeModal = () => {
        setModalInfo({ show: false, title: '', message: '' });
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
            setProfileImageFile(file);
        }
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setNicknameStatus('idle');
        setNicknameMessage('');
    };

    const handleNicknameCheck = async () => {
        if (!nickname) {
            setModalInfo({ show: true, title: '오류', message: '닉네임을 입력해주세요.' });
            return;
        }
        setNicknameStatus('checking');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`, {
                method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                setNicknameStatus('available');
                setNicknameMessage('사용 가능한 닉네임입니다.');
            } else {
                setNicknameStatus('taken');
                setNicknameMessage(data.message || '이미 사용 중인 닉네임입니다.');
            }
        } catch (error) {
            setNicknameStatus('idle');
            setNicknameMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleAgreementChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'all') {
            setAgreements({
                all: checked,
                terms: checked,
                privacy: checked,
                refund: checked,
            });
        } else {
            const newAgreements = { ...agreements, [name]: checked };
            const allChecked = newAgreements.terms && newAgreements.privacy && newAgreements.refund;
            setAgreements({ ...newAgreements, all: allChecked });
        }
    };

    const isFormValid = nicknameStatus === 'available' && email && password && confirmPassword && password === confirmPassword && agreements.terms && agreements.privacy && agreements.refund;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setModalInfo({ show: true, title: '정보를 확인해주세요', message: '모든 필수 항목을 올바르게 입력하고 약관에 동의해야 합니다.' });
            return;
        }

        const pendingRegistration = {
            nickname,
            email,
            password,
            profileImage: profileImageFile // Storing file object for now, will need proper handling
        };

        localStorage.setItem('pendingRegistration', JSON.stringify(pendingRegistration));
        navigate('/onboarding');
    };

    return (
        <>
            <ErrorModal 
                show={modalInfo.show}
                onClose={closeModal}
                title={modalInfo.title}
                message={modalInfo.message}
                buttonText={modalInfo.buttonText || '확인'}
            />
            <div className="register-container" data-node-id="666:2632">
                <header className="register-header">
                    <Link to="/login" className="back-button">
                        <img alt="back" className="back-arrow" src={imgGroup1686556883} />
                    </Link>
                    <p className="header-title">회원가입</p>
                </header>

                <div className="profile-image-container" onClick={openFileDialog}>
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-image-preview-new" />
                    ) : (
                        <div className="profile-image-placeholder-new">
                            <img alt="upload" className="upload-icon" src={plusSvg} />
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

                <div className="register-form-section">
                    <p className="register-label">닉네임<span className="required-star"> *</span></p>
                    <div className="input-with-button-container">
                        <input
                            type="text"
                            placeholder="닉네임을 입력해주세요"
                            className="register-input"
                            value={nickname}
                            onChange={handleNicknameChange}
                        />
                        {nicknameStatus === 'available' ? (
                            <img src={imgVector} alt="tick" className="tick-icon" />
                        ) : (
                            <button onClick={handleNicknameCheck} className="check-duplicate-button" disabled={nicknameStatus === 'checking'}>
                                {nicknameStatus === 'checking' ? '확인 중...' : '중복확인'}
                            </button>
                        )}
                    </div>
                     {nicknameMessage && <p className={`nickname-message ${nicknameStatus}`}>{nicknameMessage}</p>}
                    <p className="input-hint">한글, 영어, 숫자만 사용할 수 있어요. (최대 10자)</p>

                    <p className="register-label">이메일<span className="required-star"> *</span></p>
                    <div className="register-input-container">
                         <input type="email" placeholder="이메일을 입력해주세요." className="register-input-full" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <p className="register-label">비밀번호<span className="required-star"> *</span></p>
                    <div className="register-input-container">
                        <input type="password" placeholder="비밀번호를 입력해주세요." className="register-input-full" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    
                    <p className="register-label">비밀번호 재입력<span className="required-star"> *</span></p>
                    <div className="register-input-container">
                       <input type="password" placeholder="비밀번호를 재입력해주세요." className="register-input-full" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>

                <div className="separator-bar"></div>

                <div className="terms-section">
                    <div className="term-item">
                        <input type="checkbox" name="all" checked={agreements.all} onChange={handleAgreementChange} className="checkbox-custom"/>
                        <p className="term-label-bold">전체 동의</p>
                    </div>
                    <div className="term-item">
                        <input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreementChange} className="checkbox-custom"/>
                        <p className="term-label">(필수) 서비스 이용약관 동의</p>
                    </div>
                    <div className="term-item">
                        <input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="checkbox-custom"/>
                        <p className="term-label">(필수) 개인정보 수집 이용 및 제3자 제공 동의</p>
                    </div>
                    <div className="term-item">
                         <input type="checkbox" name="refund" checked={agreements.refund} onChange={handleAgreementChange} className="checkbox-custom"/>
                        <p className="term-label">(필수) 반품 및 환불 정책 동의</p>
                    </div>
                </div>

                <div className="submit-button-container">
                    <button onClick={handleSubmit} className="submit-button" disabled={!isFormValid}>
                        가입하기
                    </button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;