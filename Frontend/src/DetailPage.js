import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';
import BookCard from './BookCard';
import BottomPurchaseBar from './BottomPurchaseBar';
// Static data is no longer the primary source, but might be used for recommendations
import { allBooks, recommendationCategories } from './bookData.js';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchBookAndLikeStatus = async () => {
            const token = localStorage.getItem('token');
            if (!id) return;

            try {
                setLoading(true);

                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:3001',
                    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                });

                const [bookResponse, likeStatusResponse] = await Promise.all([
                    axiosInstance.get(`/api/books/${id}`),
                    token ? axiosInstance.get(`/api/likes/status/${id}`) : Promise.resolve({ data: { isLiked: false } })
                ]);

                setBook(bookResponse.data);
                setIsLiked(likeStatusResponse.data.isLiked);
                setError(null);

            } catch (err) {
                console.error("Error fetching book details:", err);
                setError("Failed to fetch book details.");
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndLikeStatus();
    }, [id]);

    // Function to toggle like status
    const handleLikeToggle = async () => {
        // --- ✨ 이 로그가 보이는지 확인해주세요! ---
        console.log('❤️ 하트 버튼 클릭됨! API 요청을 곧 시작합니다...');

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const originalIsLiked = isLiked;
        setIsLiked(prev => !prev);

        try {
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:3001',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!originalIsLiked) {
                await axiosInstance.post('/api/likes', { bookId: id });
            } else {
                await axiosInstance.delete(`/api/likes/${id}`);
            }
            console.log('✅ API 요청 성공!'); // 성공 로그
        } catch (err) {
            console.error('API 요청 실패:', err); // 실패 로그
            setIsLiked(originalIsLiked);
            alert('좋아요 상태를 업데이트하는 데 실패했습니다.');
        }
    };

    // 관련 책 목록 (기존 더미 데이터 활용)
    const relatedBooks = recommendationCategories && recommendationCategories.recommend
        ? recommendationCategories.recommend.map(bookTitle => allBooks[bookTitle]).filter(Boolean)
        : [];

    const handlePurchaseClick = () => {
        navigate('/payment', { state: { book: book } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!book) {
        return <div>Book not found</div>;
    }

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
                    <div
                        className="like-button"
                        onClick={handleLikeToggle}
                        style={{
                            position: 'absolute',
                            top: '100px',
                            right: '22px',
                            fontSize: '26px',
                            color: isLiked ? '#FF6B6B' : '#BDBDBD',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                    </div>
                </header>
                <div className="scrollable-content">
                    <div className="detail-page">
                        <img className="detail-image" src={book.image_url || '/path/to/default/image.png'} alt={book.title} />
                        <div className="detail-title-section">
                            <h1 className="detail-title">{book.title}</h1>
                            <p className="detail-author">정보 확인 필요</p>
                            <p className="detail-grade">정보 없음</p>
                            <p className="detail-date">제품 등록일 - {new Date(book.created_at).toLocaleDateString()}</p>
                            <div className="transaction-price-container">
                                <p className="detail-transaction">판매자가 원하는 거래 방식 - {book.shipping_option === 'included' ? '무료 배송' : '택배비 별도'}</p>
                                <p className="detail-price">{book.price.toLocaleString()}원</p>
                            </div>
                        </div>
                        <div className="detail-section seller-section">
                            <div className="seller-info">
                                <img src="/images/seller-icon.png" alt="seller icon" className="seller-icon" />
                                <div className="seller-details">
                                    <p className="seller-name">판매자 정보 로딩...</p>
                                    <p className="seller-role">일반회원</p>
                                </div>
                            </div>
                            <div className="seller-rating">
                                <p>신뢰도 ★★★★★</p>
                            </div>
                        </div>
                        <div className="detail-section">
                            <h3>판매자의 한줄평</h3>
                            <p>{book.one_line_review || '작성된 한줄평이 없습니다.'}</p>
                        </div>
                        <div className="detail-section">
                            <h3>판매자가 이야기 하는 책 상태</h3>
                            <p>{book.description || '작성된 설명이 없습니다.'}</p>
                        </div>
                        <div className="detail-section">
                            <h3>책소개</h3>
                            <p>책 소개 정보가 없습니다.</p>
                        </div>
                        <div className="detail-section">
                            <h3>관련분류</h3>
                            <p>{book.genre || '장르 정보가 없습니다.'}</p>
                        </div>
                        <div className="related-books">
                            <h2>이 책을 읽은 사람들이 같이 읽은 책</h2>
                            <div className="book-list-horizontal">
                                {relatedBooks.filter(b => b && b.title !== book.title).map(relatedBook => (
                                    <BookCard key={relatedBook.id} book={relatedBook} onSelect={() => navigate(`/books/${relatedBook.id}`)} />
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