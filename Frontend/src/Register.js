import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import './style.css';

const qrcodeRegionId = "html5qr-code-full-region";

const ISBNScanner = ({ onScanSuccess, onScanFailure }) => {
    useEffect(() => {
        const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
        const scannerState = { isRunning: false };

        const startScanner = async () => {
            try {
                await html5Qrcode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 150 },
                        formatsToSupport: [Html5Qrcode.FORMATS_TO_SUPPORT.EAN_13],
                    },
                    (decodedText, decodedResult) => {
                        if (scannerState.isRunning) {
                            scannerState.isRunning = false;
                            html5Qrcode.stop().then(() => {
                                onScanSuccess(decodedText);
                            }).catch(err => {
                                console.error("Failed to stop scanner on success", err);
                            });
                        }
                    },
                    (errorMessage) => {
                        // parse error, ignore.
                    }
                );
                scannerState.isRunning = true;
            } catch (err) {
                onScanFailure(err);
            }
        };

        startScanner();

        return () => {
            if (scannerState.isRunning) {
                scannerState.isRunning = false;
                html5Qrcode.stop().catch(err => {
                    console.error("Failed to stop scanner on cleanup", err);
                });
            }
        };
    }, [onScanSuccess, onScanFailure]);

    return <div id={qrcodeRegionId} style={{ width: '100%', height: '100%' }} />;
};


