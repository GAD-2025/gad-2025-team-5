import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';
import BottomNavBar from './BottomNavBar';
import BottomPurchaseBar from './BottomPurchaseBar';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };

        const fetchRelatedBooks = async () => {
            try {
                // This is a placeholder for fetching related books.
                // In a real application, you would have a more sophisticated way to get related books.
                const response = await axios.get('http://localhost:3001/api/books');
                setRelatedBooks(response.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching related books:', error);
            }
        };

        fetchBook();
        fetchRelatedBooks();
    }, [id]);

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="book-detail-container">
            <div className="book-image-section">
                <img src={book.image_url} alt={book.title} className="book-main-image" />
                <div className="image-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>

            <div className="book-info-section">
                <h1>{book.title}</h1>
                {/* The author is not in the books table, so I'm commenting it out for now */}
                {/* <p className="author">{book.author}</p> */}
                <div className="book-meta">
                    {/* The grade is not in the books table, so I'm commenting it out for now */}
                    {/* <span className="grade">{book.grade}</span> */}
                    <span className="date">제품 등록일 - {new Date(book.created_at).toLocaleDateString()}</span>
                </div>
                <div className="price-transaction-section">
                  <p className="price">{book.price}원</p>
                  {/* The transaction method is not in the books table, so I'm commenting it out for now */}
                  {/* <p className="transaction-method">판매자가 원하는 거래 방식 - 직거래</p> */}
                </div>
            </div>

            <div className="divider"></div>

            {/* Seller info is not available in the book data, so I'm commenting it out for now */}
            {/* <div className="seller-section">
                <img src={book.seller.avatarUrl} alt={book.seller.name} className="seller-avatar" />
                <div className="seller-info">
                    <p className="seller-name">{book.seller.name}</p>
                    <div className="seller-rating">
                        <span>신뢰도</span>
                        {'★'.repeat(book.seller.rating)}
                        {'☆'.repeat(5 - book.seller.rating)}
                    </div>
                </div>
            </div> */}

            <div className="divider"></div>

            <div className="detail-section">
                <h2>판매자의 한줄평</h2>
                <p>{book.one_line_review}</p>
            </div>

            <div className="detail-section">
                <h2>판매자가 이야기하는 책 상태</h2>
                <p>{book.description}</p>
            </div>

            <div className="detail-section">
                <h2>책소개</h2>
                {/* bookIntro is not in the books table */}
                <p>{book.description}</p>
            </div>

            <div className="detail-section category-section">
                <h2>관련 분류</h2>
                {/* category is not in the books table */}
                {/* <div className="category-info">
                    <span>{book.category}</span>
                    <i className="fa-solid fa-chevron-right"></i>
                </div> */}
            </div>

            <div className="divider"></div>

            <div className="related-books-section">
                <h2>이 책을 읽은 사람들이 같이 읽은 책</h2>
                <div className="related-books-list">
                    {relatedBooks.map(item => (
                        <div key={item.id} className="related-book-card">
                            <img src={item.image_url} alt={item.title} />
                            <p className="related-book-title">{item.title}</p>
                            <p className="related-book-price">{item.price}원</p>
                            {/* <span className="related-book-status">{item.status}</span> */}
                        </div>
                    ))}
                </div>
            </div>
            <BottomPurchaseBar bookTitle={book.title} price={`${book.price}원`} />
            <BottomNavBar />
        </div>
    );
};

export default BookDetail;