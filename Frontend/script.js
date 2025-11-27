document.addEventListener('DOMContentLoaded', () => {
    const bookData = {
        recommend: [
            { title: '모순', author: '양귀자', price: '10,800원', time: '1일 전', img: '모순.png', badge: 'S', liked: true },
            { title: '불편한 편의점', author: '김호연', price: '11,000원', time: '2일 전', img: '불편한.png', badge: 'B', liked: false },
            { title: '장미와 나이프', author: '히가시노 게이고', price: '10,800원', time: '5일 전', img: '장미와 나이프.jpeg', badge: 'C', liked: false }
        ],
        popular: [
            { title: '세이노의 가르침', author: '세이노', price: '6,480원', time: '3일 전', img: '세이노의 가르침.jpeg', badge: 'S', liked: false },
            { title: '역행자', author: '자청', price: '15,750원', time: '1일 전', img: '역행자.jpeg', badge: 'A', liked: true },
            { title: '도둑맞은 집중력', author: '요한 하리', price: '17,820원', time: '10일 전', img: '도둑맞은 집중력.jpeg', badge: 'C', liked: false }
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
            { title: '달러구트 꿈 백화점', author: '이미예', price: '10,000원', time: '3일 전', img: '달러구트 꿈백화점.jpeg', badge: 'S', liked: false },
            { title: '파친코 1', author: '이민진', price: '11,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/28932/29/cover500/K842830332_1.jpg', badge: 'A', liked: true }
        ]
    };

    // --- State ---
    let currentRecommendationList = bookData.recommend;
    let currentRealTimeList = realTimeBookData.new;

    // --- Selectors ---
    const recommendationTabs = document.querySelectorAll('.recommendations .filter-tabs .tab');
    const recommendationListContainer = document.querySelector('.recommendations .book-list-horizontal');
    const realTimeTabs = document.querySelectorAll('.real-time-listings .filter-btn');
    const realTimeListContainer = document.querySelector('.real-time-listings .book-list-horizontal');

    // --- Render Function ---
    const renderBookList = (container, bookList) => {
        container.innerHTML = ''; // Clear existing books
        bookList.forEach(book => {
            const heartIconClass = book.liked ? 'fa-solid fa-heart heart-icon active' : 'fa-regular fa-heart heart-icon';
            const bookCardHTML = `
                <div class="book-card">
                    <div class="book-cover">
                        <img src="${book.img}" alt="${book.title}">
                        <div class="status-badge">${book.badge}</div>
                        <i class="${heartIconClass}" data-title="${book.title}"></i>
                    </div>
                    <div class="book-info">
                        <p class="title">${book.title}</p>
                        <p class="author">${book.author}</p>
                        <p class="price">${book.price}</p>
                        <p class="time-ago">${book.time}</p>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', bookCardHTML);
        });
    };

    // --- Event Listeners ---

    // Recommendations Tabs
    recommendationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            recommendationTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.textContent;
            if (tabName === '인기') {
                currentRecommendationList = bookData.popular;
            } else if (tabName === '내 취향 맞춤') {
                currentRecommendationList = bookData.personalized;
            } else {
                currentRecommendationList = bookData.recommend;
            }
            renderBookList(recommendationListContainer, currentRecommendationList);
        });
    });

    // Real-time Tabs
    realTimeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            realTimeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.textContent;
            if (tabName === '가격 인하') {
                currentRealTimeList = realTimeBookData.discounted;
            } else {
                currentRealTimeList = realTimeBookData.new;
            }
            renderBookList(realTimeListContainer, currentRealTimeList);
        });
    });

    // Heart Icon Clicks (Event Delegation)
    const handleHeartClick = (event, bookList, container) => {
        if (event.target.classList.contains('heart-icon')) {
            const title = event.target.dataset.title;
            const book = bookList.find(b => b.title === title);
            if (book) {
                book.liked = !book.liked;
                // Re-render the list to reflect the change
                renderBookList(container, bookList);
            }
        }
    };

    recommendationListContainer.addEventListener('click', (e) => {
        handleHeartClick(e, currentRecommendationList, recommendationListContainer);
    });

    realTimeListContainer.addEventListener('click', (e) => {
        handleHeartClick(e, currentRealTimeList, realTimeListContainer);
    });


    // --- Initial Render ---
    renderBookList(recommendationListContainer, currentRecommendationList);
    renderBookList(realTimeListContainer, currentRealTimeList);
});
