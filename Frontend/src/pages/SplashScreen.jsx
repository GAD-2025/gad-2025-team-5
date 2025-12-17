import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import { ReactComponent as SplashLogo } from '../assets/logo.svg'; // 로고 SVG 파일 임포트

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000); // 3 seconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="iphone-container">
            <div className="splash-screen">
                <SplashLogo className="splash-logo" />
            </div>
        </div>
    );
};

export default SplashScreen;
