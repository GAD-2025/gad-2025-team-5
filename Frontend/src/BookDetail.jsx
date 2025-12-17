import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';
import BottomPurchaseBar from './BottomPurchaseBar';
import { getOrCreateChat } from './chatManager';

// Importing assets from the figma design
import backArrow2Svg from './assets/back-arrow-2.svg'; // Import the new back arrow SVG
const imgRectangle70 = "http://localhost:3845/assets/88a49fcfa86c29375579fa055fc132bf2f456556.png";
const imgRectangle62 = "http://localhost:3845/assets/5f2f3df40691bca02d73605b598ef82c5faed29f.png";
const imgRectangle63 = "http://localhost:3845/assets/78ed2c1ca26d9f7158239d54afe75d9fa5c3f68b.png";
const imgVector = "http://localhost:3845/assets/f99cf3cdf8769d82b845311b7c479fb52ca34601.svg";
const imgVector1 = "http://localhost:3845/assets/5d4910243fd2f68d09d4b0713ba557486d7917ce.svg";
const imgVector2 = "http://localhost:3845/assets/e6adf97fd7a223f4f0c535bfe6b19729c10911ec.svg";
const imgEllipse2 = "http://localhost:3845/assets/0ef51d768802ea209ce7f76a162d50b7dcc2e79d.svg";
const img = "http://localhost:3845/assets/a3ab4689414825407e76605c0aa67d043c03791c.svg";

