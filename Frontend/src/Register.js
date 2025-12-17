import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarcodeScanner from './components/BarcodeScanner';
import { useBookSearch } from './hooks/useBookSearch';
import { useRegistration } from './context/RegistrationContext';
import './Register.css'; // Import the new CSS file

// Import assets
import backArrow from './assets/back-arrow-2.svg';
import scanIcon from './assets/scan-icon.svg';
import addIcon from './assets/add-icon.svg';
import genreDropdownIcon from './assets/back-arrow.svg';
import checkboxChecked from './assets/checkbox-checked.svg';
import checkboxUnchecked from './assets/checkbox-unchecked.svg';
import indicator from './assets/indicator-double-8x8.svg';
import toggleOn from './assets/toggle-on.svg';
import toggleOff from './assets/toggle-off.svg';

// Genre list for the dropdown
const genres = [
    '소설', '시/에세이', '인문', '사회과학', '역사/문화',
    '종교', '정치/사회', '예술/대중문화', '과학', '기술/공학',
    '컴퓨터/IT', '자기계발', '경제/경영', '가정/육아', '건강/취미', '만화', '기타'
];

const Register = () => {
    const { searchByISBN, books } = useBookSearch(null); 
    const { updateRegistrationData } = useRegistration();
    const navigate = useNavigate();

    const [priceSuggestion, setPriceSuggestion] = useState(false); 
    const [shippingFeeIncluded, setShippingFeeIncluded] = useState(true);
    const [directTradeEnabled, setDirectTradeEnabled] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    const fileInputRef = useRef(null);
    
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [oneLineReview, setOneLineReview] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [price, setPrice] = useState('');
    const [shippingFee, setShippingFee] = useState('');
    const [genre, setGenre] = useState('');
    
    const [showScanner, setShowScanner] = useState(false); 
    const [manualIsbn, setManualIsbn] = useState('');

    const isFormValid = 
        imagePreviews.length > 0 &&
        bookTitle.trim() !== '' &&
        bookAuthor.trim() !== '' &&
        genre.trim() !== '' &&
        oneLineReview.trim() !== '' &&
        originalPrice.trim() !== '' &&
        price.trim() !== '' &&
        shippingFee.trim() !== '';

    useEffect(() => {
        if (books && books.length > 0) {
            const book = books[0];
            setBookTitle(book.title);
            setBookAuthor(book.authors.join(', '));
            setOriginalPrice(book.price.toString());
            // Assuming sale price might be same initially
            setPrice(book.price.toString());
            
            if (book.thumbnail) {
                setImageFiles([]); 
                setImagePreviews([book.thumbnail]); 
            }
            alert(`✅ [${book.title}] 인식 성공!`);
            setShowScanner(false);
        }
    }, [books]); 

    const handleScanSuccess = (rawCode) => {
        const isbn = rawCode.replace(/[^0-9]/g, ''); 
        if (isbn.length < 10) {
            alert(`인식된 코드(${isbn})가 너무 짧습니다. 다시 시도해주세요.`);
            return; 
        }
        alert(`ISBN [${isbn}] 검색 중...`);
        searchByISBN(isbn);
    };

    const handleManualIsbnSearch = () => {
        if (manualIsbn.trim() !== '') searchByISBN(manualIsbn.trim());
    };

    const handleNext = () => {
        if (!isFormValid) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        updateRegistrationData({
            title: bookTitle,
            author: bookAuthor,
            oneLineReview,
            price,
            originalPrice,
            shippingOption: shippingFeeIncluded ? 'included' : 'extra',
            shippingFee,
            priceSuggestion,
            genre,
            directTradeEnabled,
            imageFile: imageFiles.length > 0 ? imageFiles[0] : null,
            imageUrl: imageFiles.length === 0 && imagePreviews.length > 0 ? imagePreviews[0] : null
        });

        navigate('/register2');
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (imagePreviews.length + files.length > 5) { alert('최대 5개까지 가능합니다.'); return; }
        
        setImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFileDialog = () => { fileInputRef.current.click(); };
    
    const scannerModalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '393px',
        height: '852px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    };

    return (
        <div className="register-container">
            {showScanner && (
                <div style={scannerModalStyle}>
                    <div style={{ width: '100%', height: '60%', position: 'relative' }}>
                        <BarcodeScanner onScan={handleScanSuccess} />
                    </div>
                    <button onClick={() => setShowScanner(false)} style={{ marginTop: '30px', padding: '15px 40px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', border: 'none', borderRadius: '30px' }}>닫기</button>
                </div>
            )}
            <header className="register-header">

                <Link to="/home" className="register-header-back-link">
                    <img src={backArrow} alt="Back"/>
                </Link>
                <h1 className="register-header-title">상품 등록</h1>
            </header>
            <main className="register-main">
                <section className="register-section">
                    <p className="register-section-title">ISBN 인식</p>
                    <div className="register-input-box-gray register-scan-icon-container" onClick={() => setShowScanner(true)}>
                        <img src={scanIcon} alt="scan" className="register-scan-icon" />
                    </div>
                    <div className="register-input-box-gray register-isbn-input-container">
                        <input type="text" className="register-placeholder-text" placeholder="ISBN을 입력해주세요." value={manualIsbn} onChange={(e) => setManualIsbn(e.target.value)} />
                        <button onClick={handleManualIsbnSearch} className="register-isbn-search-btn">검색</button>
                    </div>
                </section>

                <section className="register-section">
                    <div className="register-section-title-container">
                        <p className="register-section-title">사진 등록<span className="register-required-star"> *</span></p>
                        <p className="register-image-count">{imagePreviews.length}/5</p>
                    </div>
                    <div className="register-image-uploader">
                        <div className="register-image-add-box" onClick={openFileDialog}>
                            <img src={addIcon} alt="add" className="register-add-icon" />
                        </div>
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="register-image-preview-box">
                                <img src={preview} alt={`upload-${index}`} className="register-image-preview" />
                                <button type="button" onClick={() => handleRemoveImage(index)} className="remove-image-button">-</button>
                            </div>
                        ))}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" multiple />
                </section>

                <section className="register-section">
                    <p className="register-section-title">책 제목<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-yellow">
                        <input type="text" className="register-placeholder-text-yellow" placeholder="책 제목을 입력해주세요." value={bookTitle} onChange={(e) => setBookTitle(e.target.value)}/>
                    </div>
                </section>

                <section className="register-section">
                    <p className="register-section-title">작가<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-yellow">
                        <input type="text" className="register-placeholder-text-yellow" placeholder="작가를 입력해주세요." value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} />
                    </div>
                </section>

                <section className="register-section">
                    <p className="register-section-title">장르<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-yellow register-genre-selector">
                        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="register-placeholder-text-yellow">
                            <option value="" disabled>책의 장르를 선택해주세요.</option>
                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <div className="register-dropdown-icon-container">
                            <img src={genreDropdownIcon} alt="dropdown" className="register-dropdown-icon" />
                        </div>
                    </div>
                </section>

                <section className="register-section">
                    <p className="register-section-title">한줄 감상<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-yellow">
                        <input type="text" className="register-placeholder-text-yellow" placeholder="책을 읽고 느낀 점을 입력해주세요." value={oneLineReview} onChange={(e) => setOneLineReview(e.target.value)}/>
                    </div>
                </section>
                


                <div className="register-divider"></div>

                <section className="register-section">
                    <p className="register-section-title">책 가격<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-gray">
                        <input type="number" className="register-placeholder-text" placeholder="원래 가격을 입력해주세요." value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                    </div>
                </section>

                <section className="register-section">
                    <p className="register-section-title">판매 가격<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-gray">
                        <input type="number" className="register-placeholder-text" placeholder="판매하고자 하는 가격을 입력해주세요." value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="register-checkbox-container" onClick={() => setPriceSuggestion(!priceSuggestion)}>
                        <p>가격 제안 받기</p>
                        <img src={priceSuggestion ? checkboxChecked : checkboxUnchecked} alt="checkbox" />
                    </div>
                </section>

                <div className="register-divider"></div>
                
                <section className="register-section">
                    <p className="register-section-title">택배 배송<span className="register-required-star"> *</span></p>
                    <div className="register-input-box-gray">
                         <input type="number" className="register-placeholder-text" placeholder="배송비를 입력해주세요." value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} />
                    </div>

                    <div className="register-checkbox-container" onClick={() => setShippingFeeIncluded(!shippingFeeIncluded)}>
                        <p>배송비 미포함</p>
                        <img src={!shippingFeeIncluded ? checkboxChecked : checkboxUnchecked} alt="checkbox" />
                    </div>
                </section>
                
                <section className="register-trade-section">
                    <p className="register-trade-title">직거래</p>
                    <div className="register-toggle-container" onClick={() => setDirectTradeEnabled(!directTradeEnabled)}>
                        <p className="register-toggle-label">{directTradeEnabled ? '가능' : '불가'}</p>
                        <img src={directTradeEnabled ? toggleOn : toggleOff} alt="toggle" className="register-toggle-img"/>
                    </div>
                </section>

            </main>
            <footer className="register-footer">
                <div className="register-footer-indicator">
                    <img src={indicator} alt="indicator" />
                </div>
                <button onClick={handleNext} className="register-submit-button" disabled={!isFormValid}>
                    다음
                </button>
            </footer>
        </div>
    );
};

export default Register;

