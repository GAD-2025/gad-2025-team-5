import React from 'react';
import './RegisteringPage.css';

const RegisteringPage = () => {
    // This component now only shows a loading message.
    // The actual registration logic has been moved to Register.js
    // It will be displayed briefly while the API call is in progress.
    return (
        <div className="registering-page">
            <p className="registering-message">
                <span className="highlight">등록 중</span>이에요!
                <br />
                잠시만 기다려주세요
            </p>
        </div>
    );
};

export default RegisteringPage;