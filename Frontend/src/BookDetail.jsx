import React from 'react';
import './BookDetail.css';
import BottomNavBar from './BottomNavBar';

const BookDetail = () => {
    const book = {
        title: '모순',
        author: '양귀자 장편소설 [양장 개정판]',
        grade: 'S급',
        registeredDate: '2025/10/22',
        price: '9,800원',
        imageUrl: 'https://i.imgur.com/6Km2Fm9.jpeg',
        seller: {
            name: '난난판다',
            avatarUrl: 'https://i.imgur.com/4z3jC9M.png',
            rating: 5,
        },
        sellerReview: '유명하고 잘읽힌다해서 읽어봤는데, 작가님 문체가 쉽게 잘읽혔고 매사 인생이 조용한적없는 나날이라 삶이 피곤하다생각했는데, 이 또한 경험이고 이런 여러 경험을하고 살아갈수 있는게 감사하다는 생각을하게되었어요.',
        bookState: '2025년 10월 20일날 책을 사서 한번 정독했어요 밑줄도 없고 구김도 없이 깨끗해요',
        bookIntro: '초판이 나온 지 벌써 15년이 흘렀지만 이 소설 『모순』은 아주 특별한 길을 걷고 있다. 그때 20대였던 독자들은 지금 결혼을 하고 30대가 되어서도 가끔씩 『모순』을 꺼내 다시 읽는다고 했다. 다시 읽을 때마다 전에는 몰랐던 소설 속 행간의 의미를 깨우치거나 세월의 힘이 알려준 다른 해석에 놀라면서 “내 인생의 가장 소중한 책 한 권”으로 꼽는 것을 주저하지 않는다.',
        category: '국내도서 > 소설/시/희곡 > 한국소설 > 한국 장편소설',
    };

    const relatedBooks = [
        {
            id: 1,
            title: '불편한 편의점',
            price: '11,000원',
            status: 'B',
            imageUrl: 'https://i.imgur.com/9xvY02Y.jpeg',
        },
        {
            id: 2,
            title: '장미와 나이프',
            price: '10,800원',
            status: 'C',
            imageUrl: 'https://i.imgur.com/pA2z2o0.jpeg',
        },
        {
            id: 3,
            title: '소년이 온다',
            price: '14,500원',
            status: 'A',
            imageUrl: 'https://i.imgur.com/uGfJ3xV.jpeg',
        },
    ];

    return (
        <div className="book-detail-container">
            <div className="book-image-section">
                <img src={book.imageUrl} alt={book.title} className="book-main-image" />
                <div className="image-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>

            <div className="book-info-section">
                <h1>{book.title}</h1>
                <p className="author">{book.author}</p>
                <div className="book-meta">
                    <span className="grade">{book.grade}</span>
                    <span className="date">제품 등록일 - {book.registeredDate}</span>
                </div>
                <div className="price-transaction-section">
                  <p className="price">{book.price}</p>
                  <p className="transaction-method">판매자가 원하는 거래 방식 - 직거래</p>
                </div>
            </div>

            <div className="divider"></div>

            <div className="seller-section">
                <img src={book.seller.avatarUrl} alt={book.seller.name} className="seller-avatar" />
                <div className="seller-info">
                    <p className="seller-name">{book.seller.name}</p>
                    <div className="seller-rating">
                        <span>신뢰도</span>
                        {'★'.repeat(book.seller.rating)}
                        {'☆'.repeat(5 - book.seller.rating)}
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="detail-section">
                <h2>판매자의 한줄평</h2>
                <p>{book.sellerReview}</p>
            </div>

            <div className="detail-section">
                <h2>판매자가 이야기하는 책 상태</h2>
                <p>{book.bookState}</p>
            </div>

            <div className="detail-section">
                <h2>책소개</h2>
                <p>{book.bookIntro}</p>
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
                        <div key={item.id} className="related-book-card">
                            <img src={item.imageUrl} alt={item.title} />
                            <p className="related-book-title">{item.title}</p>
                            <p className="related-book-price">{item.price}</p>
                            <span className="related-book-status">{item.status}</span>
                        </div>
                    ))}
                </div>
            </div>
            <BottomPurchaseBar bookTitle={book.title} price={book.price} />
        </div>
    );
};

export default BookDetail;