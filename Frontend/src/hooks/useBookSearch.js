// src/hooks/useBookSearch.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 백엔드 API 엔드포인트
const BESTSELLER_URL = 'http://localhost:3001/api/books/bestseller';
const SEARCH_URL = 'http://localhost:3001/api/books/search';
const ISBN_LOOKUP_URL = 'http://localhost:3001/api/books/isbn-lookup';

// 백엔드에서 이미 처리하므로 TTB_KEY는 프론트엔드에서 더 이상 필요 없음
// const TTB_KEY = process.env.REACT_APP_ALADIN_API_KEY;

// Transform Aladin API response items to frontend Book type
// 백엔드에서 오는 데이터 구조는 이미 Aladin의 'item' 배열이므로,
// 이 함수는 그대로 사용 가능.
const transformBooks = (items) => {
  if (!items || !items.length) return [];

  return items.map((item) => ({
    id: item.isbn13 || item.itemId.toString(),
    title: item.title,
    authors: item.author ? item.author.split(',').map(author => author.trim()) : [],
    thumbnail: item.cover ? item.cover.replace('coversum', 'cover500') : '',
    price: item.priceStandard,
    datetime: item.pubDate,
    isbn: item.isbn13
  }));
};

// Fetch bestseller books from our backend API
const fetchBestsellers = async (pageNum, maxResults = 20) => {
  try {
    // 이제 우리 백엔드 API를 호출합니다.
    const response = await axios.get(BESTSELLER_URL, {
      params: {
        // 백엔드가 Aladin 파라미터를 관리하므로, 페이징 정보만 넘깁니다.
        maxResults: maxResults,
        start: pageNum,
      },
    });
    // 백엔드가 Aladin 응답의 'item' 필드를 그대로 반환한다고 가정합니다.
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
};

// Search books from our backend API
const searchBooks = async (query, pageNum, maxResults = 20) => {
  try {
    // 이제 우리 백엔드 API를 호출합니다.
    const response = await axios.get(SEARCH_URL, {
      params: {
        // 백엔드가 Aladin 파라미터를 관리하므로, 검색어와 페이징 정보만 넘깁니다.
        query: query,
        maxResults: maxResults,
        start: pageNum,
      },
    });
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// Fetch book by ISBN from our backend API
const fetchBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(ISBN_LOOKUP_URL, {
      params: { isbn: isbn },
    });
    // Check if Aladin API returned a 200 OK but with an internal error message
    if (response.data.errorCode) {
        throw new Error(response.data.errorMessage || 'Aladin API returned an error.');
    }
    // Check if the book item exists
    if (!response.data.item || response.data.item.length === 0) {
        throw new Error('Book not found with this ISBN.');
    }
    return transformBooks(response.data.item);
  } catch (error) {
    // Re-throw the error to be caught by the calling function
    // This includes network errors from axios or the custom errors thrown above
    throw error;
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

  const searchByISBN = async (isbn) => {
    setIsLoading(true);
    setPage(1);
    try {
      const newBook = await fetchBookByISBN(isbn);
      setBooks(newBook);
      setHasMore(false);
    } catch (error) {
      // Provide user-friendly feedback on failure
      const errorMessage = error?.response?.data?.message || error.message;
      alert(`책을 찾을 수 없습니다. (ISBN: ${isbn})\n오류: ${errorMessage}`);
      setBooks([]); // Clear any previous results
    } finally {
      setIsLoading(false);
    }
  };

  return { books, isLoading, hasMore, search, loadMore, searchByISBN };
};