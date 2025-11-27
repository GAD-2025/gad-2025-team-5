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


module.exports = router;
