// src/hooks/useBookSearch.js

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ALADIN_API_KEY = process.env.REACT_APP_ALADIN_API_KEY;

// API 호출을 위한 범용 함수
const fetchAladinData = async (endpoint, params) => {
  if (!ALADIN_API_KEY) {
    console.error('Aladin API key is missing. Please check your .env file.');
    return [];
  }
  try {
    // The proxy in package.json will forward this request to http://www.aladin.co.kr
    const url = `/ttb/api${endpoint}`;
    console.log('[Aladin URL]', url); // For debugging

    const response = await axios.get(url, {
      params: {
        ttbkey: ALADIN_API_KEY,
        output: 'js',
        Version: '20131101',
        ...params,
      },
    });

    // 알라딘 API는 JSONP 유사 형태로 응답을 반환하므로, 실제 JSON 객체를 파싱해야 합니다.
    let items = [];
    if (typeof response.data === 'string') {
      const jsonString = response.data.substring(response.data.indexOf('{'), response.data.lastIndexOf('}') + 1);
      const parsedData = JSON.parse(jsonString);
      items = parsedData.item || [];
    } else if (response.data && response.data.item) {
      items = response.data.item;
    }

    if (!items.length) return [];

    // API 응답을 프론트엔드 Book 타입으로 매핑
    return items.map((item) => ({
      id: item.isbn13 || item.itemId.toString(),
      title: item.title,
      authors: item.author ? item.author.split(',').map(author => author.trim()) : [],
      thumbnail: item.cover.replace('coversum', 'cover500'), // 더 큰 이미지로 교체
      price: item.priceStandard,
      datetime: item.pubDate,
    }));
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
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
      newBooks = await fetchAladinData('/ItemList.aspx', {
        QueryType: 'Bestseller',
        MaxResults: 12, // 3열 그리드에 적합하게
        start: pageNum,
        SearchTarget: 'Book',
      });
    } else {
      newBooks = await fetchAladinData('/ItemSearch.aspx', {
        Query: query,
        QueryType: 'Title',
        MaxResults: 12, // 3열 그리드에 적합하게
        start: pageNum,
        SearchTarget: 'Book',
      });
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
