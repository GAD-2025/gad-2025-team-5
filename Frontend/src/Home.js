import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css'; // Import CSS module
import BookCard from './BookCard';
import SearchModal from './components/SearchModal';

// Import new assets
import logo from './assets/logo.png';
import searchIcon from './assets/search.svg';
import bellIcon from './assets/bell.svg';
import menuIcon from './assets/menu.svg';
import closeIcon from './assets/close.svg';
import bellIllustration from './assets/bell-illustration.png';


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
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);

    const [userName, setUserName] = useState('수정');
    
    const [todaysBooks, setTodaysBooks] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [personalizedBooks, setPersonalizedBooks] = useState([]);
    const [realTimeList, setRealTimeList] = useState([]);

    const [currentRecommendationList, setCurrentRecommendationList] = useState([]);

    const formatBooks = (books) => books.map(book => ({
        ...book,
        img: book.image_url,
        authors: book.author ? book.author.split(',').map(a => a.trim()) : []
    }));

    const fetchBooks = useCallback(async () => {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        try {
            const [todayRes, popularRes, personalizedRes, realTimeRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/books/today`),
                fetch(`${process.env.REACT_APP_API_URL}/api/books/popular`),
                fetch(`${process.env.REACT_APP_API_URL}/api/books/personalized`, { headers }),
                fetch(`${process.env.REACT_APP_API_URL}/api/books`)
            ]);

            if (todayRes.ok) setTodaysBooks(formatBooks(await todayRes.json()));
            if (popularRes.ok) setPopularBooks(formatBooks(await popularRes.json()));
            if (personalizedRes.ok) setPersonalizedBooks(formatBooks(await personalizedRes.json()));
            if (realTimeRes.ok) setRealTimeList(formatBooks(await realTimeRes.json()));

        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    useEffect(() => {
        if (recommendationTab === 'today') {
            setCurrentRecommendationList(todaysBooks);
        } else if (recommendationTab === 'popular') {
            setCurrentRecommendationList(popularBooks);
        } else if (recommendationTab === 'personalized') {
            setCurrentRecommendationList(personalizedBooks);
        }
    }, [recommendationTab, todaysBooks, popularBooks, personalizedBooks]);


    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUserName(userData.nickname);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, []);

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
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                setToastMessage('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    const toggleCategoryMenu = () => {
        setShowCategoryMenu(!showCategoryMenu);
        setOpenCategory(null);
    };

    const handleCategoryClick = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    const handleSubCategoryClick = (subCategory) => {
        navigate(`/category/${subCategory}`);
    };

    // Dummy data for community posts as in the original file
    const communityPosts = [
        { id: 6, category: '자유글', title: '다 읽은 책들, 어떻게 하시나요?', author: '서연맘', time: '1시간 전', likes: 12, comments: 5, thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop" },
        { id: 8, category: '분실', title: '2호선에서 \'모순\' 책 잃어버리신 분', author: '책주인찾아요', time: '5시간 전', likes: 5, comments: 2 },
        { id: 7, category: '책 추천', title: '히가시노 게이고 신작 읽어보신 분?', author: '추리소설광', time: '3시간 전', likes: 25, comments: 8 },
    ];


    return (
        <div className={styles.container}>
            {showSearch && <SearchModal onClose={toggleSearch} />}
            
            <header className={styles.header}>
                <img src={logo} alt="책담 로고" className={styles.logo} />
                <div className={styles.headerIcons}>
                    <img src={searchIcon} alt="Search" className={styles.searchIcon} onClick={toggleSearch} />
                    <div className={styles.notificationIcon}>
                        <img src={bellIcon} alt="Notifications" className={styles.bellIcon} />
                        <div className={styles.notificationDot}></div>
                    </div>
                    <img src={menuIcon} alt="Menu" className={styles.menuIcon} onClick={toggleCategoryMenu} ref={hamburgerRef} />
                </div>
            </header>

            {showCategoryMenu && (
                <div className={styles.categoryMenu} ref={menuRef}>
                    
                    <ul>
                        {categories.map(category => (
                            <li key={category.main} onClick={() => handleCategoryClick(category.main)}>
                                <div className={styles.mainCategory}>
                                    <span>{category.main}</span>
                                    <span className={`${styles.caretIcon} ${openCategory === category.main ? styles.open : ''}`}>&#9662;</span>
                                </div>
                                {openCategory === category.main && (
                                    <ul className={styles.subCategoryList}>
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

            <main className={styles.scrollableContent}>
                {showBanner && (
                    <section className={styles.notificationBanner}>
                        <div className={styles.bannerText}>
                            <p className={styles.greeting}>{userName}님 안녕하세요!</p>
                            <p className={styles.message}>
                                {userName}님 어제 <span className={styles.highlight}>모순</span>이 새로 들어왔어요!
                            </p>
                        </div>
                        <div className={styles.bannerRight}>
                            <img src={bellIllustration} alt="벨" className={styles.bannerIconImg} />
                            <img src={closeIcon} alt="Close" className={styles.closeIcon} onClick={() => setShowBanner(false)} />
                        </div>
                    </section>
                )}

                <section className={styles.recommendations}>
                    <div className={styles.sectionHeader}>
                        <h2><span className={styles.highlight}>{userName}님</span>을 위한 추천 도서</h2>
                        <Link to="/list/recommendations" className={styles.viewAll}>전체 보기</Link>
                    </div>
                    <div className={styles.filterTabs}>
                        <button className={`${styles.tab} ${recommendationTab === 'today' ? styles.active : ''}`} onClick={() => setRecommendationTab('today')}>오늘의 추천</button>
                        <button className={`${styles.tab} ${recommendationTab === 'popular' ? styles.active : ''}`} onClick={() => setRecommendationTab('popular')}>인기</button>
                        <button className={`${styles.tab} ${recommendationTab === 'personalized' ? styles.active : ''}`} onClick={() => setRecommendationTab('personalized')}>내 취향 맞춤</button>
                    </div>
                    <div className={styles.bookListHorizontal}>
                        {currentRecommendationList.map(book => (
                            <BookCard key={book.id} book={book} onSelect={handleBookClick} />
                        ))}
                    </div>
                </section>

                <div className={styles.sectionDivider} />

                <section className={styles.realTimeListings}>
                    <div className={styles.sectionHeader}>
                        <h2><span className={styles.highlight}>실시간</span> 매물 도서</h2>
                        <Link to="/list/realtime" className={styles.viewAll}>전체 보기</Link>
                    </div>
                    <div className={styles.filterTabs}>
                        <button className={`${styles.tab} ${realTimeTab === 'new' ? styles.active : ''}`} onClick={() => setRealTimeTab('new')}>새 매물</button>
                        <button className={`${styles.tab} ${realTimeTab === 'discounted' ? styles.active : ''}`} onClick={() => setRealTimeTab('discounted')}>가격 인하</button>
                    </div>
                    <div className={styles.bookListHorizontal}>
                        {realTimeList.map(book => (
                            <BookCard key={book.id} book={book} onSelect={handleBookClick} />
                        ))}
                    </div>
                </section>

                <div className={styles.sectionDivider} />

                <section className={styles.communityPosts}>
                    <div className={styles.sectionHeader}>
                        <h2><span className={styles.highlight}>커뮤니티</span> 인기글</h2>
                        <Link to="/community" className={styles.viewAll}>더보기</Link>
                    </div>
                    <div className={styles.postList}>
                        {communityPosts.map(post => (
                             <Link to={`/community/${post.id}`} key={post.id} className={styles.postItemLink}>
                                <div className={styles.postItem}>
                                    <div className={styles.postContent}>
                                        <p className={styles.postTitle}>{post.title}</p>
                                        <p className={styles.postSnippet}>{post.author} · {post.time}</p>
                                        <div className={styles.postStats}>
                                            <i className="fa-regular fa-thumbs-up"></i> {post.likes}
                                            <i className="fa-regular fa-comment"></i> {post.comments}
                                        </div>
                                    </div>
                                    {post.thumbnail && (
                                        <div className={styles.postThumbnail}>
                                            <img src={post.thumbnail} alt={post.title} />
                                        </div>

                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {showToast && (
                <div className={styles.toastMessage}>
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default Home;
