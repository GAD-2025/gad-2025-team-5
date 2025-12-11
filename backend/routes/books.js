const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// .env에서 키 가져오기 (없으면 에러 방지용 빈 문자열)
const ALADIN_API_KEY = process.env.ALADIN_API_KEY || process.env.REACT_APP_ALADIN_API_KEY || '';
const ALADIN_BASE_URL = 'https://www.aladin.co.kr/ttb/api';

// [디버깅] 키가 잘 들어왔나 확인 (비밀번호니까 앞 4자리만 출력)
console.log('🔑 현재 적용된 알라딘 키:', ALADIN_API_KEY ? ALADIN_API_KEY.substring(0, 4) + '****' : '없음(NULL)');

// 1. 베스트셀러 (순서: 맨 위!)
router.get('/bestseller', async (req, res) => {
    console.log('🚀 [1] 베스트셀러 요청 받음!');
    
    const { maxResults = 10, start = 1 } = req.query;
    const url = `${ALADIN_BASE_URL}/ItemList.aspx?ttbkey=${ALADIN_API_KEY}&QueryType=Bestseller&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;
    
    console.log('🔗 [2] 알라딘으로 요청 보냄:', url);

    try {
        const response = await axios.get(url);
        
        // [중요] 알라딘이 뭐라고 대답했는지 로그에 출력!!
        console.log('📦 [3] 알라딘 응답 상태:', response.status);
        if (response.data) {
            console.log('📄 [4] 응답 데이터(일부):', JSON.stringify(response.data).substring(0, 200)); 
            // 만약 에러 메시지가 왔다면 여기서 보임
        }

        res.json(response.data);
    } catch (error) {
        console.error('💥 [Error] 알라딘 통신 실패:', error.message);
        res.status(500).json({ message: 'Failed to fetch bestseller books' });
    }
});

// 2. 검색
router.get('/search', async (req, res) => {
    const { query, maxResults = 12, start = 1 } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    
    const url = `${ALADIN_BASE_URL}/ItemSearch.aspx?ttbkey=${ALADIN_API_KEY}&Query=${encodeURIComponent(query)}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Failed to search books' });
    }
});

// 3. ISBN 조회
router.get('/isbn-lookup', async (req, res) => {
    const { isbn } = req.query;
    if (!isbn) return res.status(400).json({ message: 'ISBN parameter is required' });

    try {
        const url = `${ALADIN_BASE_URL}/ItemLookUp.aspx?ttbkey=${ALADIN_API_KEY}&itemIdType=ISBN&ItemId=${isbn}&output=js&Version=20131101`;
        const response = await axios.get(url);
        
        // 알라딘 데이터 구조 확인
        const data = response.data;
        if (data.item && data.item.length > 0) {
            res.json(data.item[0]);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error looking up book:', error);
        res.status(500).json({ message: 'Failed to lookup book' });
    }
});

// 4. 전체 목록 (DB)
router.get('/', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 5. 책 생성
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    const userId = req.user.id;
    
    // [수정 포인트] FormData로 온 값들을 올바른 형태(숫자, 불리언)로 변환해줍니다.
    const { title, description, oneLineReview, price, shippingOption, priceSuggestion, imageUrl: bodyImageUrl } = req.body;
    
    // 숫자로 변환 (가격이 문자로 오면 에러남)
    const priceInt = parseInt(price, 10);
    // 참/거짓으로 변환 ('true'라는 문자를 진짜 true로)
    const priceSuggestionBool = priceSuggestion === 'true';

    if (!title || !price) {
        return res.status(400).json({ message: 'Title and price are required.' });
    }

    let finalImageUrl = bodyImageUrl;

    // 이미지 파일이 있으면 처리
    if (req.file) {
        // TODO: 실제 클라우드 업로드 구현 필요. 지금은 가짜 URL
        finalImageUrl = `https://fake-cloud-url.com/${req.file.originalname}`;
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO books (user_id, title, description, one_line_review, price, shipping_option, price_suggestion, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, oneLineReview, priceInt, shippingOption, priceSuggestionBool, finalImageUrl]
        );
        res.status(201).json({ id: result.insertId, ...req.body, imageUrl: finalImageUrl });
    } catch (error) {
        console.error('Error creating book:', error); // 터미널에 에러 이유 출력
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 6. 상세 조회 (순서: 맨 아래!)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        if (books.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.json(books[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;