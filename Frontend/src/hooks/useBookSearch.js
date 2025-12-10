// src/hooks/useBookSearch.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TTB_KEY = process.env.REACT_APP_ALADIN_API_KEY;

const BESTSELLER_URL = '/ttb/api/ItemList.aspx';
const SEARCH_URL = '/ttb/api/ItemSearch.aspx';

// Transform Aladin API response items to frontend Book type
const transformBooks = (items) => {
  if (!items || !items.length) return [];

  return items.map((item) => ({
    id: item.isbn13 || item.itemId.toString(),
    title: item.title,
    authors: item.author ? item.author.split(',').map(author => author.trim()) : [],
    thumbnail: item.cover ? item.cover.replace('coversum', 'cover500') : '',
    price: item.priceStandard,
    datetime: item.pubDate,
    isbn: item.isbn13 // ✅ ISBN 필드 명시적 추가 (바코드 확인용)
  }));
};

// Fetch bestseller books from Aladin API
const fetchBestsellers = async (pageNum, maxResults = 20) => {
  try {
    const response = await axios.get(BESTSELLER_URL, {
      params: {
        ttbkey: TTB_KEY,
        QueryType: 'Bestseller',
        MaxResults: maxResults,
        start: pageNum,
        SearchTarget: 'Book',
        output: 'js',
        Version: '20131101',
      },
    });
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
};

// Search books from Aladin API
const searchBooks = async (query, pageNum, maxResults = 20) => {
  try {
    const response = await axios.get(SEARCH_URL, {
      params: {
        ttbkey: TTB_KEY,
        Query: query,
        MaxResults: maxResults,
        start: pageNum,
        SearchTarget: 'Book',
        output: 'js',
        Version: '20131101',
      },
    });
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// 🆕 [추가됨] ISBN(바코드) 전용 검색 함수
const fetchBookByISBN = async (isbn) => {
  try {
    const response = await axios.get('/ttb/api/ItemLookUp.aspx', {
      params: {
        ttbkey: TTB_KEY,
        itemIdType: 'ISBN',
        ItemId: isbn,
        output: 'js',
        Version: '20131101',
      },
    });
    console.log('Aladin API Response:', response);
    return transformBooks(response.data.item || []);
  } catch (error) {
    console.error('Error searching by ISBN:', error);
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

  // 🆕 [추가됨] 바코드 찍으면 실행될 함수
  const searchByISBN = async (isbn) => {
    setIsLoading(true);
    setPage(1);
    // 1. ISBN으로 책 데이터 가져오기
    const newBook = await fetchBookByISBN(isbn);
    
    // 2. 기존 리스트를 싹 지우고 방금 찾은 책 1권만 보여주기
    setBooks(newBook); 
    setHasMore(false); // 1권 뿐이니 '더보기' 금지
    setIsLoading(false);
  };

  // ✅ searchByISBN을 밖으로 내보냄
  return { books, isLoading, hasMore, search, loadMore, searchByISBN };
};