const BookDetail = () => {
    const { id: initialId } = useParams();
    const navigate = useNavigate();
    
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    const fetchBookById = useCallback(async (bookId) => {
        const token = localStorage.getItem('token');
        try {
            const headers = { 'Authorization': token ? `Bearer ${token}` : '' };

            const [bookResponse, likeStatusResponse] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/books/${bookId}`, { headers }),
                token ? axios.get(`${process.env.REACT_APP_API_URL}/api/likes/status/${bookId}`, { headers }) : Promise.resolve({ data: { isLiked: false } })
            ]);

            setBook(bookResponse.data);
            setIsLiked(likeStatusResponse.data.isLiked);
            setError(null);
        } catch (err) {
            console.error(`책 상세 정보 로딩 에러 (ID: ${bookId}):`, err);
            setError("책 정보를 불러오는 데 실패했습니다.");
            setBook(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const resolveIdAndFetch = async () => {
            setLoading(true);
            if (!initialId) {
                setError("책 ID가 없습니다.");
                setLoading(false);
                return;
            }

            const isNumericId = !isNaN(parseInt(initialId));

            if (isNumericId) {
                await fetchBookById(initialId);
            } else {
                try {
                    const lookupResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/lookup?title=${initialId}`);
                    const numericId = lookupResponse.data.id;
                    
                    navigate(`/books/${numericId}`, { replace: true });
                    await fetchBookById(numericId);

                } catch (err) {
                    console.error(`책 ID 조회 에러 (title: ${initialId}):`, err);
                    setError(`'${initialId}' 책을 찾을 수 없습니다.`);
                    setLoading(false);
                }
            }
        };

        resolveIdAndFetch();
    }, [initialId, fetchBookById, navigate]);

    const handleLikeToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        if (!book || !book.id) return;

        const originalIsLiked = isLiked;
        setIsLiked(prev => !prev);

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            if (!originalIsLiked) {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/likes`, { bookId: book.id }, { headers });
            } else {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/likes/${book.id}`, { headers });
            }
        } catch (err) {
            console.error('좋아요 상태 업데이트 실패:', err);
            setIsLiked(originalIsLiked);
            alert('좋아요 상태를 업데이트하는 데 실패했습니다.');
        }
    };
    
    const handleChatClick = () => {
        const chatId = getOrCreateChat(book.id);
        if (chatId) {
            navigate(`/chat/${chatId}`);
        }
    };

    const handlePurchaseClick = () => {
        navigate('/payment', { state: { book: book } });
    };

    if (loading) {
        return <div className="book-detail-page"><div>Loading...</div></div>;
    }

    if (error) {
        return <div className="book-detail-page"><div>Error: {error}</div></div>;
    }

    if (!book) {
        return <div className="book-detail-page"><div>Book not found</div></div>;
    }

    return (
        <div className="book-detail-page" data-node-id="792:1153">
            <header className="detail-page-header">
                <img onClick={() => navigate(-1)} alt="back" className="header-icon" src={backArrow2Svg} />
                <div className="header-icons-right">
                    <img alt="search" className="header-icon" src={imgVector2} />
                    <img alt="bell" className="header-icon" src={imgVector} />
                    <img alt="menu" className="header-icon menu-icon" src={imgVector1} />
                </div>
            </header>

            <div className="book-image-container">
                <img alt={book.title} className="book-image" src={book.image_url || 'http://localhost:3845/assets/93a31d9e1f58272c46cf19f6c20f10ac79dc6ec7.png'} />
                <div className="book-grade-badge">
                    <img alt="grade" src={imgEllipse2} />
                    <p>B</p> {/* Assuming 'B' is a placeholder */}
                </div>
                <img alt="like" className="like-icon" src={img} onClick={handleLikeToggle} style={{ filter: isLiked ? 'none' : 'grayscale(100%)' }}/>
            </div>

            <div className="content-container">
                <div className="seller-info-box">
                    <div className="seller-avatar-container">
                        {/* Placeholder for seller avatar */}
                    </div>
                    <div className="seller-text-info">
                        <p className="seller-name">아날로그 독서가</p>
                        <p className="seller-location">서울특별시 성북구</p>
                    </div>
                    <div className="seller-rating-stars">
                        {/* Placeholder for stars */}
                    </div>
                </div>

                <div className="book-main-info">
                    <div className="book-title-row">
                        <p className="book-title">{book.title}</p>
                        <p className="book-author">{book.author}</p>
                    </div>
                </div>
                <p className="book-price">{book.price ? `${book.price.toLocaleString()}원` : '가격 정보 없음'}</p>
                
                <p className="book-description">
                    {book.description || '2025년 10월 20일날 책을 사서 한번 정독했어요\n밑줄도 없고 구김도 없이 깨끗해요'}
                </p>

                <div className="seller-review">
                    <p className="seller-review-title">판매자의 한줄평</p>
                    <p className="seller-review-content">
                        {book.one_line_review || '유명하고 잘읽힌다해서 읽어봤는데, 작가님 문체가 쉽게 잘읽혔고 매사 인생이 조용한적없는 나날이라 삶이 피곤하다생각했는데, 이 또한 경험이고 이런 여러 경험을하고 살아갈수 있는게 감사하다는 생각을하게되었어요.'}
                    </p>
                </div>
                
                <p className="transaction-method">거래 방식 - 직거래 (성신여대 정문 앞에서 거래합니다.)</p>
                <p className="book-genre">장르 - {book.genre || '소설'}</p>
                <p className="book-post-date">{book.created_at ? new Date(book.created_at).toLocaleDateString().replace(/\./g, '/').slice(0, -1) : '2025/10/22'}</p>
            </div>

            <div className="separator" />

            <div className="related-books-section">
                <p className="related-books-title">이 책을 읽은 사람들이 같이 읽은 책</p>
                <div className="related-books-container">
                    {/* These are placeholders and should be replaced with actual related book data */}
                    <div className="related-book-card">
                        <img alt="book" src={imgRectangle62} />
                        <p className="related-book-title">불편한 편의점</p>
                        <p className="related-book-author">김호연</p>
                        <p className="related-book-price">11,000원</p>
                        <p className="related-book-date">2일 전</p>
                    </div>
                    <div className="related-book-card">
                        <img alt="book" src={imgRectangle63} />
                        <p className="related-book-title">장미와 나이프</p>
                        <p className="related-book-author">히가시노 게이고</p>
                        <p className="related-book-price">10,800원</p>
                        <p className="related-book-date">5일 전</p>
                    </div>
                    <div className="related-book-card">
                        <img alt="book" src={imgRectangle70} />
                        <p className="related-book-title">소년이 온다</p>
                        <p className="related-book-author">한강</p>
                        <p className="related-book-price">14,500원</p>
                        <p className="related-book-date">1일 전</p>
                    </div>
                </div>
            </div>

            <BottomPurchaseBar book={book} onPurchaseClick={handlePurchaseClick} onChatClick={handleChatClick} />
        </div>
    );
};

export default BookDetail;