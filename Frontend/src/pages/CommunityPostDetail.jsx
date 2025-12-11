import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CommunityPostDetail.css'; // We'll create this CSS file

import { posts as initialPosts } from '../communityData';

const CommunityPostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState(initialPosts);

    const post = posts.find(p => p.id === parseInt(id));

    const handleLikeToggle = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === postId
                    ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
                    : p
            )
        );
    };

    const [newComment, setNewComment] = useState('');

    const handleAddComment = (postId) => {
        if (newComment.trim() === '') return;

        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        comments: [
                            ...p.comments,
                            { id: p.comments.length + 1, username: '현재사용자', text: newComment }
                        ]
                    }
                    : p
            )
        );
        setNewComment('');
    };

    if (!post) {
        return <div className="community-post-detail-container">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="community-post-detail-container">
            <header className="post-detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <h1>{post.title}</h1>
                <button className="more-options-button">
                    <i className="fa-solid fa-ellipsis-v"></i>
                </button>
            </header>
            <main className="post-detail-content">
                <div className="post-user-info">
                    <img src={post.avatar} alt="avatar" className="user-avatar" />
                    <div className="user-details">
                        <span className="username">{post.username}</span>
                        <span className="user-role">{post.role}</span>
                    </div>
                </div>
                <img src={post.image} alt="post" className="post-image-detail" />
                <p className="post-full-content">{post.fullContent}</p>
                <div className="post-actions-detail">
                    <span className="action-item" onClick={() => handleLikeToggle(post.id)}>
                        <i className={post.isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i> {post.likes}
                    </span>
                    <span className="action-item">
                        <i className="fa-solid fa-comment"></i> {post.comments.length}
                    </span>
                    <span className="post-time-detail">{post.time}</span>
                </div>

                <div className="comments-section">
                    <h3>댓글</h3>
                    {post.comments.length === 0 ? (
                        <p>아직 댓글이 없습니다.</p>
                    ) : (
                        post.comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <span className="comment-username">{comment.username}</span>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                        ))
                    )}
                    <div className="comment-input-area">
                        <input
                            type="text"
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button onClick={() => handleAddComment(post.id)}>등록</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CommunityPostDetail;
