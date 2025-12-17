import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRegistration } from './context/RegistrationContext';
import './style.css';

const RegisterPage2 = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const navigate = useNavigate();
    const { registrationData, resetRegistrationData } = useRegistration();

    const grades = ['S급 - 새 책 수준', 'A급 - 상태 좋음', 'B급 - 보통 상태', 'C급 - 사용감 많음', 'D급 - 손상 심함'];
    const gradeMap = ['S', 'A', 'B', 'C', 'D'];

    const isGradeSelected = selectedGrade !== null;

    const handleRegister = async () => {
        if (!isGradeSelected) {
            alert('상품의 상태 등급을 선택해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // Navigate to loading page
        navigate('/registering');

        const formData = new FormData();
        
        Object.keys(registrationData).forEach(key => {
            if (key === 'imageFile' && registrationData[key]) {
                formData.append('image', registrationData[key]);
            } else if (registrationData[key] !== null && registrationData[key] !== undefined) {
                formData.append(key, registrationData[key]);
            }
        });

        const gradeString = `상태 등급: ${grades[selectedGrade]}`;
        const newDescription = `${registrationData.description}\n\n${gradeString}`;
        formData.set('description', newDescription);

        try {
            // Create a minimum delay promise
            const delay = new Promise(resolve => setTimeout(resolve, 2500));

            // Perform the API call
            const apiCall = axios.post(`${process.env.REACT_APP_API_URL}/api/books`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Wait for both the API call and the minimum delay
            const [response] = await Promise.all([apiCall, delay]);

            if (response.data && response.data.id) {
                resetRegistrationData(); // Clear the context
                navigate(`/books/${response.data.id}`, { replace: true });
            } else {
                navigate('/register', { state: { error: '책 등록에 실패했습니다. 다시 시도해주세요.' } });
            }
        } catch (err) {
            // Also wait a bit on error to prevent flashing
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.error('Error registering book:', err);
            navigate('/register', { state: { error: '책 등록 중 오류가 발생했습니다. 다시 시도해주세요.' } });
        }
    };
    
    // ... (rest of the component remains the same)
    return (
        <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <main className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '390px',
                    height: '112px',
                    backgroundColor: '#ffffff',
                    zIndex: 1
                }}>
                </div>
                <header className="app-header" style={{ justifyContent: 'center', position: 'relative', flexShrink: 0, height: '0px', zIndex: 2 }}>
                    <Link to="/register" className="back-button" style={{ position: 'absolute', top: '100px', left: '22px' }}>
                        <i className="fa-solid fa-chevron-left" style={{ fontSize: '26px', fontWeight: '400' }}></i>
                    </Link>
                    <h1 className="logo" style={{ fontSize: '14pt', fontWeight: '600', position: 'relative', top: '34px' }}>상품 등록</h1>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px', paddingBottom: '150px' }}>
                    <div style={{ marginTop: '82px' }}>
                        <div style={{ fontSize: '12pt', fontWeight: '600' }}>상품의 상태 등급을 선택하세요.</div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        {grades.map((grade, index) => (
                            <div
                                key={grade}
                                style={{
                                    width: '347px',
                                    height: '41px',
                                    backgroundColor: selectedGrade === index ? '#CEE3D3' : '#EAEAEA',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: '15px',
                                    boxSizing: 'border-box',
                                    marginTop: '10px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedGrade(index)}
                            >
                                <span style={{
                                    fontSize: '9pt',
                                    fontWeight: selectedGrade === index ? '600' : '400',
                                    color: selectedGrade === index ? '#247237' : '#8F8F8F'
                                }}>
                                    {grade}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '390px',
                    height: '137px',
                    backgroundColor: '#ffffff',
                    zIndex: 1
                }}>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '58px',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                        <div style={{ width: '7px', height: '7px', backgroundColor: '#D9D9D9', borderRadius: '50%' }}></div>
                        <div style={{ width: '7px', height: '7px', backgroundColor: '#1C8F39', borderRadius: '50%' }}></div>
                    </div>
                    <div
                        onClick={handleRegister}
                        style={{
                            width: '347px',
                            height: '48px',
                            backgroundColor: isGradeSelected ? '#1C8F39' : '#E9E9E9',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}>
                        <span style={{ fontSize: '12pt', color: '#ffffff', fontWeight: '700' }}>등록하기</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage2;
