import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import BookCard from './BookCard';

const bookData = {
    recommend: [
        { title: '모순', author: '양귀자', price: '10,800원', time: '1일 전', img: '/images/모순.jpg', badge: 'S', liked: true },
        { title: '불편한 편의점', author: '김호연', price: '11,000원', time: '2일 전', img: '/images/불편한.png', badge: 'B', liked: false },
        { title: '장미와 나이프', author: '히가시노 게이고', price: '10,800원', time: '5일 전', img: '/images/장미와 나이프.jpeg', badge: 'C', liked: false }
    ],
    popular: [
        { title: '세이노의 가르침', author: '세이노', price: '6,480원', time: '3일 전', img: '/images/세이노의 가르침.jpeg', badge: 'S', liked: false },
        { title: '역행자', author: '자청', price: '15,750원', time: '1일 전', img: '/images/역행자.jpeg', badge: 'A', liked: true },
        { title: '도둑맞은 집중력', author: '요한 하리', price: '17,820원', time: '10일 전', img: '/images/도둑맞은 집중력.jpeg', badge: 'C', liked: false }
    ],
    personalized: [
        { title: '데일 카네기 인간관계론', author: '데일 카네기', price: '10,350원', time: '7일 전', img: 'https://image.aladin.co.kr/product/1924/7/cover500/8932900427_1.jpg', badge: 'A', liked: false },
        { title: '원씽', author: '게리 켈러', price: '12,600원', time: '4일 전', img: 'https://image.aladin.co.kr/product/39/22/cover500/8965960962_1.jpg', badge: 'S', liked: true },
        { title: '부의 추월차선', author: '엠제이 드마코', price: '13,500원', time: '6일 전', img: 'https://image.aladin.co.kr/product/3134/35/cover500/8965961489_1.jpg', badge: 'B', liked: false }
    ]
};

const realTimeBookData = {
    new: [
        { title: '소년이 온다', author: '한강', price: '12,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/5087/8/cover500/8936475113_1.jpg', badge: 'A', liked: true },
        { title: '꺼벙이 억수', author: '윤수현', price: '4,000원', time: '2일 전', img: 'https://image.aladin.co.kr/product/13/7/cover500/8995351109_1.jpg', badge: 'D', liked: false },
        { title: '악의', author: '히가시노 게이고', price: '6,800원', time: '5일 전', img: 'https://image.aladin.co.kr/product/1935/11/cover500/8982814307_1.jpg', badge: 'S', liked: false }
    ],
    discounted: [
        { title: '달러구트 꿈 백화점', author: '이미예', price: '10,000원', originalPrice: '13,800원', time: '3일 전', img: '/images/달러구트 꿈백화점.jpeg', badge: 'S', liked: false },
        { title: '파친코 1', author: '이민진', price: '11,500원', originalPrice: '15,800원', time: '1일 전', img: 'https://image.aladin.co.kr/product/28932/29/cover500/K842830332_1.jpg', badge: 'A', liked: true }
    ]
};



