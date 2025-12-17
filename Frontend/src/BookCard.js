
import React from 'react';
import './BookCard.css';
import { ReactComponent as HeartIcon } from './assets/heart.svg'; // 좋아요 아이콘 추가

const BookCard = ({ book }) => {
  // book 객체가 유효한지 확인
  if (!book) {
    return null;
  }

  const { img, title, authors, price, grade, timestamp } = book;

  return (
    <div className="book-card">
      <div className="book-thumbnail-wrapper">
        {img ? (
          <img src={img} alt={title} className="book-thumbnail" />
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
        <p className="book-price">{price ? `${price.toLocaleString()}원` : '가격 정보 없음'}</p>
        {timestamp && <p className="book-timestamp">{timestamp}</p>}
      </div>
      <button className="like-button">
        <HeartIcon />
      </button>
    </div>
  );
};

export default BookCard;
