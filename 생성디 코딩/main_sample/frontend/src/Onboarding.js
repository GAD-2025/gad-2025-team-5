
import React, { useState } from 'react';
import './Onboarding.css';

const genres = [
  '문학',
  '인문 / 사회',
  '경제 / 경영',
  '과학 / 기술',
  '취미 / 실용',
  '예술 / 디자인',
  '교육 / 학습',
  '아동 / 청소년',
  '종교 / 철학',
  '잡지 / 기타',
];

const Onboarding = ({ onNext }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      if (selectedGenres.length < 3) {
        setSelectedGenres([...selectedGenres, genre]);
      } else {
        alert('최대 3개의 장르만 선택할 수 있습니다.');
      }
    }
  };

  return (
    <div className="onboarding-container">
      <button className="back-button">
  <img src="/Union.jpg" alt="뒤로가기" />
</button>
      <div className="onboarding-header">
        <h1>선호하시는 도서유형을<br />선택해주세요.</h1>
      </div>      <div className="genre-list">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-button ${selectedGenres.includes(genre) ? 'selected' : ''}`}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <button className="save-button" onClick={onNext}>
        다음
      </button>
    </div>
  );
};

export default Onboarding;