const Home = () => {
    const [recommendationTab, setRecommendationTab] = useState('today');
    const [realTimeTab, setRealTimeTab] = useState('new');
    const [showBanner, setShowBanner] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const menuRef = React.useRef(null);
    const hamburgerRef = React.useRef(null);

    const [recommendationList, setRecommendationList] = useState(bookData.recommend);
    const [realTimeList, setRealTimeList] = useState(realTimeBookData.new);

    const categories = [
        { main: "문학", sub: ["소설", "시", "에세이", "희곡"] },
        { main: "인문 / 사회", sub: ["철학", "역사", "정치", "사회학", "심리학"] },
        { main: "경제 / 경영", sub: ["마케팅", "자기계발", "리더십", "재테크"] },
        { main: "과학 / 기술", sub: ["자연과학", "IT", "공학", "의학"] },
        { main: "예술 / 디자인", sub: ["미술", "사진", "음악", "건축", "패션"] },
        { main: "취미 / 실용", sub: ["요리", "여행", "반려동물", "수공예"] },
        { main: "교육 / 학습", sub: ["교재", "문제집", "참고서", "논술"] },
        { main: "아동 / 청소년", sub: ["그림책", "동화", "청소년소설"] },
        { main: "종교 / 철학", sub: ["기독교", "불교", "명상", "종교철학"] },
        { main: "기타 / 잡지", sub: ["웹툰", "라이트노벨", "매거진"] }
    ];

    useEffect(() => {
        const list = recommendationTab === 'popular' ? bookData.popular : recommendationTab === 'personalized' ? bookData.personalized : bookData.recommend;
        setRecommendationList(list);
    }, [recommendationTab]);

    useEffect(() => {
        const list = realTimeTab === 'discounted' ? realTimeBookData.discounted : realTimeBookData.new;
        setRealTimeList(list);
    }, [realTimeTab]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                setToastMessage('');
            }, 2000); // Hide after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
                setShowCategoryMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, hamburgerRef]);


    const handleHeartClick = (list, setList, title) => {
        const newList = list.map(book =>
            book.title === title ? { ...book, liked: !book.liked } : book
        );
        setList(newList);

        const clickedBook = newList.find(book => book.title === title);
        if (clickedBook.liked) {
            setToastMessage('관심 상품에 추가했어요.');
        } else {
            setToastMessage('관심 상품에서 삭제했어요.');
        }
        setShowToast(true);
    };

    const toggleCategoryMenu = () => {
        setShowCategoryMenu(!showCategoryMenu);
        setOpenCategory(null); // Reset open category when toggling menu
    };

    const handleCategoryClick = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    return (
        <div className="iphone-container">
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <main className="screen-content">
                <header className="app-header">
                    <h1 className="logo">책담</h1>
                    <div className="header-icons">
                        <i className="fa-regular fa-magnifying-glass"></i>
                        <div className="notification-icon">
                            <i className="fa-regular fa-bell"></i>
                            <div className="notification-dot"></div>
                        </div>
                        <i className="fa-solid fa-bars" onClick={toggleCategoryMenu} ref={hamburgerRef}></i>
                    </div>
                </header>

                {showCategoryMenu && (
                    <div className="category-menu" ref={menuRef}>
                        <ul>
                            {categories.map(category => (
                                <li key={category.main} onClick={() => handleCategoryClick(category.main)}>
                                    <div className="main-category">
                                        <span>{category.main}</span>
                                        <span className={`caret-icon ${openCategory === category.main ? 'open' : ''}`}>&#9662;</span>
                                    </div>
                                    {openCategory === category.main && (
                                        <ul className="sub-category-list">
                                            {category.sub.map(subCategory => (
                                                <li key={subCategory}>{subCategory}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="scrollable-content">
                {showBanner && (
                    <section className="notification-banner">
                        <div className="banner-text">
                            <p className="greeting">수정님 안녕하세요!</p>
                            <p className="message">찜해두신 서적,<br /><span className="highlight">모순</span>이 새로 들어왔어요!</p>
                        </div>
                        <div className="banner-right">
                            <img src="/images/벨.png" alt="벨" className="banner-icon-img" />
                            <i className="fa-solid fa-xmark close-icon" onClick={() => setShowBanner(false)}></i>
                        </div>
                    </section>
                )}

                    <section className="recommendations">
                        <div className="section-header">
                            <h2><span className="highlight">수정님</span>을 위한 추천 도서</h2>
                            <Link to="/list/recommendations" className="view-all">전체 보기</Link>
                        </div>
                        <div className="filter-tabs">
                            <button className={`tab ${recommendationTab === 'today' ? 'active' : ''}`} onClick={() => setRecommendationTab('today')}>오늘의 추천</button>
                            <button className={`tab ${recommendationTab === 'popular' ? 'active' : ''}`} onClick={() => setRecommendationTab('popular')}>인기</button>
                            <button className={`tab ${recommendationTab === 'personalized' ? 'active' : ''}`} onClick={() => setRecommendationTab('personalized')}>내 취향 맞춤</button>
                        </div>
                        <div className="book-list-horizontal">
                            {recommendationList.map(book => (
                                <BookCard key={book.title} book={book} onHeartClick={(title) => handleHeartClick(recommendationList, setRecommendationList, title)} />
                            ))}
                        </div>
                    </section>

                    <hr className="section-divider" />

                    <section className="real-time-listings">
                        <div className="section-header">
                            <h2 className="highlight">실시간 매물 도서</h2>
                            <Link to="/list/realtime" className="view-all">전체 보기</Link>
                        </div>
                        <div className="filter-buttons">
                            <button className={`filter-btn ${realTimeTab === 'new' ? 'active' : ''}`} onClick={() => setRealTimeTab('new')}>새 매물</button>
                            <button className={`filter-btn ${realTimeTab === 'discounted' ? 'active' : ''}`} onClick={() => setRealTimeTab('discounted')}>가격 인하</button>
                        </div>
                        <div className="book-list-horizontal">
                            {realTimeList.map(book => (
                                <BookCard key={book.title} book={book} onHeartClick={(title) => handleHeartClick(realTimeList, setRealTimeList, title)} />
                            ))}
                        </div>
                    </section>

                    <hr className="section-divider" />

                    <section className="community-posts">
                        <div className="section-header">
                            <h2>커뮤니티 인기글</h2>
                            <Link to="#" className="view-all">더보기</Link>
                        </div>
                        <div className="post-list">
                            {/* Post items can be mapped here if they become dynamic */}
                            <div className="post-item">
                                <div className="post-content">
                                    <p className="post-category">자유글</p>
                                    <p className="post-title">다 읽은 책들, 어떻게 하시나요?</p>
                                    <div className="post-meta">
                                        <span>서연맘</span>
                                        <span>&middot;</span>
                                        <span>1시간 전</span>
                                    </div>
                                    <div className="post-stats">
                                        <i className="fa-regular fa-thumbs-up"></i> 12
                                        <i className="fa-regular fa-comment"></i> 5
                                    </div>
                                </div>
                                <div className="post-thumbnail">
                                    <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop" alt="책 더미" />
                                </div>
                            </div>
                            <div className="post-item">
                                <div className="post-content">
                                    <p className="post-category">책 추천</p>
                                    <p className="post-title">히가시노 게이고 신작 읽어보신 분?</p>
                                    <div className="post-meta">
                                        <span>추리소설광</span>
                                        <span>&middot;</span>
                                        <span>3시간 전</span>
                                    </div>
                                    <div className="post-stats">
                                        <i className="fa-regular fa-thumbs-up"></i> 25
                                        <i className="fa-regular fa-comment"></i> 8
                                    </div>
                                </div>
                            </div>
                            <div className="post-item">
                                <div className="post-content">
                                    <p className="post-category">분실</p>
                                    <p className="post-title">2호선에서 '모순' 책 잃어버리신 분</p>
                                    <div className="post-meta">
                                        <span>책주인찾아요</span>
                                        <span>&middot;</span>
                                        <span>5시간 전</span>
                                    </div>
                                    <div className="post-stats">
                                        <i className="fa-regular fa-thumbs-up"></i> 5
                                        <i className="fa-regular fa-comment"></i> 2
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <nav className="bottom-nav">
                    <div className="nav-item active">
                        <i className="fa-solid fa-house"></i>
                        <span>홈</span>
                    </div>
                    <div className="nav-item">
                        <i className="fa-regular fa-user-group"></i>
                        <span>커뮤니티</span>
                    </div>
                    <div className="nav-item">
                        <i className="fa-regular fa-square-plus"></i>
                        <span>등록</span>
                    </div>
                    <div className="nav-item">
                        <i className="fa-regular fa-comment-dots"></i>
                        <span>채팅</span>
                    </div>
                    <div className="nav-item">
                        <i className="fa-regular fa-user"></i>
                        <span>마이</span>
                    </div>
                </nav>
            </main>
            {showToast && (
                <div className="toast-message">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default Home;
