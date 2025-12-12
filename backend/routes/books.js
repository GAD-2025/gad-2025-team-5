const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// .env에서 키 가져오기
const ALADIN_API_KEY = process.env.ALADIN_API_KEY || process.env.REACT_APP_ALADIN_API_KEY || '';
const ALADIN_BASE_URL = 'https://www.aladin.co.kr/ttb/api';

// ---------------------------------------------------------
// 📚 [핵심] 프론트엔드 책 데이터 (여기에 다 넣었습니다!)
// ---------------------------------------------------------
const allBooks = {
    '모순': {
        id: '모순',
        title: '모순',
        authors: ['양귀자'],
        price: '9,800원',
        transaction: '직거래',
        time: '1일 전',
        img: '/images/모순.png',
        badge: 'S',
        liked: true,
        date: '2025/10/22',
        seller: '난난판다',
        seller_role: '아날로그 독서가',
        seller_comment: '유명하고 잘읽힌다해서 읽어봤는데, 작가님 문체가 쉽게 잘읽혔고 매사 인생이 조용한적없는 나날이라 삶이 피곤하다생각했는데, 이 또한 경험이고 이런 여러 경험을하고 살아갈수 있는게 감사하다는 생각을하게되었어요.',
        book_status: '2025년 10월 20일날 책을 사서 한번 정독했어요 밑줄도 없고 구김도 없이 깨끗해요',
        book_intro: '초판이 나온 지 벌써 15년이 흘렀지만 이 소설 『모순』은 아주 특별한 길을 걷고 있다. 그때 20대였던 독자들은 지금 결혼을 하고 30대가 되어서도 가끔씩 『모순』을 꺼내 다시 읽는다고 했다.',
        category: '국내도서 > 소설/시/희곡 > 한국소설 > 한국 장편소설'
    },
    '불편한 편의점': {
        id: '불편한 편의점',
        title: '불편한 편의점',
        authors: ['김호연'],
        price: '11,000원',
        transaction: '직거래',
        time: '2일 전',
        img: '/images/불편한 편의점.png',
        badge: 'B',
        liked: false,
        date: '2025/10/21',
        seller: '판매자2',
        seller_role: '책방주인',
        seller_comment: '베스트셀러라서 읽어봤습니다. 재미있어요.',
        book_status: '상태 좋습니다.',
        book_intro: '불편한데 자꾸 가고 싶은 편의점이 있다!',
        category: '국내도서 > 소설/시/희곡 > 한국소설'
    },
    '장미와 나이프': {
        id: '장미와 나이프',
        title: '장미와 나이프',
        authors: ['히가시노 게이고'],
        price: '10,800원',
        transaction: '택배거래',
        time: '5일 전',
        img: '/images/장미와 나이프.jpeg',
        badge: 'C',
        liked: false,
        date: '2025/10/18',
        seller: '판매자3',
        seller_role: '추리소설 광팬',
        seller_comment: '히가시노 게이고 신작입니다.',
        book_status: '약간의 사용감 있습니다.',
        book_intro: '미스터리의 거장 히가시노 게이고의 신작.',
        category: '국내도서 > 소설/시/희곡 > 일본소설'
    },
    '세이노의 가르침': {
        id: '세이노의 가르침',
        title: '세이노의 가르침',
        authors: ['세이노'],
        price: '6,480원',
        transaction: '직거래',
        time: '3일 전',
        img: '/images/세이노의 가르침.jpeg',
        badge: 'S',
        liked: false,
        date: '2025/10/20',
        seller: '판매자4',
        seller_role: '자기계발 전문가',
        seller_comment: '인생의 지혜를 얻을 수 있는 책입니다.',
        book_status: '거의 새 책입니다.',
        book_intro: '부와 성공의 길을 제시하는 세이노의 가르침.',
        category: '국내도서 > 자기계발'
    },
    '역행자': {
        id: '역행자',
        title: '역행자',
        authors: ['자청'],
        price: '15,750원',
        transaction: '택배거래',
        time: '1일 전',
        img: '/images/역행자.jpeg',
        badge: 'A',
        liked: true,
        date: '2025/10/22',
        seller: '판매자5',
        seller_role: '성공한 사업가',
        seller_comment: '인생을 바꾸고 싶다면 꼭 읽어보세요.',
        book_status: '깨끗합니다.',
        book_intro: '부를 얻는 가장 빠른 길, 역행자의 사고방식.',
        category: '국내도서 > 자기계발'
    },
    '도둑맞은 집중력': {
        id: '도둑맞은 집중력',
        title: '도둑맞은 집중력',
        authors: ['요한 하리'],
        price: '17,820원',
        transaction: '직거래',
        time: '10일 전',
        img: '/images/도둑맞은 집중력.jpeg',
        badge: 'C',
        liked: false,
        date: '2025/10/13',
        seller: '판매자6',
        seller_role: '집중이 필요한 개발자',
        seller_comment: '집중력 문제를 해결해준 책입니다.',
        book_status: '약간의 밑줄이 있습니다.',
        book_intro: '집중력 위기의 시대, 어떻게 살아남을 것인가.',
        category: '국내도서 > 인문'
    },
    '데일 카네기 인간관계론': {
        id: '데일 카네기 인간관계론',
        title: '데일 카네기 인간관계론',
        authors: ['데일 카네기'],
        price: '10,350원',
        transaction: '택배거래',
        time: '7일 전',
        img: 'https://image.aladin.co.kr/product/1924/7/cover500/8932900427_1.jpg',
        badge: 'A',
        liked: false,
        date: '2025/10/16',
        seller: '판매자7',
        seller_role: '인간관계 마스터',
        seller_comment: '인간관계의 바이블.',
        book_status: '새 책 수준입니다.',
        book_intro: '데일 카네기의 인간관계론, 시대를 초월한 명저.',
        category: '국내도서 > 자기계발'
    },
    '원씽': {
        id: '원씽',
        title: '원씽',
        authors: ['게리 켈러'],
        price: '12,600원',
        transaction: '직거래',
        time: '4일 전',
        img: 'https://image.aladin.co.kr/product/39/22/cover500/8965960962_1.jpg',
        badge: 'S',
        liked: true,
        date: '2025/10/19',
        seller: '판매자8',
        seller_role: '프로 독서가',
        seller_comment: '복잡한 세상을 단순하게 사는 법.',
        book_status: '필기 흔적 없음.',
        book_intro: '복잡한 세상을 이기는 단순함의 힘, 원씽.',
        category: '국내도서 > 자기계발'
    },
    '부의 추월차선': {
        id: '부의 추월차선',
        title: '부의 추월차선',
        authors: ['엠제이 드마코'],
        price: '13,500원',
        transaction: '택배거래',
        time: '6일 전',
        img: 'https://image.aladin.co.kr/product/3134/35/cover500/8965961489_1.jpg',
        badge: 'B',
        liked: false,
        date: '2025/10/17',
        seller: '판매자9',
        seller_role: '경제적 자유 추구자',
        seller_comment: '부에 대한 관점을 바꿔준 책.',
        book_status: '깨끗하게 읽었습니다.',
        book_intro: '부를 만드는 지름길은 따로 있다.',
        category: '국내도서 > 자기계발'
    },
    '소년이 온다': {
        id: '소년이 온다',
        title: '소년이 온다',
        authors: ['한강'],
        price: '12,500원',
        transaction: '직거래',
        time: '1일 전',
        img: 'https://image.aladin.co.kr/product/5087/8/cover500/8936475113_1.jpg',
        badge: 'A',
        liked: true,
        date: '2025/10/22',
        seller: '판매자10',
        seller_role: '문학 애호가',
        seller_comment: '마음 아프지만 꼭 읽어야 할 책.',
        book_status: '새 책입니다.',
        book_intro: '5.18 광주 민주화 운동을 다룬 소설.',
        category: '국내도서 > 소설/시/희곡 > 한국소설'
    },
    '꺼벙이 억수': {
        id: '꺼벙이 억수',
        title: '꺼벙이 억수',
        authors: ['윤수현'],
        price: '4,000원',
        transaction: '직거래',
        time: '2일 전',
        img: 'https://image.aladin.co.kr/product/13/7/cover500/8995351109_1.jpg',
        badge: 'D',
        liked: false,
        date: '2025/10/21',
        seller: '판매자11',
        seller_role: '만화책 수집가',
        seller_comment: '추억의 만화책입니다.',
        book_status: '세월의 흔적이 있습니다.',
        book_intro: '꺼벙이 억수의 좌충우돌 이야기.',
        category: '국내도서 > 만화'
    },
    '악의': {
        id: '악의',
        title: '악의',
        authors: ['히가시노 게이고'],
        price: '6,800원',
        transaction: '택배거래',
        time: '5일 전',
        img: 'https://image.aladin.co.kr/product/1935/11/cover500/8982814307_1.jpg',
        badge: 'S',
        liked: false,
        date: '2025/10/18',
        seller: '판매자12',
        seller_role: '추리소설 매니아',
        seller_comment: '반전이 충격적인 소설.',
        book_status: '깨끗합니다.',
        book_intro: '인간의 악의에 대한 깊은 통찰.',
        category: '국내도서 > 소설/시/희곡 > 일본소설'
    },
    '달러구트 꿈 백화점': {
        id: '달러구트 꿈 백화점',
        title: '달러구트 꿈 백화점',
        authors: ['이미예'],
        price: '10,000원',
        originalPrice: '13,800원',
        transaction: '직거래',
        time: '3일 전',
        img: '/images/달러구트 꿈백화점.jpeg',
        badge: 'S',
        liked: false,
        date: '2025/10/20',
        seller: '판매자13',
        seller_role: '판타지 소설 애독자',
        seller_comment: '마음이 따뜻해지는 소설입니다.',
        book_status: '새 책과 다름없습니다.',
        book_intro: '잠들어야만 입장할 수 있는 특별한 백화점 이야기.',
        category: '국내도서 > 소설/시/희곡 > 한국소설'
    },
    '파친코 1': {
        id: '파친코 1',
        title: '파친코 1',
        authors: ['이민진'],
        price: '11,500원',
        originalPrice: '15,800원',
        transaction: '택배거래',
        time: '1일 전',
        img: 'https://image.aladin.co.kr/product/28932/29/cover500/K842830332_1.jpg',
        badge: 'A',
        liked: true,
        date: '2025/10/22',
        seller: '판매자14',
        seller_role: '역사소설 애호가',
        seller_comment: '재미와 감동을 모두 잡은 소설.',
        book_status: '한 번 읽었습니다.',
        book_intro: '재일 한국인 가족의 4대에 걸친 이야기.',
        category: '국내도서 > 소설/시/희곡 > 한국소설'
    }
};

