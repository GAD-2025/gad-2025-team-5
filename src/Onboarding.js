import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './onboarding.css';

const genres = [
    '소설', '시/에세이', '인문', '사회과학', '역사/문화',
    '종교', '정치/사회', '예술/대중문화', '과학', '기술/공학',
    '컴퓨터/IT', '자기계발', '경제/경영', '가정/육아', '건강/취미'
];

const Onboarding = () => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const navigate = useNavigate();

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleSave = () => {
        // Here you would typically save the user's preferences
        console.log('Selected genres:', selectedGenres);
        navigate('/home'); // Navigate to the home page
    };

    return (
        <div className="onboarding-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                {/* Assuming you have a back arrow icon in your public folder */}
                <img src="/back-arrow.png" alt="Back" />
            </button>

            <div className="onboarding-header">
                <h1>어떤 책을 좋아하세요?</h1>
                <p>관심 장르를 선택해주세요.</p>
            </div>

            <div className="genre-list">
                {genres.map(genre => (
                    <button
                        key={genre}
                        className={`genre-button ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                        onClick={() => toggleGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <button className="save-button" onClick={handleSave}>
                선택 완료
            </button>
        </div>
    );
};

export default Onboarding;
