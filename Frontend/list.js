document.addEventListener('DOMContentLoaded', () => {
    // A larger dataset for the "View All" pages
    const allBookData = {
        recommendations: [
            { title: '모순', author: '양귀자', price: '10,800원', time: '1일 전', img: '모순.png', badge: 'S', liked: true },
            { title: '불편한 편의점', author: '김호연', price: '11,000원', time: '2일 전', img: '불편한.png', badge: 'B', liked: false },
            { title: '장미와 나이프', author: '히가시노 게이고', price: '10,800원', time: '5일 전', img: '장미와 나이프.jpeg', badge: 'C', liked: false },
            { title: '세이노의 가르침', author: '세이노', price: '6,480원', time: '3일 전', img: '세이노의 가르침.jpeg', badge: 'S', liked: false },
            { title: '역행자', author: '자청', price: '15,750원', time: '1일 전', img: '역행자.jpeg', badge: 'A', liked: true },
            { title: '도둑맞은 집중력', author: '요한 하리', price: '17,820원', time: '10일 전', img: '도둑맞은 집중력.jpeg', badge: 'C', liked: false },
            { title: '데일 카네기 인간관계론', author: '데일 카네기', price: '10,350원', time: '7일 전', img: 'https://image.aladin.co.kr/product/1924/7/cover500/8932900427_1.jpg', badge: 'A', liked: false },
            { title: '원씽', author: '게리 켈러', price: '12,600원', time: '4일 전', img: 'https://image.aladin.co.kr/product/39/22/cover500/8965960962_1.jpg', badge: 'S', liked: true },
        ],
        realtime: [
            { title: '소년이 온다', author: '한강', price: '12,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/5087/8/cover500/8936475113_1.jpg', badge: 'A', liked: true },
            { title: '꺼벙이 억수', author: '윤수현', price: '4,000원', time: '2일 전', img: 'https://image.aladin.co.kr/product/13/7/cover500/8995351109_1.jpg', badge: 'D', liked: false },
            { title: '악의', author: '히가시노 게이고', price: '6,800원', time: '5일 전', img: 'https://image.aladin.co.kr/product/1935/11/cover500/8982814307_1.jpg', badge: 'S', liked: false },
            { title: '달러구트 꿈 백화점', author: '이미예', price: '10,000원', time: '3일 전', img: '달러구트 꿈백화점.jpeg', badge: 'S', liked: false },
            { title: '파친코 1', author: '이민진', price: '11,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/28932/29/cover500/K842830332_1.jpg', badge: 'A', liked: true },
            { title: '구의 증명', author: '최진영', price: '8,000원', time: '8일 전', img: 'https://image.aladin.co.kr/product/1359/74/cover500/8954652352_1.jpg', badge: 'B', liked: false },
        ]
    };

    const titleElement = document.querySelector('.list-page-title');
    const contentElement = document.querySelector('.list-page-content');

    // 1. Read category from URL
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    let booksToRender = [];
    let pageTitle = '';

    if (category === 'recommendations') {
        booksToRender = allBookData.recommendations;
        pageTitle = '추천 도서';
    } else if (category === 'realtime') {
        booksToRender = allBookData.realtime;
        pageTitle = '실시간 매물 도서';
    } else {
        pageTitle = '도서 목록';
    }

    // 2. Set page title
    titleElement.textContent = pageTitle;

    // 3. Render books
    contentElement.innerHTML = ''; // Clear
    booksToRender.forEach(book => {
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
        contentElement.insertAdjacentHTML('beforeend', bookCardHTML);
    });

    // 4. Add heart click functionality (optional, but good for consistency)
    contentElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('heart-icon')) {
            const icon = event.target;
            const title = icon.dataset.title;
            const book = booksToRender.find(b => b.title === title);
            if (book) {
                book.liked = !book.liked;
                icon.classList.toggle('fa-solid');
                icon.classList.toggle('fa-regular');
                icon.classList.toggle('active');
            }
        }
    });
});
