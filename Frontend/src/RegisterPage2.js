import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRegistration } from './context/RegistrationContext';
import './RegisterPage2.css'; // Import new CSS file

// Import assets
import backArrow from './assets/back-arrow-2.svg';
import indicator from './assets/indicator-step2.svg';

const RegisterPage2 = () => {
    const [selectedGrade, setSelectedGrade] = useState(0); // Default to 'S' grade selected
    const [conditionDescription, setConditionDescription] = useState('');
    const navigate = useNavigate();
    const { registrationData, resetRegistrationData } = useRegistration();

    const grades = ['S급 - 새 책 수준', 'A급 - 상태 좋음', 'B급 - 보통 상태', 'C급 - 사용감 많음', 'D급 - 손상 심함'];
    
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

        navigate('/registering');

        const formData = new FormData();
        
        Object.keys(registrationData).forEach(key => {
            if (key === 'imageFile' && registrationData[key]) {
                formData.append('image', registrationData[key]);
            } else if (registrationData[key] !== null && registrationData[key] !== undefined) {
                formData.append(key, registrationData[key]);
            }
        });
        
        // Append the new condition description to the existing description
        const gradeString = `상태 등급: ${grades[selectedGrade]}`;
        const newDescription = `${registrationData.description || ''}\n\n${gradeString}\n\n${conditionDescription}`;
        formData.set('description', newDescription);
        
        // We need to set a grade, let's use the gradeMap logic from original file
        const gradeMap = ['S', 'A', 'B', 'C', 'D'];
        formData.append('grade', gradeMap[selectedGrade]);


        try {
            const delay = new Promise(resolve => setTimeout(resolve, 2500));
            const apiCall = axios.post(`${process.env.REACT_APP_API_URL}/api/books`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const [response] = await Promise.all([apiCall, delay]);

            if (response.data && response.data.id) {
                resetRegistrationData();
                navigate(`/books/${response.data.id}`, { replace: true });
            } else {
                navigate('/register', { state: { error: '책 등록에 실패했습니다. 다시 시도해주세요.' } });
            }
        } catch (err) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.error('Error registering book:', err);
            navigate('/register', { state: { error: '책 등록 중 오류가 발생했습니다. 다시 시도해주세요.' } });
        }
    };
    
    return (
        <div className="register-page-2-container">
            <header className="register-page-2-header">
                <Link to="/register" className="register-page-2-back-link">
                    <img src={backArrow} alt="Back"/>
                </Link>
                <h1 className="register-page-2-header-title">상품 등록</h1>
            </header>

            <main className="register-page-2-main">
                <section className="register-page-2-section">
                    <p className="register-page-2-section-title">
                        책 상태<span className="register-page-2-required-star"> *</span>
                    </p>
                    <div className="grade-buttons-container">
                        {grades.map((grade, index) => (
                            <button
                                key={grade}
                                className={`grade-button ${selectedGrade === index ? 'selected' : 'not-selected'}`}
                                onClick={() => setSelectedGrade(index)}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="register-page-2-section">
                    <p className="register-page-2-section-title">책 상태 설명</p>
                    <textarea
                        className="condition-description-textarea"
                        placeholder="책 상태에 대해서 자세하게 입력해주세요."
                        value={conditionDescription}
                        onChange={(e) => setConditionDescription(e.target.value)}
                    />
                </section>
            </main>

            <footer className="register-page-2-footer">
                <div className="register-page-2-footer-indicator">
                    <img src={indicator} alt="indicator" />
                </div>
                <button 
                    onClick={handleRegister} 
                    className="register-page-2-submit-button" 
                    disabled={!isGradeSelected}
                >
                    등록하기
                </button>
            </footer>
        </div>
    );
};

export default RegisterPage2;

