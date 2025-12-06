const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ensure dotenv is configured in server.js to load environment variables
const ALADIN_API_KEY = process.env.REACT_APP_ALADIN_API_KEY;
const ALADIN_BASE_URL = 'https://www.aladin.co.kr/ttb/api';

// GET /api/books/bestseller - Get bestseller books
router.get('/bestseller', async (req, res) => {
    const { maxResults = 12, start = 1 } = req.query;

    try {
        const response = await axios.get(url);
        const data = await response.data;

        res.json(data);
    } catch (error) {
        console.error('Error fetching bestsellers:', error);
        res.status(500).json({ message: 'Failed to fetch bestseller books' });
    }
});

// GET /api/books/search - Search books by query
router.get('/search', async (req, res) => {
    const { query, maxResults = 12, start = 1 } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(url);
        const data = await response.data;

        res.json(data);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Failed to search books' });
    }
});

// GET /api/books/isbn-lookup - Lookup book by ISBN
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