// ---------------------------------------------------------
// 🌱 데이터 자동 주입 기능 (Seeding)
// ---------------------------------------------------------
router.post('/seed', async (req, res) => {
    console.log('🌱 데이터 심기 시작...');
    const bookList = Object.values(allBooks);
    let successCount = 0;

    for (const book of bookList) {
        try {
            // 1. 데이터 다듬기
            const priceNumber = parseInt(book.price.toString().replace(/[^0-9]/g, ''), 10);
            const genre = book.category.includes('>') ? book.category.split('>')[1].trim() : book.category;
            const shipping = book.transaction === '직거래' ? 'included' : 'extra';

            // 2. 이미 있는지 확인 (중복 방지)
            const [exist] = await pool.query('SELECT id FROM books WHERE title = ?', [book.title]);
            if (exist.length > 0) {
                console.log(`PASS: "${book.title}" (이미 있음)`);
                continue; 
            }

            // 3. DB에 넣기
            await pool.query(
                `INSERT INTO books (user_id, title, description, one_line_review, price, shipping_option, price_suggestion, genre, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [1, book.title, book.book_intro, book.seller_comment, priceNumber, shipping, 0, genre, book.img]
            );
            
            console.log(`✅ 저장 완료: "${book.title}"`);
            successCount++;

        } catch (err) {
            console.error(`❌ 에러 발생 (${book.title}):`, err.message);
        }
    }

    res.json({ message: `${successCount}권의 책이 저장되었습니다!` });
});


// 🔍 [필수] ID 조회 API (프론트엔드가 제목으로 ID 찾을 때 사용)
router.get('/lookup', async (req, res) => {
    const { title } = req.query;
    try {
        const [rows] = await pool.query('SELECT id FROM books WHERE title = ?', [title]);
        if (rows.length > 0) res.json({ id: rows[0].id });
        else res.status(404).json({ message: 'Not found' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 🔎 [필수] 상세 조회 API
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ message: 'Not found' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- (기타 기능들) ---

// 베스트셀러
router.get('/bestseller', async (req, res) => {
    const { maxResults = 10, start = 1 } = req.query;
    const url = `${ALADIN_BASE_URL}/ItemList.aspx?ttbkey=${ALADIN_API_KEY}&QueryType=Bestseller&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bestseller books' });
    }
});

// 검색
router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const url = `${ALADIN_BASE_URL}/ItemSearch.aspx?ttbkey=${ALADIN_API_KEY}&Query=${encodeURIComponent(query)}&output=js&Version=20131101`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search books' });
    }
});

