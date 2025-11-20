import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';
import PurchaseButton from './PurchaseButton';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { book } = location.state || {};

    if (!book) {
        return (
            <div className="iphone-container">
                <header className="payment-header">
                    <button onClick={() => navigate(-1)} className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h1>오류</h1>
                </header>
                <main className="screen-content payment-screen-content">
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        책 정보가 없습니다. 이전 페이지로 돌아가 다시 시도해주세요.
                    </div>
                </main>
            </div>
        );
    }

    const priceString = book.price || '0';
    const priceNumber = parseInt(priceString.replace(/[^0-9]/g, ''), 10);
    const shippingFee = 1000;
    const totalPrice = priceNumber + shippingFee;

    const formatPrice = (num) => `${num.toLocaleString()}원`;

    return (
        <div className="iphone-container">
            <header className="payment-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <h1>결제</h1>
            </header>

            <main className="screen-content payment-screen-content">
                <div className="scrollable-content">
                    <section className="delivery-method active-delivery">
                        <div className="delivery-header">
                            <div className="delivery-title">
                                <h2>택배</h2>
                                <p>원하는 주소로 받기</p>
                            </div>
                            <button className="modify-button">수정하기</button>
                        </div>
                        <div className="delivery-details">
                            <p><strong>배송지:</strong> 성북구 ㅁㅁㅁ...</p>
                            <p><strong>요청사항:</strong> 없음</p>
                        </div>
                    </section>

                    <section className="delivery-method disabled-delivery">
                        <div className="delivery-title">
                            <h2>직거래</h2>
                            <p>만나서 직접 거래하기</p>
                        </div>
                    </section>

                    <section className="order-info">
                        <h2>주문 정보</h2>
                        <div className="info-item">
                            <span>상품금액</span>
                            <span>{formatPrice(priceNumber)}</span>
                        </div>
                        <div className="info-item">
                            <span>배송비</span>
                            <span>{formatPrice(shippingFee)}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item total">
                            <span>총 결제금액</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                    </section>

                    <section className="terms-agreement">
                        <div className="agreement-item all-agree">
                            <input type="checkbox" id="all-agree" defaultChecked />
                            <label htmlFor="all-agree">전체 동의</label>
                        </div>
                        <div className="agreement-item">
                            <input type="checkbox" id="terms1" defaultChecked />
                            <label htmlFor="terms1">(필수) 서비스 이용약관 동의</label>
                        </div>
                        <div className="agreement-item">
                            <input type="checkbox" id="terms2" defaultChecked />
                            <label htmlFor="terms2">(필수) 개인정보 수집 이용 및 제3자 제공 동의</label>
                        </div>
                        <div className="agreement-item">
                            <input type="checkbox" id="terms3" defaultChecked />
                            <label htmlFor="terms3">(필수) 반품 및 환불 정책 동의</label>
                        </div>
                    </section>
                </div>
            </main>
            
            <PurchaseButton />
        </div>
    );
};

export default PaymentPage;
