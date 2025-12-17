
import React, { useState } from 'react';
import './BookCard.css';
import { ReactComponent as HeartIcon } from './assets/heart.svg'; // 좋아요 아이콘 추가
import axios from 'axios'; // axios 임포트

const BookCard = ({ book, showCurrency = true, onSelect }) => {
  // book 객체가 유효한지 확인
  if (!book) {
    return null;
  }

  const { img, title, authors, price, grade, timestamp } = book;
  const [isLiked, setIsLiked] = useState(book.isLiked || false); // isLiked 상태 관리

  const handleLikeToggle = async (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        // navigate('/login'); // 필요하다면 로그인 페이지로 이동
        return;
    }
    if (!book || !book.id) return;

    const originalIsLiked = isLiked;
    setIsLiked(prev => !prev); // 낙관적 UI 업데이트

    try {
        const headers = { 'Authorization': `Bearer ${token}` };
        if (!originalIsLiked) {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/likes`, { bookId: book.id }, { headers });
        } else {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/likes/${book.id}`, { headers });
        }
    } catch (err) {
        console.error('좋아요 상태 업데이트 실패:', err);
        setIsLiked(originalIsLiked); // 오류 발생 시 UI 되돌리기
        alert('좋아요 상태를 업데이트하는 데 실패했습니다.');
    }
  };

  return (
    <div className="book-card" onClick={() => onSelect(book.id)}>
      <div 
        className="book-thumbnail-wrapper"
        style={{ 
          width: '100%', 
          aspectRatio: '2 / 3', 
          overflow: 'hidden', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#eee',
          borderRadius: '4px'
        }}
      >
        {img ? (
          <img 
            src={img} 
            alt={title} 
            className="book-thumbnail" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block' 
            }} 
          />
        ) : (
          <div className="book-thumbnail-placeholder">
            <span>{title}</span>
          </div>
        )}
        {grade && <div className="seller-badge">{grade}</div>}
      </div>
      <div className="book-info">
        <div className="title-row">
          <h3 className="book-title">{title || '제목 없음'}</h3>
          <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeToggle}>
            <HeartIcon />
          </button>
        </div>
        <p className="book-author">{authors && authors.length > 0 ? authors.join(', ') : '저자 미상'}</p>
        <p className="book-price">{price ? `${price.toLocaleString()}${showCurrency ? '원' : ''}` : '가격 정보 없음'}</p>
        {timestamp && <p className="book-timestamp">{timestamp}</p>}
      </div>
    </div>
  );
};

export default BookCard;
