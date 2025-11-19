import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onHeartClick }) => {
    const heartIconClass = book.liked ? 'fa-solid fa-heart heart-icon active' : 'fa-regular fa-heart heart-icon';
    return (
        <div className="book-card">
            <Link to={`/book/${book.title}`}>
                <div className="book-cover">
                    <img src={book.img} alt={book.title} />
                    <div className="status-badge">{book.badge}</div>
                    <i className={heartIconClass} onClick={(e) => { e.preventDefault(); onHeartClick(book.title); }}></i>
                </div>
            </Link>
            <div className="book-info">
                <p className="title">{book.title}</p>
                <p className="author">{book.author}</p>
                <p className="price">{book.price}</p>
                <p className="time-ago">{book.time}</p>
            </div>
        </div>
    );
};

export default BookCard;
