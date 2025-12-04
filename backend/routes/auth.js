const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // The database connection pool

const router = express.Router();

// POST /api/auth/check-availability - Check if email/nickname is available
router.post('/check-availability', async (req, res) => {
    const { email, nickname } = req.body;

    if (!email || !nickname) {
        return res.status(400).json({ message: 'Email and nickname are required.' });
    }

    try {
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR nickname = ?',
            [email, nickname]
        );

        if (existingUsers.length > 0) {
            const emailTaken = existingUsers.some(u => u.email === email);
            const nicknameTaken = existingUsers.some(u => u.nickname === nickname);

            if (emailTaken && nicknameTaken) {
                return res.status(409).json({ message: 'Email and nickname are already in use.' });
            } else if (emailTaken) {
                return res.status(409).json({ message: 'Email is already in use.' });
            } else {
                return res.status(409).json({ message: 'Nickname is already in use.' });
            }
        }

        res.status(200).json({ available: true, message: 'Email and nickname are available.' });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/auth/register-complete - Complete registration with onboarding data
router.post('/register-complete', async (req, res) => {
    const { email, password, nickname, genres, books } = req.body;

    // Basic validation
    if (!email || !password || !nickname) {
        return res.status(400).json({ message: 'Email, password, and nickname are required.' });
    }

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
        return res.status(400).json({ message: 'At least one genre must be selected.' });
    }

    if (!books || !Array.isArray(books) || books.length < 3) {
        return res.status(400).json({ message: 'At least 3 books must be selected.' });
    }

    const connection = await pool.getConnection();

    try {
        console.log('[REGISTER] Received registration request.');
        await connection.beginTransaction();
        console.log('[REGISTER] Database transaction started.');

        // Check if email or nickname already exists
        const [existingUsers] = await connection.query(
            'SELECT * FROM users WHERE email = ? OR nickname = ?',
            [email, nickname]
        );

        if (existingUsers.length > 0) {
            console.log('[REGISTER] Conflict: Email or nickname already in use.');
            await connection.rollback();
            connection.release();
            return res.status(409).json({ message: 'Email or nickname already in use.' });
        }

        // Hash the password
        console.log(`[REGISTER] BCRYPT_SALT_ROUNDS is set: ${process.env.BCRYPT_SALT_ROUNDS ? 'Yes' : 'No'}`);
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
        console.log('[REGISTER] Hashing password...');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('[REGISTER] Password hashed successfully.');

        // Insert the new user
        console.log('[REGISTER] Inserting new user into database...');
        const [userResult] = await connection.query(
            'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
            [email, hashedPassword, nickname]
        );
        console.log('[REGISTER] User inserted successfully.');

        const newUserId = userResult.insertId;

        // Get genre IDs from names
        const placeholders = genres.map(() => '?').join(',');
        const [genreRows] = await connection.query(
            `SELECT id, name FROM genres WHERE name IN (${placeholders})`,
            genres
        );

        if (genreRows.length !== genres.length) {
            const foundGenres = genreRows.map(g => g.name);
            const missingGenres = genres.filter(g => !foundGenres.includes(g));
            console.log(`[REGISTER] Error: Invalid genres provided: ${missingGenres.join(', ')}`);
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: `Invalid genres: ${missingGenres.join(', ')}` });
        }

        // Insert user interests
        const interestValues = genreRows.map(genre => [newUserId, genre.id]);
        if (interestValues.length > 0) {
            await connection.query('INSERT IGNORE INTO user_interests (user_id, genre_id) VALUES ?', [interestValues]);
            console.log('[REGISTER] User interests inserted.');
        }

        // Insert user preferences for genres and books
        const genresJson = JSON.stringify(genres);
        const booksJson = JSON.stringify(books);
        await connection.query(
            'INSERT INTO user_preferences (user_id, genres, books) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE genres = VALUES(genres), books = VALUES(books)',
            [newUserId, genresJson, booksJson]
        );
        console.log('[REGISTER] User preferences inserted.');

        // Generate token before committing
        console.log(`[REGISTER] JWT_SECRET is set: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
        console.log('[REGISTER] Generating JWT token...');
        const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('[REGISTER] JWT token generated successfully.');

        await connection.commit();
        console.log('[REGISTER] Database transaction committed.');
        connection.release();

        res.status(201).json({
            message: 'User registered successfully!',
            token: token,
            userId: newUserId
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        console.error('--- !!! REGISTRATION ERROR !!! ---');
        console.error('An error occurred during the registration process. Full error object:');
        console.error(error);
        console.error('------------------------------------');
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/auth/login - User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Check if the user has selected interests to determine if they are a new user
            const [interests] = await pool.query('SELECT * FROM user_interests WHERE user_id = ?', [user.id]);
            const isNewUser = interests.length === 0;

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, message: 'Login successful!', token, isNewUser });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
