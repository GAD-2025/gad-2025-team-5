import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './DetailPage.css';
import BookCard from './BookCard';
import BottomPurchaseBar from './BottomPurchaseBar';
import { allBooks, recommendationCategories } from './bookData.js';

const DetailPage = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const book = allBooks[title];

    // Use a static list for related books for now
    const relatedBooks = recommendationCategories.recommend.map(bookTitle => allBooks[bookTitle]);

    if (!book) {
        return <div>Book not found</div>;
    }

    const handlePurchaseClick = () => {
        navigate('/payment', { state: { book: book } });
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
                <header className="detail-header">
                    <Link to="/home" className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                </header>
                <div className="scrollable-content">
                    <div className="detail-page">
                        <img className="detail-image" src={book.img} alt={book.title} />
                        <div className="detail-title-section">
                            <h1 className="detail-title">{book.title}</h1>
                            <p className="detail-author">{book.author}</p>
                            <p className="detail-grade">{book.badge}급</p>
                            <p className="detail-date">제품 등록일 - {book.date}</p>
                            <div className="transaction-price-container">
                                <p className="detail-transaction">판매자가 원하는 거래 방식 - {book.transaction}</p>
                                <p className="detail-price">{book.price}</p>
                            </div>
                        </div>
                        <div className="detail-section seller-section">
                            <div className="seller-info">
                                <img src="/images/seller-icon.png" alt="seller icon" className="seller-icon" />
                                <div className="seller-details">
                                    <p className="seller-name">{book.seller}</p>
                                    <p className="seller-role">{book.seller_role}</p>
                                </div>
                            </div>
                            <div className="seller-rating">
                                <p>신뢰도 ★★★★★</p>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>판매자의 한줄평</h3>
                            <p>{book.seller_comment}</p>
                        </div>
                        <div className="detail-section">
                            <h3>판매자가 이야기 하는 책 상태</h3>
                            <p>{book.book_status}</p>
                        </div>
                        <div className="detail-section">
                            <h3>책소개</h3>
                            <p>{book.book_intro}</p>
                        </div>
                        <div className="detail-section">
                            <h3>관련분류</h3>
                            <p>{book.category}</p>
                        </div>
                        <div className="related-books">
                            <h2>이 책을 읽은 사람들이 같이 읽은 책</h2>
                            <div className="book-list-horizontal">
                                {relatedBooks.filter(b => b && b.title !== book.title).map(relatedBook => (
                                    <BookCard key={relatedBook.id} book={relatedBook} onSelect={() => navigate(`/book/${relatedBook.id}`)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <BottomPurchaseBar bookTitle={book.title} onPurchaseClick={handlePurchaseClick} />
        </div>
    );
};


export default DetailPage;