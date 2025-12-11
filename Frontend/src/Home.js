import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import BookCard from './BookCard';
import { allBooks, recommendationCategories, realTimeCategories } from './bookData';

import SearchModal from './components/SearchModal';

const Home = () => {
    const navigate = useNavigate();
    const [recommendationTab, setRecommendationTab] = useState('today');
    const [realTimeTab, setRealTimeTab] = useState('new');
    const [showBanner, setShowBanner] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const menuRef = React.useRef(null);
    const hamburgerRef = React.useRef(null);

    const [recommendationList, setRecommendationList] = useState([]);
    const [realTimeList, setRealTimeList] = useState([]);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };
    
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
        const key = recommendationTab === 'popular' ? 'popular' : recommendationTab === 'personalized' ? 'personalized' : 'recommend';
        const bookTitles = recommendationCategories[key];
        const list = bookTitles.map(title => allBooks[title]).filter(Boolean); // Filter out undefined if a title doesn't match
        setRecommendationList(list);
    }, [recommendationTab]);

    useEffect(() => {
        const key = realTimeTab === 'discounted' ? 'discounted' : 'new';
        const bookTitles = realTimeCategories[key];
        const list = bookTitles.map(title => allBooks[title]).filter(Boolean); // Filter out undefined if a title doesn't match
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

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    const toggleCategoryMenu = () => {
        setShowCategoryMenu(!showCategoryMenu);
        setOpenCategory(null); // Reset open category when toggling menu
    };

    const handleCategoryClick = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    const handleSubCategoryClick = (subCategory) => {
        navigate(`/category/${subCategory}`);
    };

    return (
        <div className="iphone-container">
            {showSearch && <SearchModal onClose={toggleSearch} />}
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
                        <i className="fa-regular fa-magnifying-glass" onClick={toggleSearch}></i>
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
                                                <li key={subCategory} onClick={() => handleSubCategoryClick(subCategory)}>{subCategory}</li>
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
                                <BookCard key={book.id} book={book} onSelect={handleBookClick} />
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
                                <BookCard key={book.id} book={book} onSelect={handleBookClick} />
                            ))}
                        </div>
                    </section>

                    <hr className="section-divider" />

                    <section className="community-posts">
                        <div className="section-header">
                            <h2>커뮤니티 인기글</h2>
                            <Link to="/community" className="view-all">더보기</Link>
                        </div>
                        <div className="post-list">
                            <Link to="/community/6" className="post-item-link">
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
                            </Link>
                            <Link to="/community/7" className="post-item-link">
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
                            </Link>
                            <Link to="/community/8" className="post-item-link">
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
                            </Link>
                        </div>
                    </section>
                </div>


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
