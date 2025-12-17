import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarcodeScanner from './components/BarcodeScanner';
import { useBookSearch } from './hooks/useBookSearch';
import { useRegistration } from './context/RegistrationContext';
import './style.css';

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

    const [shippingOption, setShippingOption] = useState('included'); 
    const [priceSuggestion, setPriceSuggestion] = useState(false); 
    const [imageFiles, setImageFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    const fileInputRef = useRef(null);
    
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [oneLineReview, setOneLineReview] = useState('');
    const [price, setPrice] = useState('');
    const [genre, setGenre] = useState('');
    
    const [showScanner, setShowScanner] = useState(false); 
    const [manualIsbn, setManualIsbn] = useState('');
    
    const isFormValid = (imagePreviews.length > 0) && bookTitle.trim() !== '' && bookAuthor.trim() !== '' && bookDescription.trim() !== '' && price.trim() !== '' && genre !== '';

    useEffect(() => {
        if (books && books.length > 0) {
            const book = books[0];
            setBookTitle(book.title);
            setBookAuthor(book.authors.join(', '));
            setBookDescription(`출판일: ${book.datetime}\n\n(바코드로 자동 입력되었습니다)`);
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
            description: bookDescription,
            oneLineReview,
            price,
            shippingOption,
            priceSuggestion,
            genre,
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
    const labelStyle = { fontSize: '12pt', color: '#323232', fontWeight: '700', marginLeft: '11px' };
    const inputBoxStyle = { width: '100%', height: '41px', backgroundColor: '#F1E7D3', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '15px', boxSizing: 'border-box' };
    const inputStyle = { width: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '9pt', fontWeight: '400', color: '#323232', outline: 'none' };
    
    return (
        <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
            {showScanner && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '60%' }}>
                        <BarcodeScanner onScan={handleScanSuccess} />
                    </div>
                    <button onClick={() => setShowScanner(false)} style={{ marginTop: '30px', padding: '15px 40px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', border: 'none', borderRadius: '30px' }}>닫기</button>
                </div>
            )}
            <div className="status-bar"><div className="time">9:41</div><div className="camera"></div><div className="status-icons"><i className="fa-solid fa-signal"></i><i className="fa-solid fa-wifi"></i><i className="fa-solid fa-battery-full"></i></div></div>
            <main className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '112px', backgroundColor: '#ffffff', zIndex: 1 }}></div>
                <header className="app-header" style={{ justifyContent: 'center', position: 'relative', flexShrink: 0, height: '0px', zIndex: 2 }}>
                    <Link to="/home" className="back-button" style={{ position: 'absolute', top: '100px', left: '22px' }}><i className="fa-solid fa-chevron-left" style={{ fontSize: '26px', fontWeight: '400' }}></i></Link>
                    <h1 className="logo" style={{ fontSize: '14pt', fontWeight: '600', position: 'relative', top: '34px' }}>상품 등록</h1>
                </header>
                <div className="scrollable-content hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 22px', paddingBottom: '150px' }}>
                    
                    <div style={{ marginTop: '82px' }}>
                        <div style={labelStyle}>책 정보 확인</div>
                        <div style={{ ...inputBoxStyle, backgroundColor: '#E6E6E6', marginTop: '10px', height: '41px', justifyContent: 'center', cursor: 'pointer', border: '1px solid #ccc' }} onClick={() => setShowScanner(true)}>
                            <span style={{ color: '#323232', fontWeight: '600', display: 'flex', alignItems: 'center' }}><i className="fa-solid fa-barcode" style={{ marginRight: '10px', fontSize: '20px' }}></i>바코드 스캔하기 (카메라)</span>
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input type="text" style={inputStyle} placeholder="ISBN 직접 입력" value={manualIsbn} onChange={(e) => setManualIsbn(e.target.value)} />
                            <button onClick={handleManualIsbnSearch} style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}>검색</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>사진 등록 <span style={{ color: '#C73C3C' }}>*</span> ({imagePreviews.length}/5)</div>
                        <div style={{ display: 'flex', marginTop: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                            <div style={{ width: '63px', height: '63px', backgroundColor: 'transparent', border: '1px solid #BDBDBD', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '10px', flexShrink: 0 }} onClick={openFileDialog}>
                                <i className="fa-solid fa-camera" style={{ fontSize: '24px', color: '#BDBDBD' }}></i>
                            </div>
                            {imagePreviews.map((preview, index) => (
                                <div key={index} style={{ position: 'relative', marginRight: '10px', flexShrink: 0 }}>
                                    <img src={preview} alt={`upload-${index}`} style={{ width: '63px', height: '63px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #eee' }} />
                                    <button type="button" onClick={() => handleRemoveImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#777777', color: 'white', border: '1px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', lineHeight: '1' }}>-</button>
                                </div>
                            ))}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" multiple />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div style={labelStyle}>책 제목 <span style={{ color: '#C73C3C' }}>*</span></div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input type="text" style={inputStyle} placeholder="책 제목" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
                        </div>
                    </div>
                    {/* --- ✨ New Author Field --- */}
                    <div style={{ marginTop: '20px' }}>
                        <div style={labelStyle}>작가 <span style={{ color: '#C73C3C' }}>*</span></div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input type="text" style={inputStyle} placeholder="작가" value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} />
                        </div>
                    </div>
                    
                    {/* --- ✨ New Genre Field --- */}
                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>장르 <span style={{ color: '#C73C3C' }}>*</span></div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px', paddingLeft: '0' }}>
                            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ ...inputStyle, paddingLeft: '15px' }}>
                                <option value="" disabled>장르를 선택하세요</option>
                                {genres.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* --- End of New Genre Field --- */}

                    <div style={{ marginTop: '30px' }}><div style={labelStyle}>책 설명 <span style={{ color: '#C73C3C' }}>*</span></div><div style={{ ...inputBoxStyle, height: '80px', alignItems: 'flex-start', padding: '15px', marginTop: '10px' }}><textarea style={{ ...inputStyle, height: '100%', resize: 'none' }} placeholder="내용 작성" value={bookDescription} onChange={(e) => setBookDescription(e.target.value)} /></div></div>
                    <div style={{ marginTop: '30px' }}><div style={labelStyle}>한줄 소감</div><div style={{ ...inputBoxStyle, marginTop: '10px' }}><input type="text" style={inputStyle} placeholder="소감" value={oneLineReview} onChange={(e) => setOneLineReview(e.target.value)} /></div></div>
                    <div style={{ marginTop: '30px', marginBottom: '30px' }}><div style={labelStyle}>판매 가격 <span style={{ color: '#C73C3C' }}>*</span></div><div style={{ ...inputBoxStyle, marginTop: '10px' }}><input type="number" style={inputStyle} placeholder="가격" value={price} onChange={(e) => setPrice(e.target.value)} /></div><div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '9px', paddingRight: '10px' }}><span style={{ fontSize: '10pt', fontWeight: '400', color: '#323232', marginRight: '10px' }}>가격 제안 받기</span><div style={{ width: '35px', height: '20.81px', backgroundColor: priceSuggestion ? '#CEE3D3' : '#D9D9D9', borderRadius: '28.38px', display: 'flex', alignItems: 'center', padding: '2px 4px', cursor: 'pointer', justifyContent: priceSuggestion ? 'flex-end' : 'flex-start' }} onClick={() => setPriceSuggestion(!priceSuggestion)}><div style={{ width: '18px', height: '18px', backgroundColor: '#FFFFFF', borderRadius: '50%' }}></div></div></div></div>
                    <div style={{ marginTop: '30px', marginBottom: '30px' }}><div style={labelStyle}>택배 배송</div><div style={{ ...inputBoxStyle, marginTop: '10px', backgroundColor: shippingOption === 'included' ? '#CEE3D3' : '#EAEAEA', cursor: 'pointer' }} onClick={() => setShippingOption('included')}><span style={{ fontSize: '9pt', fontWeight: shippingOption === 'included' ? '600' : '400', color: shippingOption === 'included' ? '#247237' : '#8F8F8F' }}>무료 배송</span></div><div style={{ ...inputBoxStyle, marginTop: '7px', backgroundColor: shippingOption === 'extra' ? '#CEE3D3' : '#EAEAEA', cursor: 'pointer' }} onClick={() => setShippingOption('extra')}><span style={{ fontSize: '9pt', fontWeight: shippingOption === 'extra' ? '600' : '400', color: shippingOption === 'extra' ? '#247237' : '#8F8F8F' }}>택배비 별도</span></div></div>
                </div>

                <div style={{ position: 'absolute', bottom: '98px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    <div onClick={handleNext} style={{ textDecoration: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center' }}><div style={{ width: 'calc(100% - 44px)', height: '48px', backgroundColor: isFormValid ? '#1C8F39' : '#E9E9E9', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '12pt', color: '#ffffff', fontWeight: '700' }}>다음</span></div></div>
                </div>
            </main>
        </div>
    );
};

export default Register;
