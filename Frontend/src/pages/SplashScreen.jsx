import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

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
                <h1 className="splash-title">책담</h1>
            </div>
        </div>
    );
};

export default SplashScreen;
