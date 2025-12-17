import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';
import backArrow2Svg from './assets/back-arrow-2.svg';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { book } = location.state || {};
    
    const [deliveryOption, setDeliveryOption] = useState('택배');
    const [agreements, setAgreements] = useState({
        all: false,
        service: false,
        privacy: false,
        refund: false,
    });

    if (!book) {
        return (
            <div className="payment-page">
                <header className="payment-header">
                    <img src={backArrow2Svg} alt="back" className="back-arrow-icon" onClick={() => navigate(-1)} />
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
    
    const priceNumber = book.price || 0;
    const shippingFee = deliveryOption === '택배' ? 1000 : 0; // Simplified logic
    const totalPrice = priceNumber + shippingFee;

    const formatPrice = (num) => `${num.toLocaleString()}원`;

    const handleAgreementChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'all') {
            setAgreements({ all: checked, service: checked, privacy: checked, refund: checked });
        } else {
            const newAgreements = { ...agreements, [name]: checked };
            const allChecked = newAgreements.service && newAgreements.privacy && newAgreements.refund;
            setAgreements({ ...newAgreements, all: allChecked });
        }
    };

    const handlePayment = () => {
        if (!agreements.all) {
            alert('모든 약관에 동의해야 결제를 진행할 수 있습니다.');
            return;
        }
        alert('결제가 완료되었습니다.');
        navigate(-1);
    };

    return (
        <div className="payment-page">
            <header className="payment-header">
                <img src={backArrow2Svg} alt="back" className="back-arrow-icon" onClick={() => navigate(-1)} />
                <h1>결제</h1>
            </header>

            <main className="payment-content">
                <div 
                    className={`delivery-option-box ${deliveryOption === '택배' ? 'active' : ''}`}
                    onClick={() => setDeliveryOption('택배')}
                >
                    <div className="delivery-option-title">
                        <span className="delivery-type">택배</span>
                        <span>원하는 주소로 받기</span>
                    </div>
                    <span className="edit-delivery">수정하기</span>
                    {deliveryOption === '택배' && (
                        <div className="delivery-details">
                            <p className="delivery-info-title">배송지 정보</p>
                            <p>배송지 - 서울특별시 성북구 보문로 34다길 2</p>
                            <p>요청사항 - 없음</p>
                        </div>
                    )}
                </div>

                <div 
                    className={`delivery-option-box ${deliveryOption === '직거래' ? 'active' : ''}`}
                    onClick={() => setDeliveryOption('직거래')}
                >
                     <div className="delivery-option-title">
                        <span className="delivery-type">직거래</span>
                        <span>만나서 직접 거래하기</span>
                    </div>
                    <span className="edit-delivery">수정하기</span>
                </div>
                
                <div className="separator-bar" />

                <section className="order-info-section">
                    <h2>주문 정보</h2>
                    <div className="order-item">
                        <img src={book.image_url} alt={book.title} className="order-book-thumbnail" />
                        <div className="order-book-details">
                            <p className="order-book-title">{book.title}</p>
                            <p className="order-book-grade">B등급</p> {/* Placeholder */}
                            <p className="order-book-seller">아날로그 독서가</p> {/* Placeholder */}
                        </div>
                    </div>
                </section>

                <section className="price-summary-section">
                    <div className="price-row">
                        <span>상품금액</span>
                        <span>{formatPrice(priceNumber)}</span>
                    </div>
                    <div className="price-row">
                        <span>배송비</span>
                        <span>{formatPrice(shippingFee)}</span>
                    </div>
                    <div className="total-price-divider" />
                    <div className="price-row total">
                        <span>총 결제금액</span>
                        <span className="total-price-value">{formatPrice(totalPrice)}</span>
                    </div>
                </section>

                <section className="agreement-section-payment">
                    <div className="agreement-item-payment">
                        <input type="checkbox" name="all" checked={agreements.all} onChange={handleAgreementChange} className="checkbox-payment" />
                        <label>전체 동의</label>
                    </div>
                    <div className="agreement-item-payment">
                        <input type="checkbox" name="service" checked={agreements.service} onChange={handleAgreementChange} className="checkbox-payment" readOnly/>
                        <label>(필수) 서비스 이용약관 동의</label>
                    </div>
                    <div className="agreement-item-payment">
                        <input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="checkbox-payment" readOnly/>
                        <label>(필수) 개인정보 수집 이용 및 제3자 제공 동의</label>
                    </div>
                    <div className="agreement-item-payment">
                        <input type="checkbox" name="refund" checked={agreements.refund} onChange={handleAgreementChange} className="checkbox-payment" readOnly/>
                        <label>(필수) 반품 및 환불 정책 동의</label>
                    </div>
                </section>
            </main>

            <div className="payment-footer-final">
                <button className="payment-button-final" onClick={handlePayment} disabled={!agreements.all}>
                    결제하기
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;