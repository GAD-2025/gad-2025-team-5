// src/components/BookCard.js

import React from 'react';
import './BookCard.css'; // BookCard 전용 스타일

const BookCard = ({ book, isSelected, onSelect }) => {
  console.log('BookCard rendering:', book.title, 'Image:', book.img);
  const handleSelect = () => {
    onSelect(book.id);
  };

  return (
    <div
      className={`book-card ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      {isSelected && (
        <div className="selected-badge">
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4.5L4.33333 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="book-thumbnail-wrapper">
        {book.img ? (
          <img src={book.img} alt={book.title} className="book-thumbnail" />
        ) : (
          <div className="book-thumbnail-placeholder">
            <span>{book.title}</span>
          </div>
        )}
      </div>
      <div className="book-info">
        <p className="book-title">{book.title}</p>
        <p className="book-author">{book.authors && book.authors.length > 0 ? book.authors.join(', ') : '작자 미상'}</p>
      </div>
    </div>
  );
};

export default BookCard;