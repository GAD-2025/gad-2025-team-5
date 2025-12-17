import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../BookCard'; // Adjust path if necessary
import './CategoryPage.css'; // We'll create this CSS file

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksByCategory = async () => {
            try {
                setLoading(true);
                // Fetch all books
                const response = await axios.get('https://route.nois.club:3005/api/books');
                // Filter by genre matching the categoryName from the URL
                const filtered = response.data.filter(book => book.genre === categoryName);
                setBooks(filtered);
            } catch (error) {
                console.error(`Error fetching books for category ${categoryName}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByCategory();
    }, [categoryName]);

    const handleBookClick = (bookId) => {
        // The book IDs from the backend are integers, so this should work correctly
        // with the dynamic DetailPage.
        navigate(`/books/${bookId}`);
    };

    return (
        <div className="iphone-container category-page-container">
            <header className="app-header">
                <Link to="/home" className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </Link>
                <h1 className="logo">{categoryName}</h1>
            </header>
            <main className="scrollable-content">
                {loading ? (
                    <p>Loading...</p>
                ) : books.length > 0 ? (
                    <div className="category-book-grid">
                        {books.map(book => (
                            <BookCard key={book.id} book={book} onSelect={() => handleBookClick(book.id)} />
                        ))}
                    </div>
                ) : (
                    <p>'{categoryName}' 카테고리에 해당하는 책이 없습니다.</p>
                )}
            </main>
        </div>
    );
};

export default CategoryPage;