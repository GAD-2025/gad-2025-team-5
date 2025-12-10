import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CommunityPostDetail.css'; // We'll create this CSS file

const CommunityPostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([
        {
            id: 1,
            avatar: '/images/seller-icon.png',
            username: '난난판다',
            role: '아날로그 독서가',
            title: '표지 예쁘고, 재밌는 책 추천 좀',
            fullContent: '표지는 마음에 드는데 막상 내용은 별로일 때가 많아서 추천이 간절해요ㅠㅠ 취향 맞는 책 찾고 싶어요. 다들 어떤 책 읽으시나요? 댓글로 추천 부탁드립니다!',
            likes: 1,
            comments: [
                { id: 1, username: '독서광', text: '저는 최근에 "달러구트 꿈 백화점" 읽었는데 정말 좋았어요!' },
                { id: 2, username: '책벌레', text: '표지 예쁜 책은 "모순"도 괜찮아요. 내용도 좋아요.' }
            ],
            image: '/images/모순.png',
            time: '5분 전',
            type: 'all',
            isLiked: false
        },
        {
            id: 2,
            avatar: '/images/seller-icon.png',
            username: '판다다',
            role: '전자책 매니아',
            title: '최근 종이책이 유행이네요',
            fullContent: '그런데 최근 책값이 많이 올라서 부담이 되네요 새 책은 너무 비싸서 중고로 사고 싶어서 가입했어요. 다들 중고책은 어디서 구매하시나요? 좋은 팁 있으면 공유해주세요!',
            likes: 3,
            comments: [
                { id: 1, username: '중고책사랑', text: '당근마켓이나 알라딘 중고서점 자주 이용해요!' },
                { id: 2, username: '책방지기', text: '저희 동네 작은 책방에서도 중고책 팔아요~' }
            ],
            image: '/images/불편한 편의점.png',
            time: '13분 전',
            type: 'popular',
            isLiked: false
        },
        {
            id: 3,
            avatar: '/images/seller-icon.png',
            username: '판따',
            role: '동화 육아 마스터',
            title: '잠자기 전에 동화책 매일 읽어줘요',
            fullContent: '아이에게 좋다길래, 중고로 전권 구매했어요~ 좋은 거래자분 만나서 합리적인 가격에 얻었어요! 혹시 아이에게 읽어주기 좋은 동화책 있으면 추천해주세요!',
            likes: 7,
            comments: [
                { id: 1, username: '육아맘', text: '저희 아이는 "구름빵" 정말 좋아해요!' },
                { id: 2, username: '동화작가', text: '전래동화나 이솝우화도 좋아요.' }
            ],
            image: '/images/역행자.jpeg',
            time: '21분 전',
            type: 'my-posts',
            isLiked: false
        },
        {
            id: 4,
            avatar: '/images/seller-icon.png',
            username: '난난판다',
            role: '아날로그 독서가',
            title: '읽고 싶은 책이 너무 많아요',
            fullContent: '요즘 읽고 싶은 책이 너무 많은데 시간이 없네요. 다들 어떻게 시간 관리하시나요? 독서 시간을 늘리는 팁이 있다면 공유해주세요!',
            likes: 5,
            comments: [
                { id: 1, username: '시간관리왕', text: '저는 출퇴근 시간에 오디오북 들어요!' },
                { id: 2, username: '독서습관', text: '매일 30분씩이라도 꾸준히 읽는 게 중요해요.' }
            ],
            image: '/images/세이노의 가르침.jpeg',
            time: '1시간 전',
            type: 'all',
            isLiked: false
        },
        {
            id: 5,
            avatar: '/images/seller-icon.png',
            username: '판다다',
            role: '전자책 매니아',
            title: '전자책 리더기 추천해주세요',
            fullContent: '전자책 리더기 구매하려고 하는데 어떤 제품이 좋을까요? 사용 후기 부탁드립니다! 특히 눈의 피로도가 적은 제품이면 좋겠어요.',
            likes: 10,
            comments: [
                { id: 1, username: '리더기유저', text: '크레마 사운드업 추천해요! 가볍고 좋아요.' },
                { id: 2, username: '페이퍼프로', text: '저는 리디 페이퍼 프로 쓰는데 만족합니다.' }
            ],
            image: '/images/도둑맞은 집중력.jpeg',
            time: '2시간 전',
            type: 'popular',
            isLiked: false
        }
    ]);

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
