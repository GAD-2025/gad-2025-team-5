const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); // The database connection pool

const router = express.Router();

// POST /api/auth/register - User Registration
router.post('/register', async (req, res) => {
    const { email, password, nickname } = req.body;

    // Basic validation
    if (!email || !password || !nickname) {
        return res.status(400).json({ message: 'Email, password, and nickname are required.' });
    }

    try {
        // Check if email or nickname already exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR nickname = ?',
            [email, nickname]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email or nickname already in use.' });
        }

        // Hash the password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const [result] = await pool.query(
            'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
            [email, hashedPassword, nickname]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
