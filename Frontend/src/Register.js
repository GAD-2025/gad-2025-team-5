import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BarcodeScanner from './components/BarcodeScanner'; // ✅ 스캐너 컴포넌트
import { useBookSearch } from './hooks/useBookSearch'; // ✅ 검색 로직
import './style.css';

const Register = () => {
    // 1. 초기엔 자동검색 끄기 (null)
    const { searchByISBN, books } = useBookSearch(null); 

    const [shippingOption, setShippingOption] = useState('included'); 
    const [priceSuggestion, setPriceSuggestion] = useState(false); 
    const [directTransaction, setDirectTransaction] = useState(false); 
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    
    const [bookTitle, setBookTitle] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [oneLineReview, setOneLineReview] = useState('');
    const [price, setPrice] = useState('');
    
    // 카메라 켜기/끄기
    const [showScanner, setShowScanner] = useState(false); 

    const navigate = useNavigate();
    const isFormValid = images.length > 0 && bookTitle.trim() !== '' && bookDescription.trim() !== '' && price.trim() !== '';

    // ✅ [자동 입력] 책 정보가 검색되면 알아서 폼을 채워줍니다
    useEffect(() => {
        if (books && books.length > 0) {
            const book = books[0];
            
            // 1. 텍스트 정보 채우기
            setBookTitle(book.title);
            setBookDescription(`저자: ${book.authors.join(', ')} | 출판일: ${book.datetime}\n\n(바코드 스캔으로 자동 입력되었습니다)`);
            setPrice(book.price.toString());
            
            // 2. [사진 자동 등록] 책 표지가 있으면 사진 1번 칸에 넣기
            if (book.thumbnail) {
                setImages([book.thumbnail]);
            }
            
            alert(`✅ [${book.title}] 인식 성공!\n정보와 사진이 자동으로 입력되었습니다.`);
        }
    }, [books]); 

    // ✅ 스캔 성공 시 실행되는 함수
    const handleScanSuccess = (rawCode) => {
        setShowScanner(false); // 1. 카메라 끄고
        
        // 2. 바코드 정리 (혹시 모를 오류 방지)
        const isbn = rawCode.replace(/[^0-9]/g, ''); // 숫자만 남기기
        
        console.log("스캔된 ISBN:", isbn);
        searchByISBN(isbn); // 3. 알라딘 검색 시작! -> 위 useEffect가 받아서 처리함
    };

    // --- (아래부터는 원래 디자인 코드 그대로) ---

    const handleNext = () => {
        if (images.length === 0) { alert('사진을 1개 이상 등록해주세요.'); return; }
        if (!bookTitle.trim()) { alert('책 제목을 입력해주세요.'); return; }
        if (!bookDescription.trim()) { alert('책 설명을 입력해주세요.'); return; }
        if (!price.trim()) { alert('판매 가격을 입력해주세요.'); return; }
        navigate('/register2');
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) { alert('최대 5개의 이미지만 업로드할 수 있습니다.'); return; }
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const openFileDialog = () => { fileInputRef.current.click(); };

    const labelStyle = { fontSize: '12pt', color: '#323232', fontWeight: '700', marginLeft: '11px' };
    const inputBoxStyle = { width: '100%', height: '41px', backgroundColor: '#F1E7D3', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '15px', boxSizing: 'border-box' };
    const inputStyle = { width: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '9pt', fontWeight: '400', color: '#323232', outline: 'none' };
    const placeholderStyle = { fontSize: '9pt', fontWeight: '400', color: '#C4A76C' };

    return (
        <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
            
            {/* 카메라 모달창 */}
            {showScanner && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 100,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '100%', height: '60%' }}>
                        <BarcodeScanner onScan={handleScanSuccess} />
                    </div>
                    <button
                        onClick={() => setShowScanner(false)}
                        style={{ marginTop: '30px', padding: '15px 40px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', border: 'none', borderRadius: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                    >
                        닫기
                    </button>
                </div>
            )}

            <div className="status-bar">
                <div className="time">9:41</div><div className="camera"></div>
                <div className="status-icons"><i className="fa-solid fa-signal"></i><i className="fa-solid fa-wifi"></i><i className="fa-solid fa-battery-full"></i></div>
            </div>
            <main className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '112px', backgroundColor: '#ffffff', zIndex: 1 }}></div>
                <header className="app-header" style={{ justifyContent: 'center', position: 'relative', flexShrink: 0, height: '0px', zIndex: 2 }}>
                    <Link to="/home" className="back-button" style={{ position: 'absolute', top: '100px', left: '22px' }}>
                        <i className="fa-solid fa-chevron-left" style={{ fontSize: '26px', fontWeight: '400' }}></i>
                    </Link>
                    <h1 className="logo" style={{ fontSize: '14pt', fontWeight: '600', position: 'relative', top: '34px' }}>상품 등록</h1>
                </header>

                <div className="scrollable-content hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 22px', paddingBottom: '150px' }}>
                    
                    {/* 바코드 버튼 */}
                    <div style={{ marginTop: '82px' }}>
                        <div style={labelStyle}>책 정보 확인</div>
                        <div
                            style={{ ...inputBoxStyle, backgroundColor: '#E6E6E6', marginTop: '10px', height: '41px', justifyContent: 'center', cursor: 'pointer', border: '1px solid #ccc' }}
                            onClick={() => setShowScanner(true)}
                        >
                            <span style={{ color: '#323232', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                <i className="fa-solid fa-barcode" style={{ marginRight: '10px', fontSize: '20px' }}></i>
                                바코드 스캔하기 (카메라)
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>사진 등록 <span style={{ color: '#C73C3C' }}>*</span>  ({images.length}/5)</div>
                        <div style={{ display: 'flex', marginTop: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                            <div style={{ width: '63px', height: '63px', backgroundColor: 'transparent', border: '1px solid #BDBDBD', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '10px', flexShrink: 0 }} onClick={openFileDialog}>
                                <i className="fa-solid fa-camera" style={{ fontSize: '24px', color: '#BDBDBD' }}></i>
                            </div>
                            {/* ✅ 스캔되면 여기에 책 표지가 뜹니다 */}
                            {images.map((image, index) => (
                                <img key={index} src={image} alt={`upload-${index}`} style={{ width: '63px', height: '63px', borderRadius: '10px', marginRight: '10px', objectFit: 'cover', border: '1px solid #eee' }} />
                            ))}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" multiple />
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <div style={labelStyle}>책 제목 <span style={{ color: '#C73C3C' }}>*</span></div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input type="text" style={inputStyle} placeholder="책 제목을 입력하세요" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>책 설명 <span style={{ color: '#C73C3C' }}>*</span></div>
                        <div style={{ ...inputBoxStyle, height: '80px', alignItems: 'flex-start', padding: '15px', marginTop: '10px' }}>
                            <textarea style={{ ...inputStyle, height: '100%', resize: 'none' }} placeholder="내용 작성" value={bookDescription} onChange={(e) => setBookDescription(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>한줄 소감</div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input type="text" style={inputStyle} placeholder="소감 작성" value={oneLineReview} onChange={(e) => setOneLineReview(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <div style={labelStyle}>판매 가격 <span style={{ color: '#C73C3C' }}>*</span></div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input type="number" style={inputStyle} placeholder="가격 입력" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '9px', paddingRight: '10px' }}>
                            <span style={{ fontSize: '10pt', fontWeight: '400', color: '#323232', marginRight: '10px' }}>가격 제안 받기</span>
                            <div style={{ width: '35px', height: '20.81px', backgroundColor: priceSuggestion ? '#CEE3D3' : '#D9D9D9', borderRadius: '28.38px', display: 'flex', alignItems: 'center', padding: '2px 4px', cursor: 'pointer', justifyContent: priceSuggestion ? 'flex-end' : 'flex-start' }} onClick={() => setPriceSuggestion(!priceSuggestion)}>
                                <div style={{ width: '18px', height: '18px', backgroundColor: '#FFFFFF', borderRadius: '50%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* 직거래, 택배 등 나머지 옵션은 동일 */}
                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <div style={labelStyle}>택배 배송</div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px', backgroundColor: shippingOption === 'included' ? '#CEE3D3' : '#EAEAEA', cursor: 'pointer' }} onClick={() => setShippingOption('included')}>
                            <span style={{ fontSize: '9pt', fontWeight: shippingOption === 'included' ? '600' : '400', color: shippingOption === 'included' ? '#247237' : '#8F8F8F' }}>무료 배송</span>
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '7px', backgroundColor: shippingOption === 'extra' ? '#CEE3D3' : '#EAEAEA', cursor: 'pointer' }} onClick={() => setShippingOption('extra')}>
                            <span style={{ fontSize: '9pt', fontWeight: shippingOption === 'extra' ? '600' : '400', color: shippingOption === 'extra' ? '#247237' : '#8F8F8F' }}>택배비 별도</span>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: '98px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <div onClick={handleNext} style={{ textDecoration: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 'calc(100% - 44px)', height: '48px', backgroundColor: isFormValid ? '#1C8F39' : '#E9E9E9', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '12pt', color: '#ffffff', fontWeight: '700' }}>다음</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;