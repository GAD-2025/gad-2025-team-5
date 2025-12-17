const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/users/interests - Save user interests
router.post('/interests', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { genres } = req.body; // ['소설', '인문', '과학']

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
        return res.status(400).send('Genres are required and must be a non-empty array.');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. 기존 관심 장르 삭제
        await connection.execute('DELETE FROM user_interests WHERE user_id = ?', [userId]);

        // 2. 장르 이름으로 genre_id 찾기
        const placeholders = genres.map(() => '?').join(',');
        const [genreRows] = await connection.query(`SELECT id, name FROM genres WHERE name IN (${placeholders})`, genres);

        if (genreRows.length !== genres.length) {
            // DB에 없는 장르가 포함된 경우
            const foundGenres = genreRows.map(g => g.name);
            const missingGenres = genres.filter(g => !foundGenres.includes(g));
            await connection.rollback();
            connection.release();
            return res.status(400).send(`Invalid genres: ${missingGenres.join(', ')}`);
        }

        // 3. user_interests 테이블에 새로운 관심 장르 삽입
        const interestValues = genreRows.map(genre => [userId, genre.id]);
        if (interestValues.length > 0) {
            await connection.query('INSERT INTO user_interests (user_id, genre_id) VALUES ?', [interestValues]);
        }

        await connection.commit();
        connection.release();
        res.status(200).send('User interests saved successfully.');

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error('Error saving user interests:', error);
        res.status(500).send('Server error while saving interests.');
    }
});

// POST /api/users/preferences/books - Save user's favorite books
router.post('/preferences/books', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { books } = req.body; // Array of book IDs or objects

    if (!books || !Array.isArray(books)) {
        return res.status(400).send('Books must be provided as an array.');
    }

    try {
        const booksJson = JSON.stringify(books);

        const sql = `
            INSERT INTO user_preferences (user_id, books) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE books = VALUES(books);
        `;

        await pool.query(sql, [userId, booksJson]);

        res.status(200).send('Book preferences saved successfully.');
    } catch (error) {
        console.error('Error saving book preferences:', error);
        res.status(500).send('Server error while saving book preferences.');
    }
});



// GET /api/users/me - Get current user's info
router.get('/me', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // 1. 유저 기본 정보 가져오기
        const [users] = await pool.query('SELECT id, email, nickname FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];

        // 2. 유저의 관심 장르 목록 가져오기
        const [interestRows] = await pool.query(
            `SELECT g.name FROM genres g
             JOIN user_interests ui ON g.id = ui.genre_id
             WHERE ui.user_id = ?`,
            [userId]
        );
        
        const genres = interestRows.map(row => row.name);

        // 3. 최종 유저 정보 조합
        const userInfo = {
            ...user,
            genres: genres
        };

        res.json(userInfo);

    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/users/:userId/books - Get all books registered by a user
router.get('/:userId/books', async (req, res) => {
    const { userId } = req.params;
    try {
        const [books] = await pool.query('SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(books);
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
