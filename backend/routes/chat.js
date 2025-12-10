const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/conversations - Fetch all conversations for the current user
router.get('/conversations', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // This query finds all users the current user has sent messages to or received messages from
        const [rows] = await pool.query(
            `SELECT DISTINCT u.id, u.nickname
             FROM users u
             JOIN (
                 SELECT DISTINCT receiver_id AS user_id FROM chat_messages WHERE sender_id = ?
                 UNION
                 SELECT DISTINCT sender_id AS user_id FROM chat_messages WHERE receiver_id = ?
             ) AS conversations ON u.id = conversations.user_id
             WHERE u.id != ?`,
            [userId, userId, userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/chat/history/:otherUserId - Fetch chat history with a specific user
router.get('/history/:otherUserId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    try {
        const [messages] = await pool.query(
            `SELECT * FROM chat_messages
             WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
             ORDER BY created_at ASC`,
            [userId, otherUserId, otherUserId, userId]
        );
        res.json(messages);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/chat/send - Send a message to another user
router.post('/send', authenticateToken, async (req, res) => {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message) {
        return res.status(400).json({ message: 'Receiver ID and message are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiver_id, message]
        );
        const [newMessage] = await pool.query('SELECT * FROM chat_messages WHERE id = ?', [result.insertId]);
        res.status(201).json(newMessage[0]);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