// ISBN 조회
router.get('/isbn-lookup', async (req, res) => {
    const { isbn } = req.query;
    if (!isbn) return res.status(400).json({ message: 'ISBN parameter is required' });
    try {
        const url = `${ALADIN_BASE_URL}/ItemLookUp.aspx?ttbkey=${ALADIN_API_KEY}&itemIdType=ISBN&ItemId=${isbn}&output=js&Version=20131101`;
        const response = await axios.get(url);
        const data = response.data;
        if (data.item && data.item.length > 0) res.json(data.item[0]);
        else res.status(404).json({ message: 'Book not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to lookup book' });
    }
});

// 전체 목록
router.get('/', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 책 생성
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    const userId = req.user.id;
    const { title, description, oneLineReview, price, shippingOption, priceSuggestion, genre, imageUrl: bodyImageUrl } = req.body;
    const priceInt = parseInt(price, 10);
    const priceSuggestionBool = priceSuggestion === 'true';
    if (!title || !price) return res.status(400).json({ message: 'Title and price are required.' });

    let finalImageUrl = bodyImageUrl;
    if (req.file) finalImageUrl = `https://fake-cloud-url.com/${req.file.originalname}`;

    try {
        const [result] = await pool.query(
            'INSERT INTO books (user_id, title, description, one_line_review, price, shipping_option, price_suggestion, genre, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, oneLineReview, priceInt, shippingOption, priceSuggestionBool, genre, finalImageUrl]
        );
        res.status(201).json({ id: result.insertId, ...req.body, imageUrl: finalImageUrl });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;