const Register = () => {
    const [shippingOption, setShippingOption] = useState('included'); // 'included' or 'extra'
    const [priceSuggestion, setPriceSuggestion] = useState(false); // for "가격 제안 받기"
    const [directTransaction, setDirectTransaction] = useState(false); // for "직거래 가능 여부"
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [bookTitle, setBookTitle] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [oneLineReview, setOneLineReview] = useState('');
    const [price, setPrice] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    const isFormValid = images.length > 0 && bookTitle.trim() !== '' && bookDescription.trim() !== '' && price.trim() !== '';

    const handleNext = () => {
        if (images.length === 0) {
            alert('사진을 1개 이상 등록해주세요.');
            return;
        }
        if (!bookTitle.trim()) {
            alert('책 제목을 입력해주세요.');
            return;
        }
        if (!bookDescription.trim()) {
            alert('책 설명을 입력해주세요.');
            return;
        }
        if (!price.trim()) {
            alert('판매 가격을 입력해주세요.');
            return;
        }
        navigate('/register2');
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert('최대 5개의 이미지만 업로드할 수 있습니다.');
            return;
        }
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleScanSuccess = (isbn) => {
        setShowScanner(false);
        fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const book = data.items[0].volumeInfo;
                    setBookTitle(book.title || '');
                    setBookDescription(book.description || '');
                } else {
                    alert('해당 ISBN으로 책 정보를 찾을 수 없습니다.');
                }
            })
            .catch(err => {
                console.error("API Error:", err);
                alert('책 정보를 가져오는 데 실패했습니다.');
            });
    };

    const handleScanFailure = (error) => {
        console.error(`Scan failure: ${error}`);
        setShowScanner(false);
        alert('ISBN 스캔에 실패했습니다. 다시 시도해주세요.');
    };

    const labelStyle = {
        fontSize: '12pt',
        color: '#323232',
        fontWeight: '700',
        marginLeft: '11px'
    };

    const inputBoxStyle = {
        width: '100%',
        height: '41px',
        backgroundColor: '#F1E7D3',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '15px',
        boxSizing: 'border-box'
    };

    const inputStyle = {
        width: '100%',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '9pt',
        fontWeight: '400',
        color: '#323232',
        outline: 'none'
    };

    const placeholderStyle = {
        fontSize: '9pt',
        fontWeight: '400',
        color: '#C4A76C'
    };

    return (
        <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
            {showScanner && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ width: '80%', height: '50%', backgroundColor: 'white' }}>
                        <ISBNScanner
                            onScanSuccess={handleScanSuccess}
                            onScanFailure={handleScanFailure}
                        />
                    </div>
                    <button
                        onClick={() => setShowScanner(false)}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        취소
                    </button>
                </div>
            )}
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <main className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '112px',
                    backgroundColor: '#ffffff',
                    zIndex: 1
                }}>
                </div>
                <header className="app-header" style={{ justifyContent: 'center', position: 'relative', flexShrink: 0, height: '0px', zIndex: 2 }}>
                    <Link to="/home" className="back-button" style={{ position: 'absolute', top: '100px', left: '22px' }}>
                        <i className="fa-solid fa-chevron-left" style={{ fontSize: '26px', fontWeight: '400' }}></i>
                    </Link>
                    <h1 className="logo" style={{ fontSize: '14pt', fontWeight: '600', position: 'relative', top: '34px' }}>상품 등록</h1>
                </header>

                <div className="scrollable-content hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 22px', paddingBottom: '150px' }}>
                    <div style={{ marginTop: '82px' }}>
                        <div style={labelStyle}>책 정보 확인</div>
                        <div
                            style={{ ...inputBoxStyle, backgroundColor: '#E6E6E6', marginTop: '10px', height: '41px', justifyContent: 'center', cursor: 'pointer' }}
                            onClick={() => setShowScanner(true)}
                        >
                            <span style={{ color: '#323232', fontWeight: '600' }}>
                                <i className="fa-solid fa-barcode" style={{ marginRight: '10px' }}></i>
                                ISBN으로 책 정보 등록
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>
                            사진 등록 <span style={{ color: '#C73C3C' }}>*</span>  ({images.length}/5)
                        </div>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <div
                                style={{
                                    width: '63px',
                                    height: '63px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #BDBDBD',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                                onClick={openFileDialog}
                            >
                                <i className="fa-solid fa-camera" style={{ fontSize: '24px', color: '#BDBDBD' }}></i>
                            </div>
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`upload-${index}`}
                                    style={{
                                        width: '63px',
                                        height: '63px',
                                        borderRadius: '10px',
                                        marginRight: '10px'
                                    }}
                                />
                            ))}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                            multiple
                        />
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>
                            책 제목 <span style={{ color: '#C73C3C' }}>*</span>
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="책 제목을 입력하세요"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>
                            책 설명 <span style={{ color: '#C73C3C' }}>*</span>
                        </div>
                        <div style={{
                            ...inputBoxStyle,
                            height: '53px',
                            alignItems: 'flex-start',
                            padding: '15px',
                            marginTop: '10px'
                        }}>
                            <textarea
                                style={{ ...inputStyle, height: '100%', resize: 'none' }}
                                placeholder="책의 상태, 발행년도, 출판사 등을 자유롭게 작성해주세요"
                                value={bookDescription}
                                onChange={(e) => setBookDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>한줄 소감</div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="이 책을 읽고 느낀 점을 간단히 적어주세요"
                                value={oneLineReview}
                                onChange={(e) => setOneLineReview(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <div style={labelStyle}>
                            판매 가격 <span style={{ color: '#C73C3C' }}>*</span>
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <input
                                type="number"
                                style={inputStyle}
                                placeholder="가격을 입력하세요"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginTop: '9px',
                            paddingRight: '10px' /* Added padding to move right */
                        }}>
                            <span style={{
                                fontSize: '10pt',
                                fontWeight: '400',
                                color: '#323232',
                                marginRight: '10px'
                            }}>
                                가격 제안 받기
                            </span>
                            <div
                                style={{
                                    width: '35px',
                                    height: '20.81px',
                                    backgroundColor: priceSuggestion ? '#CEE3D3' : '#D9D9D9',
                                    borderRadius: '28.38px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '2px 4px',
                                    cursor: 'pointer',
                                    justifyContent: priceSuggestion ? 'flex-end' : 'flex-start'
                                }}
                                onClick={() => setPriceSuggestion(!priceSuggestion)}
                            >
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%'
                                }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <div style={labelStyle}>
                            직거래 가능 여부
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <span style={placeholderStyle}>만나서 직접 거래할 수 있나요?</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginTop: '9px',
                            paddingRight: '10px' /* Added padding to move right */
                        }}>
                            <div
                                style={{
                                    width: '35px',
                                    height: '20.81px',
                                    backgroundColor: directTransaction ? '#CEE3D3' : '#D9D9D9',
                                    borderRadius: '28.38px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '2px 4px',
                                    cursor: 'pointer',
                                    justifyContent: directTransaction ? 'flex-end' : 'flex-start'
                                }}
                                onClick={() => setDirectTransaction(!directTransaction)}
                            >
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%'
                                }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <div style={labelStyle}>
                            택배 배송
                        </div>
                        <div
                            style={{
                                ...inputBoxStyle,
                                marginTop: '10px',
                                backgroundColor: shippingOption === 'included' ? '#CEE3D3' : '#EAEAEA',
                                cursor: 'pointer'
                            }}
                            onClick={() => setShippingOption('included')}
                        >
                            <span style={{
                                fontSize: '9pt',
                                fontWeight: shippingOption === 'included' ? '600' : '400',
                                color: shippingOption === 'included' ? '#247237' : '#8F8F8F'
                            }}>
                                택배비 포함 (무료 배송)
                            </span>
                        </div>
                        <div
                            style={{
                                ...inputBoxStyle,
                                marginTop: '7px',
                                backgroundColor: shippingOption === 'extra' ? '#CEE3D3' : '#EAEAEA',
                                cursor: 'pointer'
                            }}
                            onClick={() => setShippingOption('extra')}
                        >
                            <span style={{
                                fontSize: '9pt',
                                fontWeight: shippingOption === 'extra' ? '600' : '400',
                                color: shippingOption === 'extra' ? '#247237' : '#8F8F8F'
                            }}>
                                택배비 별도
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '137px',
                    backgroundColor: '#ffffff',
                    zIndex: 1
                }}>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '98px', /* Adjusted to be above the 83px nav bar + 15px margin */
                    left: '0',
                    right: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                        <div style={{ width: '7px', height: '7px', backgroundColor: '#1C8F39', borderRadius: '50%' }}></div>
                        <div style={{ width: '7px', height: '7px', backgroundColor: '#D9D9D9', borderRadius: '50%' }}></div>
                    </div>
                    <div onClick={handleNext} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        <div style={{
                            width: 'calc(100% - 44px)', /* Adjusted to fit within padding */
                            height: '48px',
                            backgroundColor: isFormValid ? '#1C8F39' : '#E9E9E9',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '12pt', color: '#ffffff', fontWeight: '700' }}>다음</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;



