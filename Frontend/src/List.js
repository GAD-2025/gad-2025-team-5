import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css';
import './list.css';
import BookCard from './BookCard';
import { allBooks, recommendationCategories, realTimeCategories } from './bookData.js';

const List = () => {
    const { '*': category } = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        let booksToRender = [];
        let pageTitle = '';

        if (category === 'recommendations') {
            booksToRender = recommendationCategories.recommend.map(bookTitle => allBooks[bookTitle]);
            pageTitle = '추천 도서';
        } else if (category === 'realtime') {
            // Assuming 'new' for realtime, adjust if 'discounted' is needed
            booksToRender = realTimeCategories.new.map(bookTitle => allBooks[bookTitle]);
            pageTitle = '실시간 매물 도서';
        } else {
            pageTitle = '도서 목록';
        }
        setBooks(booksToRender);
        setTitle(pageTitle);
    }, [category]);

    const handleBookClick = (bookId) => {
        navigate(`/detail/${bookId}`);
    };

    return (
        <div className="iphone-container">
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <main className="screen-content">
                <header className="list-page-header">
                    <Link to="/home" className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <h1 className="list-page-title">{title}</h1>
                </header>

                <div className="list-page-content">
                    {books.map(book => (
                        <BookCard key={book.id} book={book} onSelect={handleBookClick} />
                    ))}
                </div>
                <nav className="bottom-nav">
                    <Link to="/home" className="nav-item">
                        <i className="fa-solid fa-house"></i>
                        <span>홈</span>
                    </Link>
                    <div className="nav-item">
                        <i className="fa-regular fa-user-group"></i>
                        <span>커뮤니티</span>
                    </div>
                    <Link to="/register" className="nav-item">
                        <i className="fa-regular fa-square-plus"></i>
                        <span>등록</span>
                    </Link>
                    <div className="nav-item">
                        <i className="fa-regular fa-comment-dots"></i>
                        <span>채팅</span>
                    </div>
                    <div className="nav-item">
                        <i className="fa-regular fa-user"></i>
                        <span>마이</span>
                    </div>
                </nav>
            </main>
        </div>
    );
};

export default List;
