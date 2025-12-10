import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import './list.css';
import BookCard from './BookCard';
// import { allBooks, recommendationCategories, realTimeCategories } from './bookData.js';

const List = () => {
    const { '*': category } = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/books');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();

        if (category === 'recommendations') {
            setTitle('추천 도서');
        } else if (category === 'realtime') {
            setTitle('실시간 매물 도서');
        } else {
            setTitle('도서 목록');
        }
    }, [category]);

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
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
