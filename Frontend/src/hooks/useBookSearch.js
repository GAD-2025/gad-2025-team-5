// src/hooks/useBookSearch.js

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Transform Aladin API response items to frontend Book type
const transformBooks = (items) => {
  if (!items || !items.length) return [];

  return items.map((item) => ({
    id: item.isbn13 || item.itemId?.toString() || String(Math.random()),
    title: item.title,
    authors: item.author ? item.author.split(',').map(author => author.trim()) : [],
    thumbnail: item.cover ? item.cover.replace('coversum', 'cover500') : '',
    price: item.priceStandard,
    datetime: item.pubDate,
  }));
};

// Fetch bestseller books from backend
const fetchBestsellers = async (pageNum, maxResults = 12) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/bestseller`, {
      params: { start: pageNum, maxResults },
    });
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
};

// Search books from backend
const searchBooks = async (query, pageNum, maxResults = 12) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/search`, {
      params: { query, start: pageNum, maxResults },
    });
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const useBookSearch = (initialQuery = "Bestseller") => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadBooks = useCallback(async (query, pageNum) => {
    setIsLoading(true);
    let newBooks;
    if (query === 'Bestseller') {
      newBooks = await fetchBestsellers(pageNum);
    } else {
      newBooks = await searchBooks(query, pageNum);
    }

    setBooks((prevBooks) => (pageNum === 1 ? newBooks : [...prevBooks, ...newBooks]));
    setHasMore(newBooks.length > 0);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBooks(initialQuery, 1);
  }, [initialQuery, loadBooks]);

  const search = (query) => {
    setPage(1);
    loadBooks(query || initialQuery, 1);
  };

  const loadMore = (query) => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadBooks(query || initialQuery, nextPage);
    }
  };

  return { books, isLoading, hasMore, search, loadMore };
};
