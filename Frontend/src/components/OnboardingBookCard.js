// src/components/OnboardingBookCard.js

import React from 'react';
import './OnboardingBookCard.css';

const OnboardingBookCard = ({ book, isSelected, onSelect }) => {
  const handleSelect = () => {
    onSelect(book.id);
  };

  return (
    <div
      className={`onboarding-book-card ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      {isSelected && (
        <div className="onboarding-selected-badge">
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4.5L4.33333 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="onboarding-book-thumbnail-wrapper">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={book.title} className="onboarding-book-thumbnail" />
        ) : (
          <div className="onboarding-book-thumbnail-placeholder">
            <span>{book.title}</span>
          </div>
        )}
      </div>
      <div className="onboarding-book-info">
        <p className="onboarding-book-title">{book.title}</p>
        <p className="onboarding-book-author">{book.authors && book.authors.length > 0 ? book.authors.join(', ') : '작자 미상'}</p>
      </div>
    </div>
  );
};

export default OnboardingBookCard;
