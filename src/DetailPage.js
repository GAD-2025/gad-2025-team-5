import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './DetailPage.css';
import BookCard from './BookCard';
import BottomPurchaseBar from './BottomPurchaseBar';

const bookData = {
    '모순': {
        title: '모순',
        author: '양귀자 장편소설 [양장 개정판]',
        price: '9,800원',
        transaction: '직거래',
        time: '1일 전',
        img: '/images/모순.jpg',
        badge: 'S',
        liked: true,
        date: '2025/10/22',
        seller: '난난판다',
        seller_role: '아날로그 독서가',
        seller_comment: '유명하고 잘읽힌다해서 읽어봤는데, 작가님 문체가 쉽게 잘읽혔고 매사 인생이 조용한적없는 나날이라 삶이 피곤하다생각했는데, 이 또한 경험이고 이런 여러 경험을하고 살아갈수 있는게 감사하다는 생각을하게되었어요.',
        book_status: '2025년 10월 20일날 책을 사서 한번 정독했어요 밑줄도 없고 구김도 없이 깨끗해요',
        book_intro: '초판이 나온 지 벌써 15년이 흘렀지만 이 소설 『모순』은 아주 특별한 길을 걷고 있다. 그때 20대였던 독자들은 지금 결혼을 하고 30대가 되어서도 가끔씩 『모순』을 꺼내 다시 읽는다고 했다. 다시 읽을 때마다 전에는 몰랐던 소설 속 행간의 의미를 깨우치거나 세월의 힘이 알려준 다른 해석에 놀라면서 “내 인생의 가장 소중한 책 한 권”으로 꼽는 것을 주저하지 않는다. 『모순』이 특별한 것은 대다수의 독자들이 한 번만 읽고 마는 것이 아니라 적어도 두 번, 혹은 세 번 이상 되풀이 읽고 있다는 사실에 있다.',
        category: '국내도서 > 소설/시/희곡 > 한국소설 > 한국 장편소설'
    }
};

const relatedBooks = [
    { title: '불편한 편의점', author: '김호연', price: '11,000원', time: '2일 전', img: '/images/불편한.png', badge: 'B', liked: false },
    { title: '장미와 나이프', author: '히가시노 게이고', price: '10,800원', time: '5일 전', img: '/images/장미와 나이프.jpeg', badge: 'C', liked: false },
    { title: '소년이 온다', author: '한강', price: '14,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/5087/8/cover500/8936475113_1.jpg', badge: 'A', liked: false }
];

const DetailPage = () => {
    const { title } = useParams();
    const book = bookData[title];

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
                <div className="scrollable-content">
                    <div className="detail-page">
                        <header className="detail-header">
                            <Link to="/home" className="back-button">
                                <i className="fa-solid fa-chevron-left"></i>
                            </Link>
                        </header>
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
                                {relatedBooks.map(relatedBook => (
                                    <BookCard key={relatedBook.title} book={relatedBook} onHeartClick={() => {}} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <BottomPurchaseBar bookTitle={book.title} />
        </div>
    );
};

export default DetailPage;