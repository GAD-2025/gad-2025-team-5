import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Register = () => {
    const [shippingOption, setShippingOption] = useState('included'); // 'included' or 'extra'
    const [priceSuggestion, setPriceSuggestion] = useState(false); // for "가격 제안 받기"
    const [directTransaction, setDirectTransaction] = useState(false); // for "직거래 가능 여부"

    const labelStyle = {
        fontSize: '12pt',
        color: '#323232',
        fontWeight: '700',
        marginLeft: '11px'
    };

    const inputBoxStyle = {
        width: '347px',
        height: '41px',
        backgroundColor: '#F1E7D3',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '15px',
        boxSizing: 'border-box'
    };

    const placeholderStyle = {
        fontSize: '9pt',
        fontWeight: '400',
        color: '#C4A76C'
    };

    return (
        <div className="iphone-container" style={{ backgroundColor: '#FFFFFF' }}>
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
                    width: '390px',
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

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px', paddingBottom: '150px' }}>
                    <div style={{ marginTop: '82px' }}>
                        <div style={labelStyle}>책 정보 확인</div>
                        <div style={{ ...inputBoxStyle, backgroundColor: '#E6E6E6', marginTop: '10px', height: '41px' }}></div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>
                            사진 등록 <span style={{ color: '#C73C3C' }}>*</span>  (1/5)
                        </div>
                        <div style={{
                            marginTop: '10px',
                            width: '63px',
                            height: '63px',
                            backgroundColor: 'transparent',
                            border: '1px solid #BDBDBD',
                            borderRadius: '10px'
                        }}>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>
                            책 제목 <span style={{ color: '#C73C3C' }}>*</span>
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <span style={placeholderStyle}>책 제목을 입력하세요</span>
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
                            <span style={placeholderStyle}>책의 상태, 발행년도, 출판사 등을 자유롭게 작성해주세요</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <div style={labelStyle}>한줄 소감</div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <span style={placeholderStyle}>이 책을 읽고 느낀 점을 간단히 적어주세요</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <div style={labelStyle}>
                            판매 가격 <span style={{ color: '#C73C3C' }}>*</span>
                        </div>
                        <div style={{ ...inputBoxStyle, marginTop: '10px' }}>
                            <span style={placeholderStyle}>가격을 입력하세요</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginTop: '9px'
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
                            marginTop: '9px'
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
                    width: '390px',
                    height: '137px',
                    backgroundColor: '#ffffff',
                    zIndex: 1
                }}>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '58px',
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
                    <Link to="/register2" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: '347px',
                            height: '48px',
                            backgroundColor: '#1C8F39',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '12pt', color: '#ffffff', fontWeight: '700' }}>다음</span>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Register;



