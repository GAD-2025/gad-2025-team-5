import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';
import BookCard from '../BookCard';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userBooks, setUserBooks] = useState([]);

    useEffect(() => {
        console.log('MyPage useEffect triggered');
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/');
                return;
            }

            try {
                console.log('Fetching user data...');
                // Fetch user info to get the user ID
                const userResponse = await axios.get('http://localhost:3005/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userResponse.data);
                console.log('User data fetched:', userResponse.data);

                // Fetch user's registered books
                console.log('Fetching user books...');
                const booksResponse = await axios.get(`http://localhost:3005/api/users/${userResponse.data.id}/books`);
                setUserBooks(booksResponse.data);
                console.log('User books fetched:', booksResponse.data);

            } catch (error) {
                console.error('Error fetching user data or books:', error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log('Unauthorized or Forbidden, removing token and redirecting');
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mypage-container">
            <header className="app-header">
                <h1 className="logo">마이페이지</h1>
            </header>
            <main className="screen-content">
                <div className="profile-section">
                    <img src="/images/seller-icon.png" alt="Profile" className="profile-image" />
                    <div className="profile-info">
                        <p className="profile-name">{user.nickname}</p>
                        <p className="profile-email">{user.email}</p>
                    </div>
                </div>

                <div className="menu-section">
                    <div className="menu-item">
                        <span>판매 내역</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    
                    <div className="user-books-list">
                        {userBooks.length > 0 ? (
                            userBooks.map(book => (
                                <BookCard key={book.id} book={book} onSelect={handleBookClick} />
                            ))
                        ) : (
                            <p>등록한 책이 없습니다.</p>
                        )}
                    </div>

                    <div className="menu-item">
                        <span>구매 내역</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div className="menu-item">
                        <span>관심 목록</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                </div>

                <div className="logout-section">
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MyPage;
