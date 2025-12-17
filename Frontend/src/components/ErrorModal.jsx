import React from 'react';
import './ErrorModal.css';

const ErrorModal = ({ show, onClose, title, message, buttonText = '다시 시도' }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <button className="modal-button" onClick={onClose}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
