// src/pages/OnboardingPage2.js

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookSearch } from '../hooks/useBookSearch';
import OnboardingBookCard from '../components/OnboardingBookCard';
import './OnboardingPage2.css';

const OnboardingPage2 = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('Bestseller');
  const { books, isLoading, hasMore, search, loadMore } = useBookSearch(query);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore(query);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore, query]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
    search(searchTerm);
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleComplete = () => {
    if (selectedBooks.length >= 3) {
      const selectedBookDetails = books.filter(book => selectedBooks.includes(book.id));
      console.log('Selected Books:', selectedBookDetails);
      
      // 예시: 전역 상태 관리 라이브러리(Zustand, Recoil 등)에 선택된 도서 저장
      // import { useBookStore } from './stores/bookStore';
      // const { setOnboardingBooks } = useBookStore.getState();
      // setOnboardingBooks(selectedBookDetails);

      navigate('/home');
    }
  };

  const isCompletionEnabled = selectedBooks.length >= 3;

  return (
    <div className="onboarding-page-container">
      <header className="onboarding-page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1C1E21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className="onboarding-page-content">
        <div className="title-section">
          <h1 className="title-text">
            좋아하는 도서를
            <br />
            3개 이상 선택해주세요.
          </h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="이곳에 찾고 싶은 작품을 입력해주세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#A0A5AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#A0A5AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>

        <div className="book-grid">
          {books.map((book, index) => {
            const isLastElement = index === books.length - 1;
            return (
              <div ref={isLastElement ? lastBookElementRef : null} key={book.id}>
                <OnboardingBookCard
                  book={book}
                  isSelected={selectedBooks.includes(book.id)}
                  onSelect={toggleBookSelection}
                />
              </div>
            );
          })}
        </div>
        {isLoading && <div className="loading-indicator">도서를 불러오는 중...</div>}
      </main>

      <footer className="onboarding-page-footer">
        <div className="page-indicator">
          <div className="dot"></div>
          <div className="dot active"></div>
          <div className="dot"></div>
        </div>
        <button
          onClick={handleComplete}
          disabled={!isCompletionEnabled}
          className={`complete-button ${isCompletionEnabled ? 'enabled' : ''}`}
        >
          완료
        </button>
      </footer>
    </div>
  );
};

export default OnboardingPage2;
