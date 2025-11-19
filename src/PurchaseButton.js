import React from 'react';
import './PurchaseButton.css';

const PurchaseButton = () => {
    const handlePurchase = () => {
        // 결제 로직을 여기에 추가할 수 있습니다.
        alert('결제가 완료되었습니다!');
    };

    return (
        <div className="purchase-button-container">
            <button className="purchase-action-button" onClick={handlePurchase}>
                결제하기
            </button>
        </div>
    );
};

export default PurchaseButton;
