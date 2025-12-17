
import React from 'react';
import './BookCard.css';
import { ReactComponent as HeartIcon } from './assets/heart.svg'; // 좋아요 아이콘 추가

const BookCard = ({ book, showCurrency = true, onSelect }) => {
  // book 객체가 유효한지 확인
  if (!book) {
    return null;
  }

  const { img, title, authors, price, grade, timestamp } = book;

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
        <p className="book-title">{title || '제목 없음'}</p>
        <p className="book-author">{authors && authors.length > 0 ? authors.join(', ') : '저자 미상'}</p>
        <p className="book-price">{price ? `${price.toLocaleString()}${showCurrency ? '원' : ''}` : '가격 정보 없음'}</p>
        {timestamp && <p className="book-timestamp">{timestamp}</p>}
      </div>
      <button className="like-button">
        <HeartIcon />
      </button>
    </div>
  );
};

export default BookCard;
