import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookSearch } from '../hooks/useBookSearch';
import OnboardingBookCard from '../components/OnboardingBookCard';
import './onboarding.css'; // Using the existing CSS file

const genres = [
    '소설', '시/에세이', '인문', '사회과학', '역사/문화',
    '종교', '정치/사회', '예술/대중문화', '과학', '기술/공학',
    '컴퓨터/IT', '자기계발', '경제/경영', '가정/육아', '건강/취미'
];

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Step 1 for genres, Step 2 for books
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Genre Selection State ---
    const [selectedGenres, setSelectedGenres] = useState([]);

    // --- Book Selection State and Logic (from OnboardingPage2) ---
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

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleGenreSubmit = async () => {
        if (selectedGenres.length === 0) {
            alert('관심 장르를 하나 이상 선택해주세요.');
            return;
        }
        // Just move to step 2 - we'll save everything at the end
        setStep(2);
    };

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

    const handleBookSubmit = async () => {
        if (selectedBooks.length < 3) {
            alert('Please select at least 3 books.');
            return;
        }

        // Get pending registration data
        const pendingRegistration = localStorage.getItem('pendingRegistration');
        if (!pendingRegistration) {
            alert('Registration data not found. Please start over.');
            navigate('/register');
            return;
        }

        const { nickname, email, password } = JSON.parse(pendingRegistration);
        setIsSubmitting(true);

        try {
            // Complete registration with all onboarding data in one request
            const response = await fetch('http://localhost:3001/api/auth/register-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nickname,
                    email,
                    password,
                    genres: selectedGenres,
                    books: selectedBooks,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Clear pending registration data
                localStorage.removeItem('pendingRegistration');
                // Save token
                localStorage.setItem('token', data.token);
                alert('Registration complete!');
                navigate('/home');
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error completing registration:', error);
            alert('An error occurred while completing registration.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGenreStep = () => (
        <>
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
            <button className="save-button" onClick={handleGenreSubmit} disabled={selectedGenres.length === 0}>
                선택 완료
            </button>
        </>
    );

    const renderBookStep = () => {
        const isCompletionEnabled = selectedBooks.length >= 3;
        return (
            <>
                <div className="book-step-header">
                    <div className="title-section">
                        <h1 className="title-text">
                            좋아하는 도서를<br />3개 이상 선택해주세요.
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
                                검색
                            </button>
                        </div>
                    </form>
                </div>
                <div className="book-grid">
                    {books.map((book, index) => (
                        <div ref={index === books.length - 1 ? lastBookElementRef : null} key={book.id}>
                            <OnboardingBookCard
                                book={book}
                                isSelected={selectedBooks.includes(book.id)}
                                onSelect={toggleBookSelection}
                            />
                        </div>
                    ))}
                </div>
                {isLoading && <div className="loading-indicator">도서를 불러오는 중...</div>}
                <footer className="onboarding-page-footer">
                    <button
                        onClick={handleBookSubmit}
                        disabled={!isCompletionEnabled || isSubmitting}
                        className={`complete-button ${isCompletionEnabled && !isSubmitting ? 'enabled' : ''}`}
                    >
                        {isSubmitting ? '처리 중...' : '완료'}
                    </button>
                </footer>
            </>
        );
    };

    return (
        <div className="onboarding-container">
            <button className="back-button" onClick={() => step === 1 ? navigate(-1) : setStep(1)}>
                <img src="/back-arrow.png" alt="Back" />
            </button>
            {step === 1 ? renderGenreStep() : renderBookStep()}
        </div>
    );
};

export default Onboarding;