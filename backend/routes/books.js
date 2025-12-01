const express = require('express');
const router = express.Router();

const ALADIN_API_KEY = 'ttbmiru1352156001';
const ALADIN_BASE_URL = 'https://www.aladin.co.kr/ttb/api';

// GET /api/books/bestseller - Get bestseller books
router.get('/bestseller', async (req, res) => {
    const { maxResults = 12, start = 1 } = req.query;

    try {
        const url = `${ALADIN_BASE_URL}/ItemList.aspx?ttbkey=${ALADIN_API_KEY}&output=js&Version=20131101&QueryType=Bestseller&MaxResults=${maxResults}&start=${start}&SearchTarget=Book`;

        const response = await fetch(url);
        const data = await response.json();

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
        const url = `${ALADIN_BASE_URL}/ItemSearch.aspx?ttbkey=${ALADIN_API_KEY}&output=js&Version=20131101&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=${maxResults}&start=${start}&SearchTarget=Book`;

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Failed to search books' });
    }
});

module.exports = router;
