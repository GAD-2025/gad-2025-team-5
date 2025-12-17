import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // We will create this file for specific styles
import ErrorModal from '../components/ErrorModal'; // Import the ErrorModal

const RegisterPage = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    
    const [nicknameStatus, setNicknameStatus] = useState('idle'); // idle, checking, available, taken
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', buttonText: '다시 시도' });

    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        age: false,
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
                age: checked,
            });
        } else {
            const newAgreements = { ...agreements, [name]: checked };
            const allChecked = newAgreements.terms && newAgreements.privacy && newAgreements.age;
            setAgreements({ ...newAgreements, all: allChecked });
        }
    };

    const isFormValid = nicknameStatus === 'available' && email && password && confirmPassword && password === confirmPassword && agreements.terms && agreements.privacy && agreements.age;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            // You can show a generic error message or highlight the invalid fields
            setModalInfo({ show: true, title: '정보를 확인해주세요', message: '모든 필수 항목을 올바르게 입력하고 약관에 동의해야 합니다.' });
            return;
        }

        const pendingRegistration = {
            nickname,
            email,
            password,
        };

        localStorage.setItem('pendingRegistration', JSON.stringify(pendingRegistration));

        navigate('/onboarding');
    };
    
    // Styles - you can move them to a separate CSS file if you prefer
    const labelStyle = {
        alignSelf: 'flex-start',
        color: '#333333',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
    };

    const inputBoxStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #DCDCDC',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        flexGrow: 1,
        fontSize: '16px',
    };

    const nicknameMessageStyle = {
        fontSize: '12px',
        color: nicknameStatus === 'available' ? '#2FA068' : '#C73C3C',
        marginTop: '-15px',
        alignSelf: 'flex-start',
        marginBottom: '10px',
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
            <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
                <header className="app-header-register">
                    <Link to="/login" className="back-button-register">
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
                        <label style={labelStyle}>닉네임 <span style={{ color: '#C73C3C' }}>*</span></label>
                        <div style={{...inputBoxStyle, marginBottom: '5px', display: 'flex', gap: '10px' }}>
                            <input type="text" style={inputStyle} placeholder="닉네임을 입력하세요" value={nickname} onChange={handleNicknameChange} />
                            {nicknameStatus === 'available' ? (
                                <i className="fa-solid fa-check-circle" style={{ color: '#2FA068', fontSize: '20px' }}></i>
                            ) : (
                                <button onClick={handleNicknameCheck} className="check-button" disabled={nicknameStatus === 'checking'}>
                                    {nicknameStatus === 'checking' ? '확인 중...' : '중복 확인'}
                                </button>
                            )}
                        </div>
                        {nicknameMessage && <p style={nicknameMessageStyle}>{nicknameMessage}</p>}


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
        </>
    );
};

export default RegisterPage;