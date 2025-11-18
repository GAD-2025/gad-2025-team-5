import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './style.css';
import './list.css';
import BookCard from './BookCard';

const allBookData = {
    recommendations: [
        { title: '모순', author: '양귀자', price: '10,800원', time: '1일 전', img: '모순.png', badge: 'S', liked: true },
        { title: '불편한 편의점', author: '김호연', price: '11,000원', time: '2일 전', img: '불편한.png', badge: 'B', liked: false },
        { title: '장미와 나이프', author: '히가시노 게이고', price: '10,800원', time: '5일 전', img: '장미와 나이프.jpeg', badge: 'C', liked: false },
        { title: '세이노의 가르침', author: '세이노', price: '6,480원', time: '3일 전', img: '세이노의 가르침.jpeg', badge: 'S', liked: false },
        { title: '역행자', author: '자청', price: '15,750원', time: '1일 전', img: '역행자.jpeg', badge: 'A', liked: true },
        { title: '도둑맞은 집중력', author: '요한 하리', price: '17,820원', time: '10일 전', img: '도둑맞은 집중력.jpeg', badge: 'C', liked: false },
        { title: '데일 카네기 인간관계론', author: '데일 카네기', price: '10,350원', time: '7일 전', img: 'https://image.aladin.co.kr/product/1924/7/cover500/8932900427_1.jpg', badge: 'A', liked: false },
        { title: '원씽', author: '게리 켈러', price: '12,600원', time: '4일 전', img: 'https://image.aladin.co.kr/product/39/22/cover500/8965960962_1.jpg', badge: 'S', liked: true },
    ],
    realtime: [
        { title: '소년이 온다', author: '한강', price: '12,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/5087/8/cover500/8936475113_1.jpg', badge: 'A', liked: true },
        { title: '꺼벙이 억수', author: '윤수현', price: '4,000원', time: '2일 전', img: 'https://image.aladin.co.kr/product/13/7/cover500/8995351109_1.jpg', badge: 'D', liked: false },
        { title: '악의', author: '히가시노 게이고', price: '6,800원', time: '5일 전', img: 'https://image.aladin.co.kr/product/1935/11/cover500/8982814307_1.jpg', badge: 'S', liked: false },
        { title: '달러구트 꿈 백화점', author: '이미예', price: '10,000원', time: '3일 전', img: '달러구트 꿈백화점.jpeg', badge: 'S', liked: false },
        { title: '파친코 1', author: '이민진', price: '11,500원', time: '1일 전', img: 'https://image.aladin.co.kr/product/28932/29/cover500/K842830332_1.jpg', badge: 'A', liked: true },
        { title: '구의 증명', author: '최진영', price: '8,000원', time: '8일 전', img: 'https://image.aladin.co.kr/product/1359/74/cover500/8954652352_1.jpg', badge: 'B', liked: false },
    ]
};

const List = () => {
    const { category } = useParams();
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        let booksToRender = [];
        let pageTitle = '';

        if (category === 'recommendations') {
            booksToRender = allBookData.recommendations;
            pageTitle = '추천 도서';
        } else if (category === 'realtime') {
            booksToRender = allBookData.realtime;
            pageTitle = '실시간 매물 도서';
        } else {
            pageTitle = '도서 목록';
        }
        setBooks(booksToRender);
        setTitle(pageTitle);
    }, [category]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                setToastMessage('');
            }, 2000); // Hide after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleHeartClick = (clickedTitle) => {
        const newBooks = books.map(book =>
            book.title === clickedTitle ? { ...book, liked: !book.liked } : book
        );
        setBooks(newBooks);

        const clickedBook = newBooks.find(book => book.title === clickedTitle);
        if (clickedBook.liked) {
            setToastMessage('관심 상품에 추가했어요.');
        } else {
            setToastMessage('관심 상품에서 삭제했어요.');
        }
        setShowToast(true);
    };

    return (
        <div className="iphone-container">
            <div className="status-bar">
                <div className="time">9:41</div>
                <div className="camera"></div>
                <div className="status-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                </div>
            </div>
            <main className="screen-content">
                <header className="list-page-header">
                    <Link to="/home" className="back-button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <h1 className="list-page-title">{title}</h1>
                </header>

                <div className="list-page-content">
                    {books.map(book => (
                        <BookCard key={book.title} book={book} onHeartClick={handleHeartClick} />
                    ))}
                </div>
            </main>
            {showToast && (
                <div className="toast-message">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default List;
