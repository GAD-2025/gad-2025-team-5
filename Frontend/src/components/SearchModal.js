import React from 'react';
import './SearchModal.css';

const SearchModal = ({ onClose }) => {
    return (
        <div className="search-modal-overlay">
            <div className="search-modal-content">
                <div className="search-modal-header">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        className="search-modal-input"
                    />
                    <button onClick={onClose} className="search-modal-close-button">
                        취소
                    </button>
                </div>
                <div className="search-modal-body">
                    {/* Search results or recent searches can go here */}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
