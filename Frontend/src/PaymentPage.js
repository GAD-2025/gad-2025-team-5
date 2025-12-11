import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';
import { allBooks } from './bookData';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookId } = location.state || {};
    const book = allBooks[bookId];

    if (!book) {
        return (
            <div className="iphone-container">
                <header className="payment-header">
                    <button onClick={() => navigate(-1)} className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h1>오류</h1>
                </header>
                <main className="payment-content">
                    <div className="error-message">
                        책 정보가 없습니다. 이전 페이지로 돌아가 다시 시도해주세요.
                    </div>
                </main>
            </div>
        );
    }

    const priceString = book.price || '0';
    const priceNumber = parseInt(priceString.replace(/[^0-9]/g, ''), 10);
    const shippingFee = 3000;
    const totalPrice = priceNumber + shippingFee;

    const formatPrice = (num) => `${num.toLocaleString()}원`;

    const handlePayment = () => {
        alert('결제가 완료되었습니다.');
        navigate(-1); // Go back to the previous page (detail page)
    };

    return (
        <div className="iphone-container">
            <header className="payment-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <h1>주문/결제</h1>
            </header>

            <main className="payment-content">
                <section className="payment-section">
                    <h2>주문 상품</h2>
                    <div className="order-summary">
                        <img src={book.img} alt={book.title} className="book-thumbnail" />
                        <div className="book-details">
                            <h3>{book.title}</h3>
                            <p>{book.authors.join(', ')}</p>
                            <p className="price">{formatPrice(priceNumber)}</p>
                        </div>
                    </div>
                </section>

                <section className="payment-section">
                    <h2>배송지 정보</h2>
                    <div className="form-group">
                        <label htmlFor="name">받는분</label>
                        <input type="text" id="name" defaultValue="김수정" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">주소</label>
                        <input type="text" id="address" defaultValue="서울 성북구 보문로 123" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">연락처</label>
                        <input type="text" id="phone" defaultValue="010-1234-5678" />
                    </div>
                </section>

                <section className="payment-section">
                    <h2>결제 수단</h2>
                    <div className="payment-methods">
                        <button className="payment-method active">신용카드</button>
                        <button className="payment-method">무통장입금</button>
                        <button className="payment-method">휴대폰결제</button>
                        <button className="payment-method">네이버페이</button>
                    </div>
                </section>

                <section className="payment-section">
                    <h2>최종 결제금액</h2>
                    <div className="total-summary">
                        <div className="summary-item">
                            <span>상품금액</span>
                            <span>{formatPrice(priceNumber)}</span>
                        </div>
                        <div className="summary-item">
                            <span>배송비</span>
                            <span>{formatPrice(shippingFee)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-item total">
                            <span>총 결제금액</span>
                            <span className="total-price">{formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                </section>

                <div className="payment-footer">
                    <button className="purchase-button-final" onClick={handlePayment}>{formatPrice(totalPrice)} 결제하기</button>
                </div>
            </main>
        </div>
    );
};

export default PaymentPage;