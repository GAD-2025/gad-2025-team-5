import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { allBooks, recommendationCategories } from './bookData';
import './BookDetail.css';
import BottomNavBar from './BottomNavBar';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);

    useEffect(() => {
        const foundBook = allBooks[id];
        if (foundBook) {
            setBook(foundBook);
            const relatedKeys = recommendationCategories.recommend || Object.keys(allBooks).slice(0, 3);
            const related = relatedKeys.map(key => allBooks[key]).filter(Boolean);
            setRelatedBooks(related);
        } else {
            console.error('Book not found:', id);
        }
    }, [id]);

    if (!book) {
        return (
            <div className="iphone-container">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="iphone-container">
            <header className="detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
            </header>
            <div className="book-detail-content">
                <div className="book-image-section">
                    <img src={book.img} alt={book.title} className="book-main-image" />
                </div>

                <div className="book-info-section">
                    <div className="title-like-row">
                        <h1>{book.title} <span className="author-subtitle">{book.authors.join(', ')}</span></h1>
                        <button className="like-button">
                            <i className="fa-regular fa-heart"></i>
                        </button>
                    </div>
                    <div className="book-meta">
                        <span className={`grade grade-${book.badge}`}>{book.badge}급</span>
                        <span className="date">제품 등록일 - {book.date}</span>
                    </div>
                    <p className="price">{book.price}</p>
                </div>

                import { getOrCreateChat } from './chatManager';
                //...
                const BookDetail = () => {
                    const { id } = useParams();
                    const navigate = useNavigate();
                    //...
                    const handleChatClick = () => {
                        const chatId = getOrCreateChat(book.id);
                        if (chatId) {
                            navigate(`/chat/${chatId}`);
                        }
                    };
                    //...
                    return (
                        //...
                                <div className="action-buttons">
                                    <button onClick={handleChatClick} className="chat-button">판매자와 채팅하기</button>
                                    <Link to="/payment" className="purchase-button">구매하기</Link>
                                </div>
                        //...
                    );
                };
                <div className="divider"></div>

                <div className="seller-section">
                    <div className="seller-info">
                        <img src="/images/seller-icon.png" alt={book.seller} className="seller-avatar" />
                        <div className="seller-details">
                            <p className="seller-name">{book.seller}</p>
                            <p className="seller-role">{book.seller_role}</p>
                        </div>
                    </div>
                    <div className="seller-rating">
                        <span>신뢰도</span>
                        <div className="stars">
                            {'★'.repeat(5)}
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="detail-section">
                    <h2>판매자의 한줄평</h2>
                    <p>{book.seller_comment}</p>
                </div>

                <div className="detail-section">
                    <h2>판매자가 이야기하는 책 상태</h2>
                    <p>{book.book_status}</p>
                </div>

                <div className="detail-section">
                    <h2>책소개</h2>
                    <p>{book.book_intro}</p>
                </div>

                <div className="detail-section category-section">
                    <h2>관련 분류</h2>
                    <div className="category-info">
                        <span>{book.category}</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="related-books-section">
                    <h2>이 책을 읽은 사람들이 같이 읽은 책</h2>
                    <div className="related-books-list">
                        {relatedBooks.map(item => (
                            <Link to={`/books/${item.id}`} key={item.id} className="related-book-card">
                                <img src={item.img} alt={item.title} />
                                <p className="related-book-title">{item.title}</p>
                                <p className="related-book-author">{item.authors.join(', ')}</p>
                                <p className="related-book-price">{item.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNavBar />
        </div>
    );
};

export default BookDetail;
