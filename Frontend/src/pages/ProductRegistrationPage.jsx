import React from 'react';
import './ProductRegistrationPage.css';

// Image assets from Figma design
const imgRectangle240654551 = "http://localhost:3845/assets/93a31d9e1f58272c46cf19f6c20f10ac79dc6ec7.png";
const imgVector = "http://localhost:3845/assets/755de8b17c24c5ff2a1e6aac290f709b006f78da.svg";
const imgScan = "http://localhost:3845/assets/e0088294851adb115652fd2d3033d523ac726e80.svg";
const imgGroup1686556883 = "http://localhost:3845/assets/e373279521517c19a33128e2d6f1d8ed115916d8.svg";
const imgUnion = "http://localhost:3845/assets/a9744e6bc0a58ff5cfa13512ddeb6da20fba5735.svg";
const imgVector1 = "http://localhost:3845/assets/9f6feccf9d51e6f52700eacb59a75e0e945bddbc.svg";
const imgVector2 = "http://localhost:3845/assets/a9f95bdf17f920a3be378b2bb584e46652259937.svg";
const imgFrame110 = "http://localhost:3845/assets/f639eeeae1d20c8e1a433a1031fdb139938ee40e.svg";
const imgVector18379 = "http://localhost:3845/assets/6b5c2f59639987662e5fd19b110483592fe0911b.svg";
const imgFrame113 = "http://localhost:3845/assets/d36ac6f88f6a24ab1c69d5bda87bfa61405781e1.svg";

function AddIcon({ className }) {
  return (
    <div className={className}>
      <div className="add-icon-vector">
        <img alt="add" className="img-fluid" src={imgVector} />
      </div>
    </div>
  );
}

function ScanIcon({ className }) {
  return (
    <div className={className}>
      <img alt="scan" className="img-fluid" src={imgScan} />
    </div>
  );
}

export default function ProductRegistrationPage() {
  return (
    <div className="product-registration-container">
      <header className="pr-header">
        <div className="pr-header-back-icon">
            <img alt="back" className="img-fluid" src={imgGroup1686556883} />
        </div>
        <p className="pr-header-title">상품 등록</p>
      </header>
      
      <main className="pr-main-content">
        <section className="pr-section">
            <p className="pr-section-title">ISBN 인식</p>
            <div className="pr-input-box-gray">
                <ScanIcon className="pr-scan-icon" />
            </div>
            <div className="pr-input-box-gray pr-isbn-input-container">
                <p className="pr-placeholder-text">ISBN을 입력해주세요.</p>
                <div className="pr-isbn-search-btn">
                    <p>검색</p>
                </div>
            </div>
        </section>

        <section className="pr-section">
            <div className="pr-section-title-container">
                <p className="pr-section-title">
                    사진 등록<span className="pr-required-star"> *</span>
                </p>
                <p className="pr-image-count">2/5</p>
            </div>
            <div className="pr-image-uploader">
                <div className="pr-image-add-box">
                    <AddIcon className="pr-add-icon" />
                </div>
                <div className="pr-image-preview-box">
                    <img alt="preview" className="img-fluid" src={imgRectangle240654551} />
                </div>
            </div>
        </section>
        
        <section className="pr-section">
            <p className="pr-section-title">책 제목<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-yellow">
                <p className="pr-placeholder-text-yellow">책 제목을 입력해주세요.</p>
            </div>
        </section>

        <section className="pr-section">
            <p className="pr-section-title">작가<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-yellow">
                <p className="pr-placeholder-text-yellow">작가을 입력해주세요.</p>
            </div>
        </section>

        <section className="pr-section">
            <p className="pr-section-title">장르<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-yellow pr-genre-selector">
                <p className="pr-placeholder-text-yellow">책의 장르를 선택해주세요.</p>
                <div className="pr-dropdown-icon-container">
                    <img alt="dropdown" className="img-fluid" src={imgUnion} />
                </div>
            </div>
        </section>

        <section className="pr-section">
            <p className="pr-section-title">한줄 감상<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-yellow">
                <p className="pr-placeholder-text-yellow">책을 읽고 느낀 점을 입력해주세요.</p>
            </div>
        </section>

        <div className="pr-divider"></div>

        <section className="pr-section">
            <p className="pr-section-title">책 가격<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-gray">
                <p className="pr-placeholder-text">원래 가격을 입력해주세요.</p>
            </div>
        </section>

        <section className="pr-section">
            <p className="pr-section-title">판매 가격<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-gray">
                <p className="pr-placeholder-text">판매하고자 하는 가격을 입력해주세요.</p>
            </div>
            <div className="pr-checkbox-container">
                <p>가격 제안 받기</p>
                <img alt="checkbox" src={imgVector1} />
            </div>
        </section>

        <div className="pr-divider"></div>

        <section className="pr-section">
            <p className="pr-section-title">택배 배송<span className="pr-required-star"> *</span></p>
            <div className="pr-input-box-gray">
                <p className="pr-placeholder-text">배송비를 입력해주세요.</p>
            </div>
            <div className="pr-checkbox-container">
                <p>배송비 미포함</p>
                <img alt="checkbox" src={imgVector2} />
            </div>
        </section>

        <hr className="pr-thin-divider" />

        <section className="pr-section pr-toggle-section">
            <p className="pr-section-title-bold">직거래</p>
            <div className="pr-toggle-container">
                <p>불가</p>
                <img alt="toggle" src={imgFrame110} />
            </div>
        </section>

      </main>

      <footer className="pr-footer">
        <div className="pr-footer-indicator">
            <img alt="indicator" src={imgFrame113} />
        </div>
        <div className="pr-submit-button">
            <p>다음</p>
        </div>
      </footer>
    </div>
  );
}
