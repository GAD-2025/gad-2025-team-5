import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allBooks } from '../bookData';
import BookCard from '../BookCard';
import '../style.css'; // Reusing some styles

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const books = Object.values(allBooks).filter(book => book.category.split(' > ').map(c => c.trim()).includes(categoryName));

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
                <header className="app-header">
                    <button onClick={() => navigate(-1)} className="back-button" style={{ color: 'black' }}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h1 className="logo">{categoryName}</h1>
                    <div className="header-icons">
                        <i className="fa-regular fa-magnifying-glass"></i>
                        <div className="notification-icon">
                            <i className="fa-regular fa-bell"></i>
                        </div>
                    </div>
                </header>
                <div className="scrollable-content">
                    <div className="book-list-vertical">
                        {books.length > 0 ? (
                            books.map(book => (
                                <BookCard key={book.id} book={book} onSelect={handleBookClick} />
                            ))
                        ) : (
                            <p>이 카테고리에는 아직 책이 없습니다.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CategoryPage;
