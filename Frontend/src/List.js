import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './list.css';
import BookCard from './BookCard';
import { allBooks, recommendationCategories, realTimeCategories } from './bookData.js';

const List = () => {
    const { '*': category } = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [activeFilter, setActiveFilter] = useState('recommend'); // Default active filter

    useEffect(() => {
        let bookKeys = [];
        let currentTitle = '';

        if (category === 'recommendations') {
            currentTitle = '추천 도서';
            if (activeFilter === 'recommend') {
                bookKeys = recommendationCategories.recommend;
            } else if (activeFilter === 'popular') {
                bookKeys = recommendationCategories.popular;
            } else if (activeFilter === 'personalized') {
                bookKeys = recommendationCategories.personalized;
            }
        } else if (category === 'realtime') {
            currentTitle = '실시간 매물 도서';
            if (activeFilter === 'new') {
                bookKeys = realTimeCategories.new;
            } else if (activeFilter === 'discounted') {
                bookKeys = realTimeCategories.discounted;
            }
        } else {
            currentTitle = '도서 목록';
            bookKeys = Object.keys(allBooks);
        }
        
        const bookList = bookKeys.map(key => allBooks[key]).filter(Boolean);
        setBooks(bookList);
        setTitle(currentTitle);

    }, [category, activeFilter]); // Re-run effect when category or activeFilter changes

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    const handleFilterClick = (filterName) => {
        setActiveFilter(filterName);
    };

    return (
        <div className="list-page-container">
            <header className="list-page-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <h1 className="list-page-title">{title}</h1>
            </header>

            <div className="filter-buttons">
                {category === 'recommendations' && (
                    <>
                        <button 
                            className={`filter-button ${activeFilter === 'recommend' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('recommend')}
                        >
                            오늘의 추천
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'popular' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('popular')}
                        >
                            인기
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'personalized' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('personalized')}
                        >
                            내 취향 맞춤
                        </button>
                    </>
                )}
                {category === 'realtime' && (
                    <>
                        <button 
                            className={`filter-button ${activeFilter === 'new' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('new')}
                        >
                            새로운 매물
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'discounted' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('discounted')}
                        >
                            할인 매물
                        </button>
                    </>
                )}
            </div>

            <main className="list-page-content">
                {books.map(book => (
                    <BookCard key={book.id} book={book} onSelect={handleBookClick} showCurrency={false} />
                ))}
            </main>
        </div>
    );
};

export default List;