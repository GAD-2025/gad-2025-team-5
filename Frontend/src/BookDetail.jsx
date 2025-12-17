import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';
import BottomPurchaseBar from './BottomPurchaseBar';
import { getOrCreateChat } from './chatManager';

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
        return <div className="iphone-container"><div>Loading...</div></div>;
    }

    if (error) {
        return <div className="iphone-container"><div>Error: {error}</div></div>;
    }

    if (!book) {
        return <div className="iphone-container"><div>Book not found</div></div>;
    }

    return (
        <div className="iphone-container">
            <header className="detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
            </header>
            <div className="book-detail-content" id="main-content">
                <div className="book-image-section">
                    <img src={book.image_url || '/path/to/default-image.png'} alt={book.title} className="book-main-image" />
                </div>

                <div className="book-info-section">
                    <div className="title-like-row">
                        <h1>{book.title}</h1>
                        <button className="like-button" onClick={handleLikeToggle} style={{color: isLiked ? '#FF6B6B' : '#BDBDBD'}}>
                            <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                        </button>
                    </div>
                    <div className="book-meta">
                        <span className="date">제품 등록일 - {new Date(book.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="price">{book.price.toLocaleString()}원</p>
                </div>

                <div className="divider"></div>

                <div className="seller-section">
                    <div className="seller-info">
                        <img src="/images/seller-icon.png" alt="판매자" className="seller-avatar" />
                        <div className="seller-details">
                            <p className="seller-name">판매자 정보</p>
                            <p className="seller-role">일반회원</p>
                        </div>
                    </div>
                    <div className="seller-rating">
                        <span>신뢰도</span>
                        <div className="stars">{'★'.repeat(5)}</div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="detail-section">
                    <h2>판매자의 한줄평</h2>
                    <p>{book.one_line_review || '작성된 한줄평이 없습니다.'}</p>
                </div>

                <div className="detail-section">
                    <h2>판매자가 이야기하는 책 상태</h2>
                    <p>{book.description || '작성된 설명이 없습니다.'}</p>
                </div>

                <div className="detail-section category-section">
                    <h2>관련 분류</h2>
                    <div className="category-info">
                        <span>{book.genre || '장르 정보 없음'}</span>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="related-books-section">
                    <h2>관련 도서</h2>
                    <p>관련 도서 정보가 없습니다.</p>
                </div>
            </div>
            <BottomPurchaseBar book={book} onPurchaseClick={handlePurchaseClick} onChatClick={handleChatClick} />
        </div>
    );
};

export default BookDetail;