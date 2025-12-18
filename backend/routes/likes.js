const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/likes/status/:book_id - Check if the current user has liked a book
router.get('/status/:book_id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { book_id } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM likes WHERE user_id = ? AND book_id = ?',
            [userId, book_id]
        );
        res.json({ isLiked: rows.length > 0 });
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/likes - Like a book
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required.' });
    }

    try {
        await pool.query(
            'INSERT INTO likes (user_id, book_id) VALUES (?, ?)',
            [userId, bookId]
        );
        res.status(201).json({ message: 'Book liked successfully.' });
    } catch (error) {
        // Handle potential duplicate entry errors gracefully
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Book already liked.' });
        }
        console.error('Error liking book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/likes/:book_id - Unlike a book
router.delete('/:book_id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { book_id } = req.params;

    try {
        const [result] = await pool.query(
            'DELETE FROM likes WHERE user_id = ? AND book_id = ?',
            [userId, book_id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Book unliked successfully.' });
        } else {
            res.status(404).json({ message: 'Like not found.' });
        }
    } catch (error) {
        console.error('Error unliking book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/likes/toggle - Toggle like status for a book
router.post('/toggle', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required.' });
    }

    try {
        // 1. Check if like already exists
        const [existingLikes] = await pool.query(
            'SELECT * FROM likes WHERE user_id = ? AND book_id = ?',
            [userId, bookId]
        );

        if (existingLikes.length > 0) {
            // 2. If exists, delete (unlike)
            await pool.query(
                'DELETE FROM likes WHERE user_id = ? AND book_id = ?',
                [userId, bookId]
            );
            return res.status(200).json({ isLiked: false, message: '좋아요 취소됨' });
        } else {
            // 3. If not exists, insert (like)
            await pool.query(
                'INSERT INTO likes (user_id, book_id) VALUES (?, ?)',
                [userId, bookId]
            );
            return res.status(200).json({ isLiked: true, message: '좋아요 등록됨' });
        }
    } catch (error) {
        console.error('Error toggling like status:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
});

module.exports = router;
