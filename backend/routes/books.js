const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Aladin API
const ALADIN_API_KEY = process.env.REACT_APP_ALADIN_API_KEY;
const ALADIN_BASE_URL = 'https://www.aladin.co.kr/ttb/api';

// POST /api/books - Create a new book
router.post('/', authenticateToken, async (req, res) => {
    console.log('Request body:', req.body);
    const userId = req.user.id;
    console.log('User ID:', userId);
    const { title, description, oneLineReview, price, shippingOption, priceSuggestion, imageUrl } = req.body;

    if (!title || !price) {
        return res.status(400).json({ message: 'Title and price are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO books (user_id, title, description, one_line_review, price, shipping_option, price_suggestion, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, oneLineReview, price, shippingOption, priceSuggestion, imageUrl]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/books - Get all books
router.get('/', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/books/:id - Get a single book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        if (books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(books[0]);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/books/bestseller - Get bestseller books from Aladin
router.get('/bestseller', async (req, res) => {
    const { maxResults = 12, start = 1 } = req.query;
    const url = `${ALADIN_BASE_URL}/ItemList.aspx?ttbkey=${ALADIN_API_KEY}&QueryType=Bestseller&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=json&Version=20131101`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching bestsellers:', error);
        res.status(500).json({ message: 'Failed to fetch bestseller books' });
    }
});

// GET /api/books/search - Search books by query from Aladin
router.get('/search', async (req, res) => {
    const { query, maxResults = 12, start = 1 } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    const url = `${ALADIN_BASE_URL}/ItemSearch.aspx?ttbkey=${ALADIN_API_KEY}&Query=${query}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=json&Version=20131101`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Failed to search books' });
    }
});

// GET /api/books/isbn-lookup - Lookup book by ISBN from Aladin
router.get('/isbn-lookup', async (req, res) => {
    const { isbn } = req.query;

    if (!isbn) {
        return res.status(400).json({ message: 'ISBN parameter is required' });
    }

    try {
        const url = `${ALADIN_BASE_URL}/ItemLookUp.aspx?ttbkey=${ALADIN_API_KEY}&itemIdType=ISBN&ItemId=${isbn}&output=json&Version=20131101`;

        const response = await axios.get(url);
        const data = await response.data;

        if (data.item && data.item.length > 0) {
            res.json(data.item[0]); // Return the first item found
        } else {
            res.status(404).json({ message: 'Book not found for the given ISBN' });
        }
    } catch (error) {
        console.error('Error looking up book by ISBN:', error);
        res.status(500).json({ message: 'Failed to lookup book by ISBN' });
    }
});

module.exports = router;
